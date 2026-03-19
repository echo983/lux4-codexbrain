from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from scripts.build_notfinder_snapshot_static_site import (
    build_snapshot_manifest,
    build_snapshot_static_site,
    nbss_object_url,
    render_static_site_html,
    resolve_nbss_server_endpoint,
)


class NotFinderSnapshotStaticSiteTests(unittest.TestCase):
    def sample_parsed(self) -> dict:
        return {
            "internal_name": "snapshot-demo",
            "head_fid": "0xHEAD",
            "exported_at_ms": 1773797732993,
            "record_count": 3,
            "path_count": 3,
            "path_map": {
                1: "notes/alpha.json",
                2: "notes/beta.html",
                3: "root.txt",
            },
            "records": [
                {"pid": 1, "base_ref": "D:0xAAA:10", "size": 10, "ts": 1000},
                {"pid": 2, "base_ref": "D:0xBBB:20", "size": 20, "ts": 2000},
                {"pid": 3, "base_ref": "D:0xCCC:30", "size": 30, "ts": 3000},
            ],
        }

    def test_resolve_nbss_server_endpoint_defaults(self) -> None:
        with mock.patch.dict("os.environ", {}, clear=True):
            with tempfile.TemporaryDirectory() as tmpdir:
                cwd = Path(tmpdir)
                old = Path.cwd()
                try:
                    import os

                    os.chdir(cwd)
                    with mock.patch("scripts.build_notfinder_snapshot_static_site.load_dotenv_file", return_value={}):
                        self.assertEqual(resolve_nbss_server_endpoint(), "http://localhost:8080")
                finally:
                    os.chdir(old)

    def test_resolve_nbss_server_endpoint_from_env(self) -> None:
        with mock.patch.dict("os.environ", {"NBSS_SERVER_ENDPOINT": "http://192.168.1.66:8080/"}):
            self.assertEqual(resolve_nbss_server_endpoint(), "http://192.168.1.66:8080")

    def test_build_snapshot_manifest(self) -> None:
        with mock.patch("scripts.build_notfinder_snapshot_static_site.fetch_snapshot_text", return_value="unused"):
            with mock.patch("scripts.build_notfinder_snapshot_static_site.parse_snapshot_text", return_value=self.sample_parsed()):
                manifest = build_snapshot_manifest("NBSS:0xSNAP", server_endpoint="http://localhost:8080")
        self.assertEqual(manifest["internalName"], "snapshot-demo")
        self.assertIn("/", manifest["folders"])
        self.assertIn("/notes", manifest["folders"])
        root_files = manifest["filesByFolder"]["/"]
        note_folder_files = manifest["filesByFolder"]["/notes"]
        self.assertTrue(any(item["isDir"] and item["name"] == "notes" for item in root_files))
        self.assertTrue(any((not item["isDir"]) and item["name"] == "alpha.json" for item in note_folder_files))

    def test_render_static_site_html_embeds_manifest(self) -> None:
        manifest = {
            "internalName": "snapshot-demo",
            "pathCount": 3,
            "recordCount": 3,
            "snapshotSource": "NBSS:0xSNAP",
            "nbssServerEndpoint": "http://localhost:8080",
            "rootFolderId": "/",
            "folders": {"/": {"id": "/", "name": "snapshot-demo", "parentId": None, "path": "/", "isDir": True}},
            "filesByFolder": {"/": []},
        }
        html = render_static_site_html(manifest, bundle_js="console.log('bundle');")
        self.assertIn("snapshot-demo - Snapshot Browser", html)
        self.assertIn("window.__SNAPSHOT_MANIFEST__", html)
        self.assertIn("console.log('bundle');", html)
        self.assertIn(json.dumps(manifest, ensure_ascii=False), html)

    def test_build_snapshot_static_site_returns_direct_url(self) -> None:
        manifest = {
            "internalName": "snapshot-demo",
            "pathCount": 3,
            "recordCount": 3,
            "snapshotSource": "NBSS:0xSNAP",
            "nbssServerEndpoint": "http://localhost:8080",
            "rootFolderId": "/",
            "folders": {"/": {"id": "/", "name": "snapshot-demo", "parentId": None, "path": "/", "isDir": True}},
            "filesByFolder": {"/": []},
        }
        with mock.patch("scripts.build_notfinder_snapshot_static_site.build_snapshot_manifest", return_value=manifest):
            with mock.patch("scripts.build_notfinder_snapshot_static_site.build_frontend_bundle", return_value="console.log('bundle');"):
                with mock.patch("scripts.build_notfinder_snapshot_static_site.nbss_put_bytes", return_value={"fid": "0xSITE"}):
                    result = build_snapshot_static_site("NBSS:0xSNAP", server_endpoint="http://localhost:8080")
        self.assertEqual(result["site_fid"], "NBSS:0xSITE")
        self.assertEqual(result["site_url"], nbss_object_url("0xSITE", server_endpoint="http://localhost:8080"))


if __name__ == "__main__":
    unittest.main()
