from __future__ import annotations

import tempfile
import unittest
from pathlib import Path
from unittest import mock

from scripts.google_keep_deep_asset_card_pipeline import (
    KeepNoteSource,
    build_card_frontmatter,
    build_card_generation_prompt,
    filter_changed_notes,
    generate_single_card,
    make_card_id,
    run_pipeline,
    truncate_card_body,
    truncate_source_markdown,
)


class GoogleKeepDeepAssetCardPipelineTests(unittest.TestCase):
    def make_note(self) -> KeepNoteSource:
        return KeepNoteSource(
            card_id=make_card_id("Example.json"),
            path="Example.json",
            note_title="Example Note",
            json_fid="0xAAA",
            html_fid="0xBBB",
            attachment_fids=["0xCCC"],
            created_at="2026-03-18",
            raw_json={"title": "Example Note", "labels": [{"name": "IDEA"}]},
            markdown="# Example\n\nHello world\n",
            markdown_fid="0xDDD",
            snapshot_fid="NBSS:0xSNAP",
        )

    def test_truncate_source_markdown(self) -> None:
        text = "a" * 20000
        truncated = truncate_source_markdown(text, max_chars=1000)
        self.assertIn("[...TRUNCATED FOR CARD GENERATION...]", truncated)
        self.assertLessEqual(len(truncated), 1000 + 80)

    def test_truncate_card_body(self) -> None:
        text = "b" * 30000
        truncated = truncate_card_body(text)
        self.assertIn("[TRUNCATED]", truncated)
        self.assertLessEqual(len(truncated), 28000)

    def test_build_prompt_includes_required_fids_and_source(self) -> None:
        prompt = build_card_generation_prompt(self.make_note())
        self.assertIn("path_in_snapshot: Example.json", prompt)
        self.assertIn("Source markdown", prompt)
        self.assertIn("Output markdown only", prompt)

    def test_build_card_frontmatter_includes_required_metadata(self) -> None:
        frontmatter = build_card_frontmatter(self.make_note())
        self.assertIn("source_snapshot_fid: NBSS:0xSNAP", frontmatter)
        self.assertIn("keep_md_fid: NBSS:0xDDD", frontmatter)
        self.assertIn('path_in_snapshot: "Example.json"', frontmatter)

    def test_filter_changed_notes_skips_same_keep_json_fid(self) -> None:
        note = self.make_note()
        changed, skipped = filter_changed_notes(
            [note],
            index={
                "Example.json": {
                    "keep_json_fid": "NBSS:0xAAA",
                }
            },
        )
        self.assertEqual(changed, [])
        self.assertEqual(skipped, 1)

    def test_filter_changed_notes_only_cares_about_keep_json_fid(self) -> None:
        note = self.make_note()
        changed, skipped = filter_changed_notes(
            [note],
            index={
                "Example.json": {
                    "keep_json_fid": "NBSS:0xAAA",
                    "keep_html_fid": "NBSS:0xDIFFERENT",
                    "attachment_fids": [],
                    "source_snapshot_fid": "NBSS:0xOTHER",
                    "note_title": "Different",
                    "created_at": "2000-01-01",
                }
            },
        )
        self.assertEqual(changed, [])
        self.assertEqual(skipped, 1)

    def test_generate_single_card_retries_only_on_call_failure(self) -> None:
        note = self.make_note()
        with mock.patch(
            "scripts.google_keep_deep_asset_card_pipeline.generate_card_body_once",
            side_effect=[RuntimeError("temporary"), "# Example Note\n\nCard body"],
        ):
            card = generate_single_card(note)
        self.assertEqual(card["id"], note.card_id)
        self.assertIn("# Example Note", card["card_markdown"])
        self.assertIn("keep_json_fid: NBSS:0xAAA", card["card_markdown"])

    def test_generate_single_card_keeps_returned_content_as_is(self) -> None:
        note = self.make_note()
        raw_body = "# Odd Card\n\nThis is imperfect but non-empty.\n\n- weird"
        with mock.patch(
            "scripts.google_keep_deep_asset_card_pipeline.generate_card_body_once",
            return_value=raw_body,
        ):
            card = generate_single_card(note)
        self.assertIn(raw_body, card["card_markdown"])

    def test_run_pipeline_writes_cards_and_collects_upserts(self) -> None:
        note = self.make_note()
        card_entry = {
            "id": note.card_id,
            "card_markdown": "---\nid: x\n---\n\n# Card\n",
            "metadata": {"source_type": "google_keep"},
        }
        with tempfile.TemporaryDirectory() as tmpdir:
            output_dir = Path(tmpdir) / "cards"
            with mock.patch("scripts.google_keep_deep_asset_card_pipeline.collect_keep_note_sources", return_value=[note]):
                with mock.patch("scripts.google_keep_deep_asset_card_pipeline.generate_single_card", return_value=card_entry):
                    with mock.patch("scripts.google_keep_deep_asset_card_pipeline.embed_and_upsert_single", return_value={"id": note.card_id, "rows_written": 1, "table": "cards"}):
                        result = run_pipeline(
                            "NBSS:0xSNAP",
                            table="cards",
                            limit=1,
                            prepare_workers=1,
                            generate_workers=1,
                            embed_workers=1,
                            output_dir=output_dir,
                            incremental=True,
                            index_path=output_dir / ".cards.asset_index.json",
                            progress_path=output_dir / ".cards.progress.json",
                        )
                        self.assertEqual(result["notes_processed"], 1)
                        self.assertEqual(result["notes_selected_for_generation"], 1)
                        self.assertEqual(result["cards_generated"], 1)
                        self.assertEqual(result["upserts"][0]["rows_written"], 1)
                        self.assertTrue((output_dir / f"{note.card_id}.md").exists())
                        self.assertTrue((output_dir / ".cards.asset_index.json").exists())
                        progress_path = output_dir / ".cards.progress.json"
                        self.assertTrue(progress_path.exists())
                        progress = progress_path.read_text(encoding="utf-8")
                        self.assertIn('"status": "completed"', progress)
                        self.assertIn('"generated": 1', progress)
                        self.assertIn('"upserted": 1', progress)


if __name__ == "__main__":
    unittest.main()
