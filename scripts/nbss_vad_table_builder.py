#!/usr/bin/env python3
from __future__ import annotations

import argparse
import io
import json
import os
import shutil
import subprocess
import threading
import time
from collections import deque
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Any

try:
    from scripts.audio_runtime_bootstrap import bootstrap_audio_runtime
except ModuleNotFoundError:
    from audio_runtime_bootstrap import bootstrap_audio_runtime

bootstrap_audio_runtime()

import numpy as np
import requests
from silero_vad import VADIterator
from soundfile import SoundFile

try:
    from scripts.nbss_audio_client import AudioClient
    from scripts.nbss_audio_preprocessor import AudioPreprocessor, sf
    from scripts.nbss_turn_detector import SmartTurnDetector
    from scripts.nbss_vad_client import VoiceActivityDetector
except ModuleNotFoundError:
    from nbss_audio_client import AudioClient
    from nbss_audio_preprocessor import AudioPreprocessor, sf
    from nbss_turn_detector import SmartTurnDetector
    from nbss_vad_client import VoiceActivityDetector


DEFAULT_NBSS_SERVER_ENDPOINT = "http://localhost:8080"


def load_dotenv_file(path: Path) -> dict[str, str]:
    if not path.exists():
        return {}
    values: dict[str, str] = {}
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("export "):
            line = line[7:].strip()
        if "=" not in line:
            continue
        key, raw_value = line.split("=", 1)
        key = key.strip()
        if not key:
            continue
        value = raw_value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
            value = value[1:-1]
        values[key] = value
    return values


def resolve_nbss_base_url() -> str:
    repo_root = Path(__file__).resolve().parent.parent
    for key in ("NBSS_SERVER_ENDPOINT",):
        value = os.getenv(key)
        if value:
            endpoint = value.strip().rstrip("/")
            return endpoint if endpoint.endswith("/nbss") else endpoint + "/nbss"
    for env_file in (Path.cwd() / ".env", repo_root / ".env"):
        value = load_dotenv_file(env_file).get("NBSS_SERVER_ENDPOINT", "").strip()
        if value:
            endpoint = value.rstrip("/")
            return endpoint if endpoint.endswith("/nbss") else endpoint + "/nbss"
    return DEFAULT_NBSS_SERVER_ENDPOINT.rstrip("/") + "/nbss"


def format_fid(fid: str) -> str:
    fid = str(fid).strip()
    return fid if fid.startswith("0x") else "0x" + fid


