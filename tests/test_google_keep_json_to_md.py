from __future__ import annotations

import io
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from scripts.google_keep_json_to_md import keep_note_to_markdown, main, normalize_text_content


class GoogleKeepJsonToMarkdownTests(unittest.TestCase):
    def test_keep_note_to_markdown_text_note(self) -> None:
        note = {
            "title": "Example Note",
            "textContent": "Line 1\nLine 2",
            "createdTimestampUsec": 1773797747266000,
            "userEditedTimestampUsec": 1773797750000000,
            "color": "DEFAULT",
            "isPinned": False,
            "isArchived": True,
            "isTrashed": False,
            "labels": [{"name": "IDEA"}],
        }
        md = keep_note_to_markdown(note)
        self.assertIn("# Example Note", md)
        self.assertIn("## Content", md)
        self.assertIn("Line 1\nLine 2", md)
        self.assertIn("- Labels: IDEA", md)

    def test_keep_note_to_markdown_list_and_annotations(self) -> None:
        note = {
            "title": "Checklist",
            "listContent": [
                {"text": "• Item A\n", "isChecked": False},
                {"text": "Item B", "isChecked": True},
            ],
            "annotations": [
                {
                    "title": "Example",
                    "url": "https://example.com",
                    "source": "WEBLINK",
                    "description": "desc",
                }
            ],
        }
        md = keep_note_to_markdown(note)
        self.assertIn("## Checklist", md)
        self.assertIn("- [ ] Item A", md)
        self.assertIn("- [x] Item B", md)
        self.assertIn("## Annotations", md)
        self.assertIn("[Example](https://example.com)", md)

    def test_main_writes_output_file(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            json_path = Path(tmpdir) / "note.json"
            out_path = Path(tmpdir) / "note.md"
            json_path.write_text('{"title":"Hello","textContent":"World"}', encoding="utf-8")
            with mock.patch("sys.argv", ["google_keep_json_to_md.py", str(json_path), "--output", str(out_path)]):
                exit_code = main()

            self.assertEqual(exit_code, 0)
            self.assertTrue(out_path.exists())
            self.assertIn("# Hello", out_path.read_text(encoding="utf-8"))

    def test_normalize_text_content_strips_keep_break_markers(self) -> None:
        text = "<br />\n\nHello\n<br />\nWorld\n"
        self.assertEqual(normalize_text_content(text), "Hello\n\nWorld")


if __name__ == "__main__":
    unittest.main()
