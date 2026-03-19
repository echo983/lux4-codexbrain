#!/usr/bin/env python3
from __future__ import annotations

import argparse
import io
import json

try:
    from scripts.audio_runtime_bootstrap import bootstrap_audio_runtime
except ModuleNotFoundError:
    from audio_runtime_bootstrap import bootstrap_audio_runtime

bootstrap_audio_runtime()

import numpy as np
import soundfile as sf
import torch
from silero_vad import get_speech_timestamps, load_silero_vad

try:
    from scripts.nbss_audio_preprocessor import AudioPreprocessor
except ModuleNotFoundError:
    from nbss_audio_preprocessor import AudioPreprocessor


class VoiceActivityDetector:
    def __init__(self, sample_rate: int = 16000):
        self.sample_rate = sample_rate
        self.preprocessor = AudioPreprocessor(target_sample_rate=sample_rate, target_channels=1)
        self.model = load_silero_vad()

    def is_preprocessed_format(self, audio_bytes: bytes) -> bool:
        try:
            info = sf.SoundFile(io.BytesIO(audio_bytes))
            return (
                info.format == "WAV"
                and info.subtype == "PCM_16"
                and info.samplerate == self.sample_rate
                and info.channels == 1
            )
        except Exception:
            return False

    def ensure_preprocessed(self, audio_bytes: bytes) -> tuple[bytes, bool]:
        if self.is_preprocessed_format(audio_bytes):
            return audio_bytes, False
        return self.preprocessor.normalize(audio_bytes), True

    def detect(
        self,
        audio_bytes: bytes,
        *,
        threshold: float = 0.5,
        min_speech_duration_ms: int = 250,
        min_silence_duration_ms: int = 100,
        speech_pad_ms: int = 30,
    ) -> dict:
        processed_audio, preprocessed = self.ensure_preprocessed(audio_bytes)
        waveform, sample_rate = sf.read(io.BytesIO(processed_audio), dtype="float32", always_2d=False)
        if isinstance(waveform, np.ndarray) and waveform.ndim > 1:
            waveform = np.mean(waveform, axis=1)
        audio_tensor = torch.from_numpy(waveform)
        timestamps = get_speech_timestamps(
            audio_tensor,
            self.model,
            threshold=threshold,
            sampling_rate=sample_rate,
            min_speech_duration_ms=min_speech_duration_ms,
            min_silence_duration_ms=min_silence_duration_ms,
            speech_pad_ms=speech_pad_ms,
            return_seconds=True,
        )
        total_speech_duration = sum(seg["end"] - seg["start"] for seg in timestamps)
        return {
            "preprocessed": preprocessed,
            "sampling_rate": sample_rate,
            "segments": timestamps,
            "speech_segments": len(timestamps),
            "speech_duration": round(total_speech_duration, 3),
        }


def main() -> int:
    parser = argparse.ArgumentParser(description="Run Silero VAD on an audio file.")
    parser.add_argument("audio_file")
    args = parser.parse_args()
    with open(args.audio_file, "rb") as file:
        audio_data = file.read()
    result = VoiceActivityDetector().detect(audio_data)
    print(json.dumps(result, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
