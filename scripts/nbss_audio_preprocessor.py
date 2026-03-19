#!/usr/bin/env python3
from __future__ import annotations

import io
import shutil
import subprocess
import sys

try:
    from scripts.audio_runtime_bootstrap import bootstrap_audio_runtime
except ModuleNotFoundError:
    from audio_runtime_bootstrap import bootstrap_audio_runtime

bootstrap_audio_runtime()

import numpy as np
import soundfile as sf


class AudioPreprocessor:
    """Normalize arbitrary audio into ASR-friendly mono 16kHz PCM WAV."""

    def __init__(self, target_sample_rate: int = 16000, target_channels: int = 1, block_size: int = 65536):
        self.target_sample_rate = target_sample_rate
        self.target_channels = target_channels
        self.block_size = block_size

    def is_normalized_format(self, audio_bytes: bytes) -> bool:
        try:
            info = sf.SoundFile(io.BytesIO(audio_bytes))
            return (
                info.format == "WAV"
                and info.subtype == "PCM_16"
                and info.samplerate == self.target_sample_rate
                and info.channels == self.target_channels
            )
        except Exception:
            return False

    def ensure_normalized(self, audio_bytes: bytes) -> tuple[bytes, bool]:
        if self.is_normalized_format(audio_bytes):
            return audio_bytes, False
        return self.normalize(audio_bytes), True

    def normalize(self, audio_bytes: bytes) -> bytes:
        if shutil.which("ffmpeg"):
            ffmpeg_result = self._normalize_with_ffmpeg(audio_bytes)
            if ffmpeg_result is not None:
                return ffmpeg_result
        output = io.BytesIO()
        source = sf.SoundFile(io.BytesIO(audio_bytes))
        writer = sf.SoundFile(
            output,
            mode="w",
            samplerate=self.target_sample_rate,
            channels=self.target_channels,
            format="WAV",
            subtype="PCM_16",
        )
        source_step = source.samplerate / self.target_sample_rate
        next_src_pos = 0.0
        total_src_index = 0
        carry = None

        for chunk in source.blocks(blocksize=self.block_size, dtype="float32", always_2d=False):
            if isinstance(chunk, np.ndarray) and chunk.ndim > 1 and self.target_channels == 1:
                chunk = np.mean(chunk, axis=1)
            if carry is not None:
                chunk = np.concatenate([carry, chunk])
                chunk_start = total_src_index - 1
            else:
                chunk_start = total_src_index
            chunk_end = chunk_start + len(chunk) - 1
            if len(chunk) < 2:
                carry = chunk
                total_src_index += len(chunk)
                continue

            sample_positions = np.arange(next_src_pos, chunk_end + 1e-9, source_step)
            sample_positions = sample_positions[sample_positions <= chunk_end]
            if sample_positions.size > 0:
                local_positions = sample_positions - chunk_start
                local_indices = np.arange(len(chunk), dtype="float32")
                normalized = np.interp(local_positions, local_indices, chunk).astype("float32")
                writer.write(np.clip(normalized, -1.0, 1.0))
                next_src_pos = sample_positions[-1] + source_step

            carry = chunk[-1:].copy()
            total_src_index = chunk_end + 1

        if carry is not None and next_src_pos <= total_src_index - 1:
            writer.write(np.clip(carry.astype("float32"), -1.0, 1.0))

        writer.close()
        source.close()
        return output.getvalue()

    def _normalize_with_ffmpeg(self, audio_bytes: bytes) -> bytes | None:
        command = [
            "ffmpeg",
            "-nostdin",
            "-hide_banner",
            "-loglevel",
            "error",
            "-i",
            "pipe:0",
            "-ac",
            str(self.target_channels),
            "-ar",
            str(self.target_sample_rate),
            "-f",
            "wav",
            "-acodec",
            "pcm_s16le",
            "pipe:1",
        ]
        try:
            completed = subprocess.run(
                command,
                input=audio_bytes,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                check=False,
            )
        except OSError:
            return None
        if completed.returncode != 0:
            return None
        return completed.stdout


def main() -> int:
    if len(sys.argv) < 3:
        print("Usage: python3 scripts/nbss_audio_preprocessor.py <input_audio> <output_wav>")
        return 0
    with open(sys.argv[1], "rb") as file:
        audio_data = file.read()
    normalized = AudioPreprocessor().normalize(audio_data)
    with open(sys.argv[2], "wb") as file:
        file.write(normalized)
    print(sys.argv[2])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
