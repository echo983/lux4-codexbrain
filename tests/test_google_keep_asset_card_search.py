from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from scripts.google_keep_asset_card_search import main, resolve_default_table


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
            fake = {"query": "test", "results": [{"id": "a"}]}
            with mock.patch("scripts.google_keep_asset_card_search.search_with_rerank", return_value=fake) as search:
                with mock.patch("sys.argv", ["google_keep_asset_card_search.py", "test", "--output", str(output)]):
                    with mock.patch("scripts.google_keep_asset_card_search.resolve_default_table", return_value="google_keep_asset_cards_directmd_eval200"):
                        rc = main()
            self.assertEqual(rc, 0)
            self.assertTrue(output.exists())
            self.assertEqual(json.loads(output.read_text(encoding="utf-8")), fake)
            self.assertEqual(search.call_args.kwargs["table"], "google_keep_asset_cards_directmd_eval200")


if __name__ == "__main__":
    unittest.main()
