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
            "capturedAt": "2026-03-30T12:34:56+02:00",
            "groupNote": "",
            "sourceClient": "android-apk",
            "namespaceId": "user_title",
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
            "capturedAt": "2026-03-30T10:34:56Z",
            "groupNote": "两张",
            "sourceClient": "android-apk",
            "namespaceId": "user_a",
            "captureLocation": {"latitude": 40.4168, "longitude": -3.7038},
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
        self.assertEqual(result.namespace_id, "user_a")
        self.assertEqual(result.captured_at, "2026-03-30T10:34:56Z")
        self.assertEqual(result.capture_location, {"latitude": 40.4168, "longitude": -3.7038})

    def test_ingest_writes_nbss_and_lancedb(self) -> None:
        payload = {
            "capturedAt": "2026-03-30T10:34:56Z",
            "groupNote": "正反面",
            "sourceClient": "android-apk",
            "namespaceId": "user_a",
            "captureLocation": {"latitude": 40.4168, "longitude": -3.7038},
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
            with mock.patch(
                "visual_asset_card_service.service.reverse_geocode_capture_location",
                return_value=mock.Mock(
                    formatted_address="西班牙马德里某街道 1 号",
                    place_id="place-123",
                    location_type="ROOFTOP",
                    result_types=["street_address"],
                ),
            ):
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
        self.assertEqual(upsert_payload["documents"][0]["metadata"]["created_at"], "2026-03-30T10:34:56Z")
        self.assertEqual(upsert_payload["documents"][0]["metadata"]["captured_at"], "2026-03-30T10:34:56Z")
        self.assertEqual(upsert_payload["documents"][0]["metadata"]["capture_location_latitude"], 40.4168)
        self.assertEqual(upsert_payload["documents"][0]["metadata"]["capture_location_longitude"], -3.7038)
        self.assertEqual(upsert_payload["documents"][0]["metadata"]["capture_address"], "西班牙马德里某街道 1 号")
        self.assertEqual(upsert_payload["documents"][0]["metadata"]["capture_place_id"], "place-123")
        self.assertEqual(upsert_payload["documents"][0]["metadata"]["capture_location_type"], "ROOFTOP")
        self.assertEqual(upsert_payload["documents"][0]["metadata"]["capture_result_types"], ["street_address"])
        self.assertTrue(upsert_payload["documents"][0]["metadata"]["card_created_at"].endswith("Z"))
        self.assertEqual(result["cardSchema"], ASSET_CARD_SCHEMA)
        self.assertEqual(result["rowsWritten"], 1)
        self.assertEqual(result["namespaceId"], "user_a")
        self.assertEqual(result["capturedAt"], "2026-03-30T10:34:56Z")
        self.assertEqual(result["captureLocation"], {"latitude": 40.4168, "longitude": -3.7038})
        self.assertEqual(result["captureAddress"], "西班牙马德里某街道 1 号")
        self.assertTrue(result["cardCreatedAt"].endswith("Z"))
        self.assertEqual(result["card"]["id"], result["cardId"])
        self.assertEqual(result["card"]["sourceTable"], "mobile_cards")
        self.assertEqual(result["card"]["namespaceId"], "user_a")
        self.assertEqual(result["card"]["createdAt"], "2026-03-30T10:34:56Z")
        self.assertEqual(result["card"]["capturedAt"], "2026-03-30T10:34:56Z")
        self.assertEqual(result["card"]["captureLocation"], {"latitude": 40.4168, "longitude": -3.7038})
        self.assertEqual(result["card"]["captureAddress"], "西班牙马德里某街道 1 号")
        self.assertEqual(result["card"]["cardCreatedAt"], result["cardCreatedAt"])
        self.assertEqual(result["card"]["imageRefs"], ["NBSS:0xA", "NBSS:0xB"])
        self.assertEqual(result["card"]["detail"]["meta"]["capturedAt"], "2026-03-30T10:34:56Z")
        self.assertEqual(result["card"]["detail"]["meta"]["captureLocation"], {"latitude": 40.4168, "longitude": -3.7038})
        self.assertEqual(result["card"]["detail"]["meta"]["captureAddress"], "西班牙马德里某街道 1 号")
        self.assertEqual(result["card"]["detail"]["blocks"][0]["title"], "这是什么")
        self.assertEqual(result["card"]["summary"], "名片")
        self.assertEqual(result["card"]["title"], "名片")

    def test_ingest_includes_capture_context_in_prompt_and_markdown(self) -> None:
        payload = {
            "capturedAt": "2026-03-30T10:34:56Z",
            "groupNote": "右半边更清楚",
            "sourceClient": "android-apk",
            "namespaceId": "ns_user_test",
            "captureLocation": {"latitude": 40.4168, "longitude": -3.7038},
            "images": [
                {
                    "contentBase64": base64.b64encode(b"img-a").decode("ascii"),
                    "mimeType": "image/jpeg",
                    "order": 1,
                    "role": "front",
                }
            ],
        }
        service = VisualAssetCardService(Config(host="127.0.0.1", port=18574, table="mobile_cards"))
        prompt_inputs: list[str] = []

        def _capture_prompt(request_data, capture_address):
            text = "# 这是什么\n餐厅菜单。\n\n# 直接可见信息\n有菜品和价格。\n\n# 关键信息提炼\n适合检索。\n\n# 限制与风险\n只拍到一页。"
            prompt_inputs.append(
                f"{request_data.captured_at}|{request_data.group_note}|"
                f"{capture_address.formatted_address if capture_address else ''}|"
                f"{request_data.capture_location['latitude'] if request_data.capture_location else ''}"
            )
            return text

        with mock.patch("visual_asset_card_service.service.put_nbss_bytes", return_value="NBSS:0xA"):
            with mock.patch(
                "visual_asset_card_service.service.reverse_geocode_capture_location",
                return_value=mock.Mock(
                    formatted_address="西班牙马德里中心区",
                    place_id="place-xyz",
                    location_type="APPROXIMATE",
                    result_types=["locality", "political"],
                ),
            ):
                with mock.patch("visual_asset_card_service.service.generate_card_body_with_openai", side_effect=_capture_prompt):
                    with mock.patch("visual_asset_card_service.service.resolve_embedding_config", return_value=("a", "b", "m")):
                        with mock.patch("visual_asset_card_service.service.get_embeddings", return_value=[[0.1, 0.2]]):
                            with mock.patch("visual_asset_card_service.service.resolve_lancedb_url", return_value="http://127.0.0.1:24681"):
                                with mock.patch("visual_asset_card_service.service.post_json", return_value={"rows_written": 1, "table": "mobile_cards"}):
                                    result = service.ingest(payload)
        self.assertEqual(prompt_inputs, ["2026-03-30T10:34:56Z|右半边更清楚|西班牙马德里中心区|40.4168"])
        self.assertIn('capture_address: "西班牙马德里中心区"', result["card"]["markdown"])
        self.assertIn("## 采集上下文", result["card"]["markdown"])
        self.assertIn("- 手工备注: 右半边更清楚", result["card"]["markdown"])
        self.assertIn("- 采集地址: 西班牙马德里中心区", result["card"]["markdown"])

    def test_parse_ingest_request_rejects_invalid_base64(self) -> None:
        payload = {
            "capturedAt": "2026-03-30T10:34:56Z",
            "namespaceId": "user_invalid",
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

    def test_parse_ingest_request_requires_captured_at(self) -> None:
        payload = {
            "namespaceId": "user_missing_capture",
            "images": [
                {
                    "contentBase64": base64.b64encode(b"x").decode("ascii"),
                    "mimeType": "image/jpeg",
                    "order": 1,
                }
            ]
        }
        with self.assertRaisesRegex(ValueError, "capturedAt is required"):
            parse_ingest_request(payload)

    def test_parse_ingest_request_requires_namespace_id(self) -> None:
        payload = {
            "capturedAt": "2026-03-30T10:34:56Z",
            "images": [
                {
                    "contentBase64": base64.b64encode(b"x").decode("ascii"),
                    "mimeType": "image/jpeg",
                    "order": 1,
                }
            ],
        }
        with self.assertRaisesRegex(ValueError, "namespaceId is required"):
            parse_ingest_request(payload)

    def test_parse_ingest_request_rejects_invalid_capture_location(self) -> None:
        payload = {
            "capturedAt": "2026-03-30T10:34:56Z",
            "namespaceId": "user_bad_location",
            "captureLocation": {"latitude": "bad", "longitude": 1},
            "images": [
                {
                    "contentBase64": base64.b64encode(b"x").decode("ascii"),
                    "mimeType": "image/jpeg",
                    "order": 1,
                }
            ],
        }
        with self.assertRaisesRegex(ValueError, "captureLocation latitude/longitude must be numbers"):
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
