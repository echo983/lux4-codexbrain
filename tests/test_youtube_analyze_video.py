from __future__ import annotations

import json
import unittest
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest import mock

from scripts.youtube_analyze_video import analyze_youtube_video


class YouTubeAnalyzeVideoTests(unittest.TestCase):
    def test_analyze_video_with_subtitles(self) -> None:
        with TemporaryDirectory() as tmpdir:
            root = Path(tmpdir)
            subtitle_path = root / "sample.srt"
            subtitle_path.write_text("1\n00:00:00,000 --> 00:00:02,000\nhello world\n", encoding="utf-8")
            output_dir = root / "out"

            with mock.patch(
                "scripts.youtube_analyze_video.fetch_subtitles_or_audio",
                return_value={
                    "mode": "subtitle",
                    "subtitle_kind": "manual",
                    "subtitle_language": "en",
                    "video_id": "abc123",
                    "title": "Demo Video",
                    "path": str(subtitle_path),
                },
            ):
                uploaded_payloads: list[tuple[bytes, str]] = []

                def fake_put(data, *, server_endpoint, content_type):
                    uploaded_payloads.append((data, content_type))
                    return {"fid": f"0xFID{len(uploaded_payloads)}"}

                with mock.patch("scripts.youtube_analyze_video.nbss_put_bytes", side_effect=fake_put):
                    with mock.patch(
                        "scripts.youtube_analyze_video.analyze_text_content",
                        return_value="# 分析\n\n这是一段测试分析。",
                    ):
                        result = analyze_youtube_video("https://example.com/watch?v=abc123", output_dir=output_dir)

            self.assertEqual(result["mode"], "subtitle")
            self.assertEqual(result["video_id"], "abc123")
            self.assertEqual(result["vad_table_fid"], "")
            self.assertEqual(result["transcript_fid"], "0xFID1")
            self.assertEqual(result["analysis_fid"], "0xFID2")
            self.assertEqual(result["meta_fid"], "0xFID3")
            self.assertFalse(output_dir.exists())
            self.assertIn("hello world", uploaded_payloads[0][0].decode("utf-8"))
            self.assertIn("测试分析", uploaded_payloads[1][0].decode("utf-8"))
            meta = json.loads(uploaded_payloads[2][0].decode("utf-8"))
            self.assertEqual(meta["analysis_fid"], "0xFID2")

    def test_analyze_video_with_audio_fallback(self) -> None:
        with TemporaryDirectory() as tmpdir:
            root = Path(tmpdir)
            audio_path = root / "sample.webm"
            audio_path.write_bytes(b"fake-audio")
            output_dir = root / "out"
            vad_table = {
                "segments": [
                    {"start": 0.0, "end": 1.2, "text": "第一句"},
                    {"start": 1.2, "end": 2.4, "text": "第二句"},
                ]
            }

            with mock.patch(
                "scripts.youtube_analyze_video.fetch_subtitles_or_audio",
                return_value={
                    "mode": "audio",
                    "video_id": "audio123",
                    "title": "Audio Demo",
                    "path": str(audio_path),
                },
            ):
                uploaded_payloads: list[tuple[bytes, str]] = []

                def fake_put(data, *, server_endpoint, content_type):
                    uploaded_payloads.append((data, content_type))
                    return {"fid": f"0xFID{len(uploaded_payloads)}"}

                with mock.patch(
                    "scripts.youtube_analyze_video.nbss_put_bytes",
                    side_effect=fake_put,
                ):
                    with mock.patch(
                        "scripts.youtube_analyze_video.subprocess.run",
                        return_value=mock.Mock(
                            returncode=0,
                            stdout='{"vad_table_fid":"0xVADFID","status":"completed","primary_language":"zh","segment_count":2}',
                            stderr="",
                        ),
                    ):
                        with mock.patch(
                            "scripts.youtube_analyze_video.load_vad_table",
                            return_value=vad_table,
                        ):
                            with mock.patch(
                                "scripts.youtube_analyze_video.analyze_text_content",
                                return_value="# 分析\n\n音频回退测试。",
                            ):
                                result = analyze_youtube_video("https://example.com/watch?v=audio123", output_dir=output_dir)

            self.assertEqual(result["mode"], "audio")
            self.assertEqual(result["vad_table_fid"], "0xVADFID")
            self.assertEqual(result["source_audio_fid"], "0xFID1")
            self.assertEqual(result["transcript_fid"], "0xFID2")
            self.assertEqual(result["analysis_fid"], "0xFID3")
            self.assertEqual(result["meta_fid"], "0xFID4")
            self.assertFalse(output_dir.exists())
            self.assertIn("第一句", uploaded_payloads[1][0].decode("utf-8"))
            self.assertIn("音频回退测试", uploaded_payloads[2][0].decode("utf-8"))


if __name__ == "__main__":
    unittest.main()
