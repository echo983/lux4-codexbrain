from __future__ import annotations

import unittest
from unittest import mock

from scripts.nbss_vad_table_builder import AudioVADTableBuilder, format_fid


class AudioVadTableBuilderTests(unittest.TestCase):
    def test_format_fid(self) -> None:
        self.assertEqual(format_fid("0xABC"), "0xABC")
        self.assertEqual(format_fid("ABC"), "0xABC")

    def test_segment_signature_rounds_values(self) -> None:
        with mock.patch("scripts.nbss_vad_table_builder.resolve_nbss_base_url", return_value="http://localhost:8080/nbss"):
            with mock.patch("scripts.nbss_vad_table_builder.AudioPreprocessor"):
                with mock.patch("scripts.nbss_vad_table_builder.VoiceActivityDetector"):
                    with mock.patch("scripts.nbss_vad_table_builder.SmartTurnDetector"):
                        with mock.patch("scripts.nbss_vad_table_builder.AudioClient"):
                            builder = AudioVADTableBuilder("0xABC")
        signature = builder._segment_signature({"start": 1.23456, "end": 7.89012, "duration": 6.65555})
        self.assertEqual(signature, (1.235, 7.89, 6.656))

    def test_update_vad_table_progress(self) -> None:
        with mock.patch("scripts.nbss_vad_table_builder.resolve_nbss_base_url", return_value="http://localhost:8080/nbss"):
            with mock.patch("scripts.nbss_vad_table_builder.AudioPreprocessor"):
                with mock.patch("scripts.nbss_vad_table_builder.VoiceActivityDetector"):
                    with mock.patch("scripts.nbss_vad_table_builder.SmartTurnDetector"):
                        with mock.patch("scripts.nbss_vad_table_builder.AudioClient"):
                            builder = AudioVADTableBuilder("0xABC")
        vad_table = {
            "segments": [
                {"duration": 6.0, "language": "es", "language_confidence": 0.8},
                {"duration": 4.0, "language": "en", "language_confidence": 0.35},
            ],
            "vad_meta": {},
        }
        builder._update_vad_table_progress(vad_table, 20.0)
        self.assertEqual(vad_table["segment_count"], 2)
        self.assertEqual(vad_table["speech_duration_sec"], 10.0)
        self.assertEqual(vad_table["speech_ratio"], 0.5)
        self.assertEqual(vad_table["primary_language"], "es")
        self.assertTrue(vad_table["is_multilingual"])


if __name__ == "__main__":
    unittest.main()
