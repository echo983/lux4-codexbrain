from __future__ import annotations

import json
import threading
import unittest
from urllib.error import HTTPError
from urllib.request import Request, urlopen
from unittest.mock import patch

from moreway_asset_service.app import create_app
from moreway_asset_service.config import Config
from moreway_asset_service.planet import list_planet_points


class MorewayAssetServiceSmokeTests(unittest.TestCase):
    def _make_server(self):
        return create_app(
            Config(
                host="127.0.0.1",
                port=0,
                tables=["mobile_capture_asset_cards"],
                vector_limit=10,
                per_page=5,
                min_score=0.1,
                asset_card_dir=__import__("pathlib").Path("/tmp"),
                debug_log_path=__import__("pathlib").Path("/tmp/moreway_asset_service_test.jsonl"),
            )
        )

    def test_create_app_returns_server(self) -> None:
        server = self._make_server()
        try:
            self.assertEqual(server.server_address[0], "127.0.0.1")
        finally:
            server.server_close()

    def test_healthz_and_planet_view_stub(self) -> None:
        server = self._make_server()
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        base = f"http://127.0.0.1:{server.server_address[1]}"
        try:
            with urlopen(f"{base}/healthz", timeout=5) as response:
                payload = json.loads(response.read())
            self.assertEqual(payload["service"], "moreway-asset-service")

            with patch("moreway_asset_service.http.list_planet_points") as mock_points:
                mock_points.return_value = {
                    "namespace_id": "ns_user_demo",
                    "point_count": 1,
                    "points": [
                        {
                            "id": "card-1",
                            "docKind": "asset_card",
                            "cardSchema": "mobile_capture_asset_card_v1",
                            "sourceType": "mobile_photo_group",
                            "sourceTable": "mobile_capture_asset_cards",
                            "namespaceId": "ns_user_demo",
                            "title": "demo",
                            "summary": "demo",
                            "createdAt": "2026-03-28T00:00:00Z",
                            "cardCreatedAt": "2026-03-28T00:00:00Z",
                            "tags": [],
                            "imageRefs": [],
                            "contentCompleteness": "partial",
                            "observationConfidence": "medium",
                            "mdUrl": "",
                            "position": {"x": 1.0, "y": 2.0, "z": 3.0},
                        }
                    ],
                    "bounds": {"min": [1.0, 2.0, 3.0], "max": [1.0, 2.0, 3.0]},
                }
                with urlopen(f"{base}/api/v1/planet/view?namespace_id=ns_user_demo", timeout=5) as response:
                    payload = json.loads(response.read())
                self.assertTrue(payload["ok"])
                self.assertEqual(payload["namespaceId"], "ns_user_demo")
                self.assertEqual(payload["pointCount"], 1)
                self.assertEqual(payload["points"][0]["id"], "card-1")
        finally:
            server.shutdown()
            server.server_close()
            thread.join(timeout=5)

    def test_rejects_requests_without_namespace(self) -> None:
        server = self._make_server()
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        base = f"http://127.0.0.1:{server.server_address[1]}"
        try:
            for url in (
                f"{base}/api/v1/mobile/cards/recent",
                f"{base}/api/v1/mobile/cards/card-1?source_table=mobile_capture_asset_cards",
                f"{base}/api/v1/planet/view",
            ):
                with self.assertRaises(HTTPError) as ctx:
                    urlopen(url, timeout=5)
                self.assertEqual(ctx.exception.code, 400)
                payload = json.loads(ctx.exception.read())
                self.assertEqual(payload["error"], "missing_namespace_id")

            req = Request(
                f"{base}/api/v1/mobile/search",
                data=json.dumps({"query": "menu"}).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with self.assertRaises(HTTPError) as ctx:
                urlopen(req, timeout=5)
            self.assertEqual(ctx.exception.code, 400)
            payload = json.loads(ctx.exception.read())
            self.assertEqual(payload["error"], "missing_namespace_id")
        finally:
            server.shutdown()
            server.server_close()
            thread.join(timeout=5)

    def test_rejects_legacy_endpoints(self) -> None:
        server = self._make_server()
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        base = f"http://127.0.0.1:{server.server_address[1]}"
        try:
            for url in (
                f"{base}/",
                f"{base}/search?q=menu",
                f"{base}/asset-card?id=keep_demo",
            ):
                with self.assertRaises(HTTPError) as ctx:
                    urlopen(url, timeout=5)
                self.assertEqual(ctx.exception.code, 404)

            req = Request(
                f"{base}/api/v1/search",
                data=json.dumps({"query": "menu", "namespaceId": "ns_user_demo"}).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with self.assertRaises(HTTPError) as ctx:
                urlopen(req, timeout=5)
            self.assertEqual(ctx.exception.code, 404)
        finally:
            server.shutdown()
            server.server_close()
            thread.join(timeout=5)

    def test_list_planet_points_projects_namespace_asset_cards(self) -> None:
        response_payload = {
            "results": [
                {
                    "id": "card-1",
                    "text": "---\nnamespace_id: \"ns_user_demo\"\ncard_schema: \"mobile_capture_asset_card_v1\"\nsource_type: \"mobile_photo_group\"\ncard_created_at: \"2026-03-28T00:00:00Z\"\ncontent_completeness: \"partial\"\nobservation_confidence: \"medium\"\ngroup_image_fids: [\"NBSS:0x1\"]\n---\n\n# 这是什么\n测试菜单",
                    "metadata": {
                        "doc_kind": "asset_card",
                        "namespace_id": "ns_user_demo",
                        "card_schema": "mobile_capture_asset_card_v1",
                        "source_type": "mobile_photo_group",
                        "card_created_at": "2026-03-28T00:00:00Z",
                        "content_completeness": "partial",
                        "observation_confidence": "medium",
                        "group_image_fids": ["NBSS:0x1"],
                    },
                    "vector": [1.0] * 1024,
                },
                {
                    "id": "card-2",
                    "text": "---\nnamespace_id: \"other\"\n---\n\n# 这是什么\n其他",
                    "metadata": {
                        "doc_kind": "asset_card",
                        "namespace_id": "other",
                    },
                    "vector": [0.5] * 1024,
                },
            ]
        }
        with patch("moreway_asset_service.planet.post_json", return_value=response_payload):
            result = list_planet_points(
                tables=["mobile_capture_asset_cards"],
                namespace_id="ns_user_demo",
                limit=10,
            )
        self.assertEqual(result["namespace_id"], "ns_user_demo")
        self.assertEqual(result["point_count"], 1)
        self.assertEqual(result["points"][0]["id"], "card-1")
        self.assertEqual(result["points"][0]["namespaceId"], "ns_user_demo")
        self.assertIn("position", result["points"][0])