class AudioVADTableBuilder:
    def __init__(
        self,
        source_audio_fid: str,
        *,
        original_path: str | None = None,
        whisper_workers: int = 8,
        min_segment_duration: float = 5.0,
        max_segments: int | None = None,
        resume_vad_table_fid: str | None = None,
        progress_log_path: str | None = None,
        snapshot_path: str | None = None,
        frame_ms: int = 32,
        pre_roll_ms: int = 300,
        post_roll_ms: int = 500,
        turn_context_sec: float = 3.0,
        nbss_base_url: str | None = None,
    ):
        self.source_audio_fid = format_fid(source_audio_fid)
        self.original_path = original_path
        self.whisper_workers = whisper_workers
        self.min_segment_duration = min_segment_duration
        self.max_segments = max_segments
        self.resume_vad_table_fid = format_fid(resume_vad_table_fid) if resume_vad_table_fid else None
        self.progress_log_path = progress_log_path
        self.snapshot_path = snapshot_path
        self.frame_ms = frame_ms
        self.pre_roll_ms = pre_roll_ms
        self.post_roll_ms = post_roll_ms
        self.turn_context_sec = turn_context_sec
        self.started_at = time.time()
        self.base_url = (nbss_base_url or resolve_nbss_base_url()).rstrip("/")
        self.session = requests.Session()
        self.preprocessor = AudioPreprocessor()
        self.vad = VoiceActivityDetector()
        self.turn = SmartTurnDetector()
        self.audio = AudioClient()
        self.sample_rate = self.preprocessor.target_sample_rate
        self.frame_samples = max(1, int(round(self.sample_rate * self.frame_ms / 1000.0)))
        self.frame_bytes = self.frame_samples * 2
        self.pre_roll_frames = max(1, int(round(self.pre_roll_ms / self.frame_ms)))
        self.post_roll_frames = max(1, int(round(self.post_roll_ms / self.frame_ms)))

    def _nbss_get(self, fid: str) -> bytes:
        response = self.session.get(f"{self.base_url}/{format_fid(fid)}", timeout=120)
        response.raise_for_status()
        return response.content

    def _nbss_put(self, data: bytes | dict[str, Any], *, is_json: bool = False) -> str:
        payload = json.dumps(data).encode("utf-8") if is_json else data
        headers = {"Content-Type": "application/json"} if is_json else None
        response = self.session.put(self.base_url, data=payload, headers=headers, timeout=120)
        response.raise_for_status()
        return response.json()["fid"]

    def _log(self, message: str) -> None:
        line = str(message)
        print(line)
        if self.progress_log_path:
            with open(self.progress_log_path, "a", encoding="utf-8") as file:
                file.write(line + "\n")

    def _write_snapshot(self, vad_table: dict[str, Any], extra: dict[str, Any] | None = None) -> None:
        if not self.snapshot_path:
            return
        payload: dict[str, Any] = {
            "updated_at": round(time.time(), 3),
            "elapsed_sec": round(time.time() - self.started_at, 3),
            "vad_table": vad_table,
        }
        if extra is not None:
            payload["progress"] = extra
        Path(self.snapshot_path).write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

    def _persist_vad_table(self, vad_table: dict[str, Any]) -> str:
        fid = self._nbss_put(vad_table, is_json=True)
        self._write_snapshot(vad_table)
        return fid

    def _load_existing_vad_table(self) -> dict[str, Any] | None:
        if not self.resume_vad_table_fid:
            return None
        response = self.session.get(f"{self.base_url}/{self.resume_vad_table_fid}", timeout=120)
        response.raise_for_status()
        return response.json()

    def _segment_signature(self, segment: dict[str, Any]) -> tuple[float, float, float]:
        return (
            round(float(segment.get("start", 0.0) or 0.0), 3),
            round(float(segment.get("end", 0.0) or 0.0), 3),
            round(float(segment.get("duration", 0.0) or 0.0), 3),
        )

    def _segment_array_to_wav(self, segment_audio: np.ndarray | list[np.ndarray]) -> bytes:
        if isinstance(segment_audio, list):
            segment_audio = np.concatenate(segment_audio) if segment_audio else np.zeros(0, dtype="float32")
        output = io.BytesIO()
        sf.write(output, segment_audio, self.sample_rate, format="WAV", subtype="PCM_16")
        return output.getvalue()

    def _iter_pcm_frames_from_ffmpeg(self, audio_bytes: bytes):
        command = [
            "ffmpeg",
            "-nostdin",
            "-hide_banner",
            "-loglevel",
            "error",
            "-i",
            "pipe:0",
            "-f",
            "s16le",
            "-acodec",
            "pcm_s16le",
            "-ac",
            "1",
            "-ar",
            str(self.sample_rate),
            "pipe:1",
        ]
        process = subprocess.Popen(
            command,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            bufsize=0,
        )
        assert process.stdin is not None and process.stdout is not None and process.stderr is not None
        stderr_chunks: list[bytes] = []

        def feed_stdin() -> None:
            try:
                view = memoryview(audio_bytes)
                chunk_size = 65536
                for offset in range(0, len(audio_bytes), chunk_size):
                    process.stdin.write(view[offset : offset + chunk_size])
                process.stdin.close()
            except BrokenPipeError:
                pass
            except Exception:
                try:
                    process.stdin.close()
                except Exception:
                    pass

        def drain_stderr() -> None:
            try:
                while True:
                    chunk = process.stderr.read(4096)
                    if not chunk:
                        break
                    stderr_chunks.append(chunk)
            except Exception:
                pass

        feeder = threading.Thread(target=feed_stdin, daemon=True)
        stderr_drain = threading.Thread(target=drain_stderr, daemon=True)
        feeder.start()
        stderr_drain.start()
        try:
            leftover = b""
            while True:
                chunk = os.read(process.stdout.fileno(), self.frame_bytes * 8)
                if not chunk:
                    break
                leftover += chunk
                while len(leftover) >= self.frame_bytes:
                    frame_chunk = leftover[: self.frame_bytes]
                    leftover = leftover[self.frame_bytes :]
                    yield np.frombuffer(frame_chunk, dtype="<i2").astype("float32") / 32768.0
            if leftover:
                leftover = leftover + (b"\x00" * (self.frame_bytes - len(leftover)))
                yield np.frombuffer(leftover, dtype="<i2").astype("float32") / 32768.0
        finally:
            try:
                process.stdout.close()
            except Exception:
                pass
            feeder.join(timeout=1)
            stderr_drain.join(timeout=1)
            process.wait(timeout=30)
            if process.returncode != 0:
                error_text = b"".join(stderr_chunks).decode("utf-8", errors="ignore").strip()
                if "Broken pipe" in error_text:
                    return
                raise RuntimeError(f"ffmpeg decode failed: {error_text}")

    def _iter_pcm_frames_from_wav(self, normalized_audio: bytes):
        source = SoundFile(io.BytesIO(normalized_audio))
        try:
            while True:
                chunk = source.read(frames=self.frame_samples, dtype="float32", always_2d=False)
                if len(chunk) == 0:
                    break
                if isinstance(chunk, np.ndarray) and chunk.ndim > 1:
                    chunk = np.mean(chunk, axis=1)
                if len(chunk) < self.frame_samples:
                    chunk = np.pad(chunk, (0, self.frame_samples - len(chunk)))
                yield chunk.astype("float32")
        finally:
            source.close()

    def _iter_stream_frames(self, audio_bytes: bytes):
        if shutil.which("ffmpeg"):
            return self._iter_pcm_frames_from_ffmpeg(audio_bytes), True
        normalized_audio = self.preprocessor.normalize(audio_bytes)
        return self._iter_pcm_frames_from_wav(normalized_audio), False

    def _recent_context_to_wav(self, audio_chunks: list[np.ndarray]) -> bytes | None:
        if not audio_chunks:
            return None
        max_samples = int(round(self.turn_context_sec * self.sample_rate))
        tail = np.concatenate(audio_chunks)
        if len(tail) > max_samples:
            tail = tail[-max_samples:]
        return self._segment_array_to_wav(tail)

    def _finalize_segment(self, segment_start_sample: int, audio_chunks: list[np.ndarray], trailing_silence_frames: int) -> dict[str, Any] | None:
        if not audio_chunks:
            return None
        if trailing_silence_frames > self.post_roll_frames:
            keep_frames = max(0, len(audio_chunks) - (trailing_silence_frames - self.post_roll_frames))
            audio_chunks = audio_chunks[:keep_frames]
        if not audio_chunks:
            return None
        segment_audio = np.concatenate(audio_chunks)
        duration = round(len(segment_audio) / self.sample_rate, 3)
        if duration < self.min_segment_duration:
            return None
        segment_wav = self._segment_array_to_wav(segment_audio)
        turn_audio = self._recent_context_to_wav(audio_chunks) or segment_wav
        turn_result = None
        try:
            turn_result = self.turn.detect(turn_audio)
        except Exception:
            try:
                turn_result = self.turn.detect(turn_audio)
            except Exception:
                turn_result = {"is_complete": True, "probability": 0.0, "fallback": "vad"}
        turn_probability = float(turn_result.get("probability", 0.0) or 0.0)
        if not bool(turn_result.get("is_complete", False)):
            return {"resume": True, "turn_probability": turn_probability}
        segment_start = round(segment_start_sample / self.sample_rate, 3)
        segment_end = round(segment_start + duration, 3)
        segment_audio_fid = self._nbss_put(segment_wav)
        return {
            "segment_id": None,
            "start": segment_start,
            "end": segment_end,
            "duration": duration,
            "audio_fid": segment_audio_fid,
            "turn_complete": True,
            "turn_probability": turn_probability,
            "turn_source": turn_result.get("fallback", "smart-turn"),
        }

    def _transcribe_segment(self, segment: dict[str, Any]) -> dict[str, Any]:
        segment_audio = self._nbss_get(segment["audio_fid"])
        try:
            result = self.audio.transcribe(segment_audio, vad_filter=False, condition_on_previous_text=False)
        except Exception as exc:
            raise RuntimeError(f"transcription_error: {exc}") from exc
        info = result.get("transcription_info", {})
        text = result.get("text", "").strip()
        transcript_fid = self._nbss_put(text.encode("utf-8")) if text else None
        return {
            "language": info.get("language", "unknown"),
            "language_confidence": float(info.get("language_probability", 0.0) or 0.0),
            "text": text,
            "transcript_fid": transcript_fid,
            "transcription_status": "completed",
        }

    def _aggregate_language(self, segments: list[dict[str, Any]]) -> tuple[str, dict[str, float], bool]:
        scores: dict[str, float] = {}
        for segment in segments:
            language = str(segment.get("language", "unknown"))
            confidence = float(segment.get("language_confidence", 0.0) or 0.0)
            scores[language] = scores.get(language, 0.0) + confidence
        if not scores:
            return "unknown", {}, False
        primary = max(scores, key=scores.get)
        ordered = sorted(scores.items(), key=lambda item: item[1], reverse=True)
        is_multilingual = len(ordered) > 1 and ordered[1][1] >= ordered[0][1] * 0.35
        return primary, scores, is_multilingual

    def _update_vad_table_progress(self, vad_table: dict[str, Any], total_duration: float) -> None:
        segments = vad_table.get("segments", [])
        speech_duration = round(sum(float(seg.get("duration", 0.0) or 0.0) for seg in segments), 3)
        speech_ratio = round(speech_duration / total_duration, 4) if total_duration > 0 else 0.0
        primary_language, language_scores, is_multilingual = self._aggregate_language(segments)
        vad_table["segment_count"] = len(segments)
        vad_table["speech_duration_sec"] = speech_duration
        vad_table["speech_ratio"] = speech_ratio
        vad_table["primary_language"] = primary_language
        vad_table["is_multilingual"] = is_multilingual
        vad_table["vad_meta"]["raw_vad_duration"] = speech_duration
        vad_table["language_scores"] = language_scores

    def _snapshot_progress(self, vad_table: dict[str, Any]) -> None:
        self._write_snapshot(
            vad_table,
            extra={
                "transcribed_segments": sum(1 for seg in vad_table.get("segments", []) if seg.get("transcription_status") == "completed"),
                "total_segments": len(vad_table.get("segments", [])),
            },
        )

    def _drain_completed_futures(self, future_map: dict[Any, int], vad_table: dict[str, Any], total_duration: float) -> Exception | None:
        first_error = None
        done = [future for future in list(future_map.keys()) if future.done()]
        for future in done:
            idx = future_map.pop(future)
            try:
                vad_table["segments"][idx].update(future.result())
            except Exception as exc:
                vad_table["segments"][idx]["transcription_status"] = "failed"
                vad_table["segments"][idx]["transcription_error"] = str(exc)
                if first_error is None:
                    first_error = exc
            self._update_vad_table_progress(vad_table, total_duration)
            vad_table["status"] = "building"
            self._snapshot_progress(vad_table)
            self._persist_vad_table(vad_table)
        return first_error

    def _build_streaming_pipeline(self, audio_bytes: bytes, vad_table: dict[str, Any], total_duration: float) -> Exception | None:
        frame_iter, used_ffmpeg = self._iter_stream_frames(audio_bytes)
        vad_iter = VADIterator(self.vad.model, threshold=0.5, sampling_rate=self.sample_rate, min_silence_duration_ms=100, speech_pad_ms=30)
        pre_roll: deque[np.ndarray] = deque(maxlen=self.pre_roll_frames)
        state = "SILENCE"
        current_chunks: list[np.ndarray] = []
        segment_start_sample = 0
        trailing_silence_frames = 0
        raw_vad_segments = 0
        sample_index = 0
        future_error = None
        existing_segments = {self._segment_signature(seg): seg for seg in vad_table.get("segments", [])}
        executor = ThreadPoolExecutor(max_workers=max(1, self.whisper_workers))
        future_map: dict[Any, int] = {}
        try:
            for frame in frame_iter:
                frame_copy = frame.copy()
                event = vad_iter(frame_copy, return_seconds=False)
                sample_index += len(frame_copy)
                pre_roll.append(frame_copy)
                drain_error = self._drain_completed_futures(future_map, vad_table, total_duration)
                if drain_error and future_error is None:
                    future_error = drain_error
                if state == "SILENCE":
                    if event and "start" in event:
                        raw_vad_segments += 1
                        state = "RECORDING"
                        segment_start_sample = max(0, int(event["start"]))
                        current_chunks = list(pre_roll)
                        trailing_silence_frames = 0
                    continue
                current_chunks.append(frame_copy)
                if state == "RECORDING":
                    if event and "end" in event:
                        state = "ENDING_CHECK"
                        trailing_silence_frames = 0
                    continue
                if state == "ENDING_CHECK":
                    if event and "start" in event:
                        raw_vad_segments += 1
                        state = "RECORDING"
                        trailing_silence_frames = 0
                        continue
                    trailing_silence_frames += 1
                    if trailing_silence_frames < self.post_roll_frames:
                        continue
                    finalized = self._finalize_segment(segment_start_sample, current_chunks, trailing_silence_frames)
                    if finalized and finalized.get("resume"):
                        state = "RECORDING"
                        trailing_silence_frames = 0
                        continue
                    if finalized:
                        signature = self._segment_signature(finalized)
                        existing = existing_segments.get(signature)
                        if existing:
                            finalized.update(existing)
                        if not finalized.get("segment_id"):
                            finalized["segment_id"] = f"seg_{len(vad_table['segments']):06d}"
                        if not finalized.get("transcription_status"):
                            finalized["transcription_status"] = "pending"
                        vad_table["segments"].append(finalized)
                        existing_segments[signature] = finalized
                        self._update_vad_table_progress(vad_table, total_duration)
                        self._snapshot_progress(vad_table)
                        self._persist_vad_table(vad_table)
                        if finalized.get("transcription_status") != "completed":
                            future_map[executor.submit(self._transcribe_segment, finalized)] = len(vad_table["segments"]) - 1
                        if self.max_segments and len(vad_table["segments"]) >= self.max_segments:
                            break
                    state = "SILENCE"
                    pre_roll.clear()
                    current_chunks = []
                    trailing_silence_frames = 0
            if current_chunks and (not self.max_segments or len(vad_table["segments"]) < self.max_segments):
                finalized = self._finalize_segment(segment_start_sample, current_chunks, 0)
                if finalized and not finalized.get("resume"):
                    signature = self._segment_signature(finalized)
                    existing = existing_segments.get(signature)
                    if existing:
                        finalized.update(existing)
                    if not finalized.get("segment_id"):
                        finalized["segment_id"] = f"seg_{len(vad_table['segments']):06d}"
                    if not finalized.get("transcription_status"):
                        finalized["transcription_status"] = "pending"
                    vad_table["segments"].append(finalized)
                    self._update_vad_table_progress(vad_table, total_duration)
                    self._snapshot_progress(vad_table)
                    self._persist_vad_table(vad_table)
                    if finalized.get("transcription_status") != "completed":
                        future_map[executor.submit(self._transcribe_segment, finalized)] = len(vad_table["segments"]) - 1
            while future_map:
                done_error = self._drain_completed_futures(future_map, vad_table, total_duration)
                if done_error and future_error is None:
                    future_error = done_error
                if future_map:
                    time.sleep(0.2)
        finally:
            executor.shutdown(wait=True, cancel_futures=False)
        vad_table["vad_meta"]["raw_vad_segments"] = raw_vad_segments
        vad_table["vad_meta"]["streaming_decoder"] = "ffmpeg" if used_ffmpeg else "fallback"
        vad_table["total_duration_sec"] = round(sample_index / self.sample_rate, 3) or total_duration
        self._update_vad_table_progress(vad_table, vad_table["total_duration_sec"])
        return future_error

    def build(self) -> tuple[str, dict[str, Any]]:
        source_audio = self._nbss_get(self.source_audio_fid)
        try:
            normalized_audio, was_preprocessed = self.preprocessor.ensure_normalized(source_audio)
        except Exception as exc:
            raise RuntimeError(f"preprocess_error: {exc}") from exc
        normalized_audio_fid = self._nbss_put(normalized_audio) if was_preprocessed else self.source_audio_fid
        info = SoundFile(io.BytesIO(normalized_audio))
        original_format = os.path.splitext(self.original_path or "")[1].lower().strip(".") or "unknown"
        vad_table = {
            "type": "AudioVADTable",
            "schema_version": "1.0",
            "status": "building",
            "source_audio_fid": self.source_audio_fid,
            "normalized_audio_fid": normalized_audio_fid,
            "sample_rate": info.samplerate,
            "channels": info.channels,
            "total_duration_sec": round(info.frames / info.samplerate, 3),
            "source_size_bytes": len(source_audio),
            "original_format": original_format,
            "segment_count": 0,
            "speech_duration_sec": 0.0,
            "speech_ratio": 0.0,
            "primary_language": "unknown",
            "is_multilingual": False,
            "original_path": self.original_path,
            "segments": [],
            "vad_meta": {
                "preprocessed": was_preprocessed,
                "raw_vad_segments": 0,
                "raw_vad_duration": 0.0,
                "streaming_decoder": "unknown",
            },
            "language_scores": {},
        }
        existing_vad_table = self._load_existing_vad_table()
        if existing_vad_table:
            vad_table["segments"] = existing_vad_table.get("segments", [])
            vad_table["status"] = existing_vad_table.get("status", "building")
        vad_table_fid = self._persist_vad_table(vad_table)
        try:
            transcription_error = self._build_streaming_pipeline(source_audio, vad_table, vad_table["total_duration_sec"])
        except RuntimeError:
            raise
        except Exception as exc:
            raise RuntimeError(f"vad_error: {exc}") from exc
        vad_table["status"] = "failed" if transcription_error else "completed"
        self._write_snapshot(
            vad_table,
            extra={
                "transcribed_segments": sum(1 for seg in vad_table["segments"] if seg.get("transcription_status") == "completed"),
                "total_segments": len(vad_table["segments"]),
            },
        )
        vad_table_fid = self._persist_vad_table(vad_table)
        return vad_table_fid, vad_table


