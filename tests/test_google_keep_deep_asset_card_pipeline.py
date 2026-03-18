from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from scripts.google_keep_deep_asset_card_pipeline import (
    KeepNoteSource,
    build_card_generation_prompt,
    filter_changed_notes,
    make_card_id,
    normalize_generated_card,
    parse_card_json_response,
    render_card_markdown,
    run_pipeline,
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

    def test_build_prompt_includes_required_fids(self) -> None:
        prompt = build_card_generation_prompt(self.make_note())
        self.assertIn("keep_json_fid", prompt)
        self.assertIn("keep_md_fid", prompt)
        self.assertIn("keep_html_fid", prompt)

    def test_render_card_markdown_includes_metadata(self) -> None:
        markdown = render_card_markdown(
            self.make_note(),
            {
                "title": "Rendered Title",
                "tags": ["a", "b"],
                "retrieval_terms": ["x", "y"],
                "category_path": "知识/样例",
                "priority": "决策参考",
                "core_view": "核心观点",
                "intent": "意图识别",
                "cognitive_asset": "认知资产",
                "raw_content_md": "- 项目一",
                "mentioned_entities": ["实体A"],
                "related_scenarios": ["场景A"],
                "source_context": "Google Keep",
            },
        )
        self.assertIn("source_snapshot_fid: NBSS:0xSNAP", markdown)
        self.assertIn("keep_md_fid: NBSS:0xDDD", markdown)
        self.assertIn("# Rendered Title", markdown)
        self.assertIn("## 🔍 召回增强", markdown)

    def test_normalize_generated_card_normalizes_priority_and_category(self) -> None:
        normalized = normalize_generated_card(
            self.make_note(),
            {
                "title": "Example",
                "tags": ["A", "a", "B"],
                "retrieval_terms": ["One", "One", "Two"],
                "category_path": "['Security', 'Credentials', 'Password Storage']",
                "priority": "5",
                "core_view": "technical_specification",
                "intent": "constraint_for_text",
                "cognitive_asset": "",
                "raw_content_md": "",
                "mentioned_entities": ["X", "X", "Y"],
                "related_scenarios": ["S1", "S1", "S2"],
                "source_context": "",
            },
        )
        self.assertEqual(normalized["priority"], "low")
        self.assertEqual(normalized["category_path"], "security/credentials/password-storage")
        self.assertEqual(normalized["tags"], ["a", "b"])
        self.assertEqual(normalized["retrieval_terms"], ["One", "Two"])
        self.assertNotEqual(normalized["core_view"], "technical_specification")
        self.assertNotEqual(normalized["intent"], "constraint_for_text")
        self.assertTrue(normalized["raw_content_md"])

    def test_parse_card_json_response_extracts_embedded_json(self) -> None:
        parsed = parse_card_json_response('prefix {"title":"x","tags":[],"retrieval_terms":[]} suffix')
        self.assertEqual(parsed["title"], "x")

    def test_filter_changed_notes_skips_same_signature(self) -> None:
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

    def test_run_pipeline_writes_cards_and_collects_upserts(self) -> None:
        note = self.make_note()
        card_entry = {
            "id": note.card_id,
            "card_markdown": "# Card\n",
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
                            generate_workers=1,
                            embed_workers=1,
                            output_dir=output_dir,
                            incremental=True,
                            index_path=output_dir / ".cards.asset_index.json",
                        )
                        self.assertEqual(result["notes_processed"], 1)
                        self.assertEqual(result["notes_selected_for_generation"], 1)
                        self.assertEqual(result["cards_generated"], 1)
                        self.assertEqual(result["upserts"][0]["rows_written"], 1)
                        self.assertTrue((output_dir / f"{note.card_id}.md").exists())
                        self.assertTrue((output_dir / ".cards.asset_index.json").exists())


if __name__ == "__main__":
    unittest.main()
