from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from scripts.google_keep_raw_md_pipeline import run_pipeline


class GoogleKeepRawMdPipelineTests(unittest.TestCase):
    def test_pipeline_reuses_existing_keep_md_and_writes_raw_metadata(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_dir = Path(tmpdir) / "out"
            keep_index_path = Path(tmpdir) / "keep_index.json"
            keep_index_path.write_text(
                json.dumps(
                    {
                        "Demo.json": {
                            "keep_json_fid": "NBSS:0xJSON",
                            "keep_md_fid": "NBSS:0xMD",
                            "keep_html_fid": "NBSS:0xHTML",
                            "attachment_fids": [],
                            "note_title": "Demo",
                            "created_at": "2026-01-01",
                        }
                    },
                    ensure_ascii=False,
                ),
                encoding="utf-8",
            )

            latest = {
                "Demo.json": {"base_ref": "D:0xJSON:10", "ts": 1, "size": 10},
                "Demo.html": {"base_ref": "D:0xHTML:10", "ts": 1, "size": 10},
            }

            def fake_fetch_source_text(ref: str) -> str:
                if ref == "NBSS:0xJSON":
                    return json.dumps({"title": "Demo", "createdTimestampUsec": "0", "userEditedTimestampUsec": "0", "isArchived": False, "isPinned": False, "isTrashed": False, "textContent": "hello", "labels": [{"name": "china"}]})
                if ref == "NBSS:0xMD":
                    return "# Demo\n\nhello"
                raise AssertionError(ref)

            with mock.patch("scripts.google_keep_raw_md_pipeline.latest_records_by_path", return_value=(latest, {})):
                with mock.patch("scripts.google_keep_raw_md_pipeline.fetch_source_text", side_effect=fake_fetch_source_text):
                    with mock.patch("scripts.google_keep_raw_md_pipeline.resolve_embedding_config", return_value=("a", "b", "emb")):
                        with mock.patch("scripts.google_keep_raw_md_pipeline.get_embeddings", return_value=[[0.1, 0.2]]):
                            with mock.patch("scripts.google_keep_raw_md_pipeline.resolve_lancedb_url", return_value="http://lancedb"):
                                with mock.patch("scripts.google_keep_raw_md_pipeline.post_json", return_value={"table": "raw", "rows_written": 1}):
                                    result = run_pipeline(
                                        "NBSS:0xSNAP",
                                        table="raw",
                                        limit=None,
                                        prepare_workers=1,
                                        embed_workers=1,
                                        output_dir=output_dir,
                                        incremental=True,
                                        index_path=None,
                                        progress_path=None,
                                        existing_keep_index_path=keep_index_path,
                                    )

            self.assertEqual(result["notes_processed"], 1)
            self.assertEqual(result["documents_upserted"], 1)
            written = (output_dir / "rawmd::Demo.md").read_text(encoding="utf-8")
            self.assertEqual(written, "# Demo\n\nhello")
            raw_index = json.loads((output_dir / ".raw.asset_index.json").read_text(encoding="utf-8"))
            self.assertEqual(raw_index["Demo.json"]["doc_kind"], "raw_text")
            self.assertEqual(raw_index["Demo.json"]["source_type"], "google_keep")
            self.assertEqual(raw_index["Demo.json"]["keep_md_fid"], "NBSS:0xMD")


if __name__ == "__main__":
    unittest.main()