def main() -> int:
    parser = argparse.ArgumentParser(description="Build an AudioVADTable from an NBSS audio object.")
    parser.add_argument("audio_content_fid")
    parser.add_argument("--original-path", default="")
    parser.add_argument("--max-segments", type=int, default=0)
    parser.add_argument("--resume-vad-table-fid", default="")
    parser.add_argument("--progress-log-path", default="")
    parser.add_argument("--snapshot-path", default="")
    parser.add_argument("--whisper-workers", type=int, default=8)
    parser.add_argument("--min-segment-duration", type=float, default=5.0)
    args = parser.parse_args()
    builder = AudioVADTableBuilder(
        args.audio_content_fid,
        original_path=args.original_path or None,
        max_segments=args.max_segments or None,
        resume_vad_table_fid=args.resume_vad_table_fid or None,
        progress_log_path=args.progress_log_path or None,
        snapshot_path=args.snapshot_path or None,
        whisper_workers=args.whisper_workers,
        min_segment_duration=args.min_segment_duration,
    )
    vad_table_fid, vad_table = builder.build()
    print(
        json.dumps(
            {
                "vad_table_fid": vad_table_fid,
                "status": vad_table["status"],
                "primary_language": vad_table["primary_language"],
                "segment_count": vad_table["segment_count"],
            },
            ensure_ascii=False,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
