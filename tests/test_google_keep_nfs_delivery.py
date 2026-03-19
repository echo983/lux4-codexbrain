from __future__ import annotations

import unittest
from unittest import mock

from scripts.google_keep_nfs_delivery import build_delivery_snapshot, resolve_default_table


class GoogleKeepNfsDeliveryTests(unittest.TestCase):
    def test_resolve_default_table_prefers_existing_table(self) -> None:
        with mock.patch(
            "scripts.google_keep_nfs_delivery.fetch_lancedb_tables",
            return_value=["google_keep_asset_cards_directmd_eval200"],
        ):
            self.assertEqual(resolve_default_table(""), "google_keep_asset_cards_directmd_eval200")

    def test_build_delivery_snapshot_builds_manifest_and_site(self) -> None:
        search_result = {
            "results": [
                {
                    "id": "keep_a",
                    "metadata": {
                        "note_title": '"China Note A"',
                        "path_in_snapshot": '"China Note A.json"',
                        "keep_md_fid": "NBSS:0xAAA",
                        "keep_json_fid": "NBSS:0xAJ",
                    },
                },
                {
                    "id": "keep_b",
                    "metadata": {
                        "note_title": '"China Note B"',
                        "path_in_snapshot": '"China Note B.json"',
                        "keep_md_fid": "NBSS:0xBBB",
                        "keep_json_fid": "NBSS:0xBJ",
                    },
                },
            ]
        }
        captured_manifest: dict[str, str] = {}

        def fake_put_bytes(data: bytes, *, server_endpoint: str, content_type: str) -> dict[str, str]:
            captured_manifest["text"] = data.decode("utf-8")
            return {"fid": "0xMANIFEST"}

        with (
            mock.patch("scripts.google_keep_nfs_delivery.select_results", return_value=search_result),
            mock.patch("scripts.google_keep_nfs_delivery.resolve_nbss_server_endpoint", return_value="http://nbss.test:8080"),
            mock.patch("scripts.google_keep_nfs_delivery.fetch_nbss_size", side_effect=[111, 222]),
            mock.patch("scripts.google_keep_nfs_delivery.nbss_put_bytes", side_effect=fake_put_bytes),
            mock.patch(
                "scripts.google_keep_nfs_delivery.build_snapshot_static_site",
                return_value={"site_fid": "NBSS:0xSITE", "site_url": "http://nbss.test:8080/nbss/0xSITE"},
            ),
        ):
            result = build_delivery_snapshot(
                query="中国 相关内容",
                table="google_keep_asset_cards_directmd_eval200",
                limit=2,
                vector_limit=10,
            )

        self.assertEqual(result["selected_count"], 2)
        self.assertEqual(result["snapshot_source"], "NBSS:0xMANIFEST")
        self.assertEqual(result["site_fid"], "NBSS:0xSITE")
        self.assertEqual(result["delivered_notes"][0]["file_path"], "中国 相关内容/China Note A.md")
        self.assertIn("China Note A.md", captured_manifest["text"])
        self.assertIn("0xAAA", captured_manifest["text"])
        self.assertIn("0xBBB", captured_manifest["text"])

    def test_build_delivery_snapshot_raises_when_no_results(self) -> None:
        with mock.patch("scripts.google_keep_nfs_delivery.select_results", return_value={"results": []}):
            with self.assertRaisesRegex(RuntimeError, "No retrieval results found"):
                build_delivery_snapshot(query="中国", table="t", limit=3, vector_limit=10)


if __name__ == "__main__":
    unittest.main()
