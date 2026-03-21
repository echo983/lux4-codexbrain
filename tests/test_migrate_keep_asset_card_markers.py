from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from scripts.migrate_keep_asset_card_markers import migrate_asset_cards


class MigrateKeepAssetCardMarkersTests(unittest.TestCase):
    def test_migrate_adds_markers_and_updates_index(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_dir = Path(tmpdir)
            card_path = output_dir / "keep_demo.md"
            card_path.write_text(
                "---\n"
                "id: keep_demo\n"
                "source_type: google_keep\n"
                "tags: []\n"
                "retrieval_terms: []\n"
                'category_path: "notes/google-keep"\n'
                "created_at: 2025-01-01\n"
                'priority: "medium"\n'
                "source_snapshot_fid: NBSS:0xSNAP\n"
                "keep_json_fid: NBSS:0xJSON\n"
                "keep_md_fid: NBSS:0xMD\n"
                "keep_html_fid: NBSS:0xHTML\n"
                "attachment_fids: []\n"
                'path_in_snapshot: "Demo.json"\n'
                'note_title: "Demo"\n'
                "---\n\n# Demo\n\nHello\n",
                encoding="utf-8",
            )
            index_path = output_dir / ".cards.asset_index.json"
            index_path.write_text(
                json.dumps(
                    {
                        "Demo.json": {
                            "path_in_snapshot": "Demo.json",
                            "keep_json_fid": "NBSS:0xJSON",
                        }
                    },
                    ensure_ascii=False,
                    indent=2,
                ),
                encoding="utf-8",
            )
            with mock.patch("scripts.migrate_keep_asset_card_markers.default_index_path", return_value=index_path):
                with mock.patch("scripts.migrate_keep_asset_card_markers.resolve_embedding_config", return_value=("a", "b", "m")):
                    with mock.patch("scripts.migrate_keep_asset_card_markers.get_embeddings", return_value=[[0.1, 0.2]]):
                        with mock.patch("scripts.migrate_keep_asset_card_markers.resolve_lancedb_url", return_value="http://127.0.0.1:24681"):
                            with mock.patch("scripts.migrate_keep_asset_card_markers.post_json", return_value={"rows_written": 1}):
                                result = migrate_asset_cards(output_dir=output_dir, table="cards", batch_size=32)
            self.assertEqual(result["card_files"], 1)
            self.assertEqual(result["rows_upserted"], 1)
            updated_text = card_path.read_text(encoding="utf-8")
            self.assertIn("doc_kind: asset_card", updated_text)
            self.assertIn("card_schema: deep_asset_card_v1", updated_text)
            updated_index = json.loads(index_path.read_text(encoding="utf-8"))
            self.assertEqual(updated_index["Demo.json"]["doc_kind"], "asset_card")
            self.assertEqual(updated_index["Demo.json"]["card_schema"], "deep_asset_card_v1")
