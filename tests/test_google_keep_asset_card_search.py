from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from scripts.google_keep_asset_card_search import main


class GoogleKeepAssetCardSearchTests(unittest.TestCase):
    def test_main_writes_output_file(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output = Path(tmpdir) / "result.json"
            fake = {"query": "test", "results": [{"id": "a"}]}
            with mock.patch("scripts.google_keep_asset_card_search.search_with_rerank", return_value=fake):
                with mock.patch("sys.argv", ["google_keep_asset_card_search.py", "test", "--output", str(output)]):
                    rc = main()
            self.assertEqual(rc, 0)
            self.assertTrue(output.exists())
            self.assertEqual(json.loads(output.read_text(encoding="utf-8")), fake)


if __name__ == "__main__":
    unittest.main()
