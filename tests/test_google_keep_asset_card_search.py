from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from scripts.google_keep_asset_card_search import _dedupe_and_normalize_results, main, resolve_default_table


class GoogleKeepAssetCardSearchTests(unittest.TestCase):
    def test_resolve_default_table_prefers_existing_current_table(self) -> None:
        with mock.patch("scripts.google_keep_asset_card_search.Path.exists") as exists:
            exists.side_effect = lambda self=None: str(self).endswith("google_keep_asset_cards_directmd_eval200.lance")
            self.assertEqual(resolve_default_table(""), "google_keep_asset_cards_directmd_eval200")

    def test_resolve_default_table_uses_explicit_table(self) -> None:
        self.assertEqual(resolve_default_table("custom_table"), "custom_table")

    def test_main_writes_output_file(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output = Path(tmpdir) / "result.json"
            fake = {
                "query": "test",
                "results": [
                    {
                        "id": "a",
                        "rerank_score": 0.9,
                        "metadata": {
                            "note_title": "Alpha",
                            "path_in_snapshot": "Alpha.json",
                            "keep_md_fid": "NBSS:0x1",
                            "keep_json_fid": "NBSS:0x2",
                            "keep_html_fid": "NBSS:0x3",
                            "source_type": "google_keep",
                        },
                    },
                    {
                        "id": "a",
                        "rerank_score": 0.8,
                        "metadata": {
                            "note_title": "Alpha",
                            "path_in_snapshot": "Alpha.json",
                            "keep_md_fid": "NBSS:0x1",
                            "keep_json_fid": "NBSS:0x2",
                            "keep_html_fid": "NBSS:0x3",
                            "source_type": "google_keep",
                        },
                    },
                ],
            }
            with mock.patch("scripts.google_keep_asset_card_search.search_with_rerank", return_value=fake) as search:
                with mock.patch("sys.argv", ["google_keep_asset_card_search.py", "test", "--output", str(output)]):
                    with mock.patch("scripts.google_keep_asset_card_search.resolve_default_table", return_value="google_keep_asset_cards_directmd_eval200"):
                        rc = main()
            self.assertEqual(rc, 0)
            self.assertTrue(output.exists())
            written = json.loads(output.read_text(encoding="utf-8"))
            self.assertEqual(len(written["results"]), 1)
            self.assertEqual(written["results"][0]["title"], "Alpha")
            self.assertEqual(written["results"][0]["path_in_snapshot"], "Alpha.json")
            self.assertEqual(written["results"][0]["keep_md_fid"], "NBSS:0x1")
            self.assertEqual(written["rerank_count"], 1)
            self.assertEqual(search.call_args.kwargs["table"], "google_keep_asset_cards_directmd_eval200")

    def test_dedupe_and_normalize_results_flattens_metadata_fields(self) -> None:
        results = [
            {
                "id": "keep_1",
                "metadata": {
                    "note_title": "Test Note",
                    "path_in_snapshot": "Test Note.json",
                    "keep_md_fid": "NBSS:0x10",
                    "keep_json_fid": "NBSS:0x11",
                    "keep_html_fid": "NBSS:0x12",
                    "source_type": "google_keep",
                },
            }
        ]
        normalized = _dedupe_and_normalize_results(results)
        self.assertEqual(normalized[0]["title"], "Test Note")
        self.assertEqual(normalized[0]["path_in_snapshot"], "Test Note.json")
        self.assertEqual(normalized[0]["keep_md_fid"], "NBSS:0x10")
        self.assertEqual(normalized[0]["keep_json_fid"], "NBSS:0x11")
        self.assertEqual(normalized[0]["keep_html_fid"], "NBSS:0x12")
        self.assertEqual(normalized[0]["source_type"], "google_keep")


if __name__ == "__main__":
    unittest.main()
