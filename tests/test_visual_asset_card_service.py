from __future__ import annotations

import base64
import json
import urllib.error
import urllib.request
import unittest
from unittest import mock

from visual_asset_card_service.http import build_server
from visual_asset_card_service.config import Config
from visual_asset_card_service.service import (
    ASSET_CARD_SCHEMA,
    VisualAssetCardService,
    derive_display_title,
    parse_ingest_request,
)


class VisualAssetCardServiceTests(unittest.TestCase):
    def test_derive_display_title_from_subject_section(self) -> None:
        body = "# 这是什么\n一张法文宴会菜单。\n\n# 直接可见信息\n可见日期。\n"
        payload = {
            "objectHint": "菜单",
            "groupNote": "",
            "sourceClient": "android-apk",
            "images": [
                {
                    "contentBase64": base64.b64encode(b"a").decode("ascii"),
                    "mimeType": "image/jpeg",
                    "order": 1,
                }
            ],
        }
        request_data = parse_ingest_request(payload)
        self.assertEqual(derive_display_title(body, request_data), "法文宴会菜单")

    def test_parse_ingest_request_sorts_and_decodes_images(self) -> None:
        payload = {
            "objectHint": "菜单",
            "groupNote": "两张",
            "sourceClient": "android-apk",
            "namespaceId": "user_a",
            "images": [
                {
                    "contentBase64": base64.b64encode(b"b").decode("ascii"),
                    "mimeType": "image/jpeg",
                    "order": 2,
                    "role": "back",
                },
                {
                    "contentBase64": base64.b64encode(b"a").decode("ascii"),
                    "mimeType": "image/jpeg",
                    "order": 1,
                    "role": "front",
                },
            ],
        }
        result = parse_ingest_request(payload)
        self.assertEqual([item.order for item in result.images], [1, 2])
        self.assertEqual(result.images[0].content_bytes, b"a")
        self.assertEqual(result.object_hint, "菜单")
        self.assertEqual(result.namespace_id, "user_a")

    def test_ingest_writes_nbss_and_lancedb(self) -> None:
        payload = {
            "objectHint": "名片",
            "groupNote": "正反面",
            "sourceClient": "android-apk",
            "namespaceId": "user_a",
            "images": [
                {
                    "contentBase64": base64.b64encode(b"img-a").decode("ascii"),
                    "mimeType": "image/jpeg",
                    "order": 1,
                    "role": "front",
                },
                {
                    "contentBase64": base64.b64encode(b"img-b").decode("ascii"),
                    "mimeType": "image/jpeg",
                    "order": 2,
                    "role": "back",
                },
            ],
        }
        service = VisualAssetCardService(Config(host="127.0.0.1", port=18574, table="mobile_cards"))
        with mock.patch("visual_asset_card_service.service.put_nbss_bytes", side_effect=["NBSS:0xA", "NBSS:0xB"]) as put_mock:
            with mock.patch("visual_asset_card_service.service.generate_card_body_with_openai", return_value="# 这是什么\n名片\n\n# 直接可见信息\n可见姓名和公司。\n\n# 关键信息提炼\n测试。\n\n# 限制与风险\n无。"):
                with mock.patch("visual_asset_card_service.service.resolve_embedding_config", return_value=("a", "b", "m")):
                    with mock.patch("visual_asset_card_service.service.get_embeddings", return_value=[[0.1, 0.2]]) as emb_mock:
                        with mock.patch("visual_asset_card_service.service.resolve_lancedb_url", return_value="http://127.0.0.1:24681"):
                            with mock.patch("visual_asset_card_service.service.post_json", return_value={"rows_written": 1, "table": "mobile_cards"}) as upsert_mock:
                                result = service.ingest(payload)
        self.assertEqual(put_mock.call_count, 2)
        emb_mock.assert_called_once()
        upsert_payload = upsert_mock.call_args.args[1]
        self.assertEqual(upsert_payload["table"], "mobile_cards")
        self.assertEqual(upsert_payload["documents"][0]["metadata"]["group_image_fids"], ["NBSS:0xA", "NBSS:0xB"])
        self.assertEqual(upsert_payload["documents"][0]["metadata"]["namespace_id"], "user_a")
        self.assertEqual(result["cardSchema"], ASSET_CARD_SCHEMA)
        self.assertEqual(result["rowsWritten"], 1)
        self.assertEqual(result["namespaceId"], "user_a")
        self.assertEqual(result["card"]["id"], result["cardId"])
        self.assertEqual(result["card"]["sourceTable"], "mobile_cards")
        self.assertEqual(result["card"]["namespaceId"], "user_a")
        self.assertEqual(result["card"]["imageRefs"], ["NBSS:0xA", "NBSS:0xB"])
        self.assertEqual(result["card"]["detail"]["blocks"][0]["title"], "这是什么")
        self.assertEqual(result["card"]["summary"], "名片")
        self.assertEqual(result["card"]["title"], "名片")

    def test_parse_ingest_request_rejects_invalid_base64(self) -> None:
        payload = {
            "images": [
                {
                    "contentBase64": "not-base64",
                    "mimeType": "image/jpeg",
                    "order": 1,
                }
            ]
        }
        with self.assertRaisesRegex(ValueError, "valid base64"):
            parse_ingest_request(payload)

    def test_http_healthz_and_ingest(self) -> None:
        service = mock.Mock()
        service.ingest.return_value = {"ok": True, "status": "written"}
        server = build_server("127.0.0.1", 0, service)
        try:
            import threading

            thread = threading.Thread(target=server.serve_forever, daemon=True)
            thread.start()
            base_url = f"http://127.0.0.1:{server.server_port}"
            with urllib.request.urlopen(f"{base_url}/healthz", timeout=5) as response:
                health = json.loads(response.read().decode("utf-8"))
            self.assertEqual(health["service"], "visual-asset-card-service")

            req = urllib.request.Request(
                f"{base_url}/api/v1/visual-cards",
                data=json.dumps(
                    {
                        "images": [
                            {
                                "contentBase64": base64.b64encode(b"x").decode("ascii"),
                                "mimeType": "image/jpeg",
                                "order": 1,
                            }
                        ]
                    }
                ).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=5) as response:
                body = json.loads(response.read().decode("utf-8"))
                status = response.status
            self.assertEqual(status, 202)
            self.assertEqual(body["status"], "written")
        finally:
            server.shutdown()
            server.server_close()

    def test_http_ingest_invalid_request_returns_400(self) -> None:
        service = mock.Mock()
        service.ingest.side_effect = ValueError("images must be a non-empty array")
        server = build_server("127.0.0.1", 0, service)
        try:
            import threading

            thread = threading.Thread(target=server.serve_forever, daemon=True)
            thread.start()
            base_url = f"http://127.0.0.1:{server.server_port}"
            req = urllib.request.Request(
                f"{base_url}/api/v1/visual-cards",
                data=json.dumps({"images": []}).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with self.assertRaises(urllib.error.HTTPError) as ctx:
                urllib.request.urlopen(req, timeout=5)
            body = json.loads(ctx.exception.read().decode("utf-8"))
            self.assertEqual(ctx.exception.code, 400)
            self.assertEqual(body["error"], "invalid_request")
        finally:
            server.shutdown()
            server.server_close()


if __name__ == "__main__":
    unittest.main()
