from __future__ import annotations

import unittest
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest import mock

from scripts.youtube_fetch_subtitles_or_audio import choose_subtitle_language, fetch_subtitles_or_audio


class YouTubeFetchTests(unittest.TestCase):
    def test_choose_manual_subtitles_first(self) -> None:
        info = {
            "subtitles": {"zh-Hans": [{}]},
            "automatic_captions": {"en": [{}]},
            "language": "en",
        }
        self.assertEqual(choose_subtitle_language(info), ("manual", "zh-Hans"))

    def test_choose_original_language_auto_caption(self) -> None:
        info = {
            "subtitles": {},
            "automatic_captions": {"zh": [{}], "en": [{}]},
            "language": "zh",
        }
        self.assertEqual(choose_subtitle_language(info), ("automatic", "zh"))

    def test_fetch_audio_when_no_subtitles(self) -> None:
        with TemporaryDirectory() as tmpdir:
            output_dir = Path(tmpdir)
            fake_info = {"title": "Demo", "id": "abc123", "subtitles": {}, "automatic_captions": {}}

            def fake_run(args, *, cwd):
                if "--dump-single-json" in args:
                    return mock.Mock(returncode=0, stdout='{"title":"Demo","id":"abc123","subtitles":{},"automatic_captions":{}}', stderr="")
                (cwd / "Demo [abc123].webm").write_bytes(b"audio")
                return mock.Mock(returncode=0, stdout="", stderr="")

            with mock.patch("scripts.youtube_fetch_subtitles_or_audio.extract_video_info", return_value=fake_info):
                with mock.patch("scripts.youtube_fetch_subtitles_or_audio.run_yt_dlp", side_effect=fake_run):
                    result = fetch_subtitles_or_audio("https://example.com", output_dir=output_dir)
            self.assertEqual(result["mode"], "audio")
            self.assertTrue(result["path"].endswith(".webm"))


if __name__ == "__main__":
    unittest.main()
