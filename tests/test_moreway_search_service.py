from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from moreway_search_service.http import build_server
from moreway_search_service.config import Config
from moreway_search_service.search import search_keep_cards


class MorewaySearchServiceTests(unittest.TestCase):
    def test_search_filters_by_keep_labels(self) -> None:
        with mock.patch("moreway_search_service.search.resolve_embedding_config", return_value=("a", "b", "emb")):
            with mock.patch("moreway_search_service.search.resolve_reranker_config", return_value=("a", "b", "rer")):
                with mock.patch("moreway_search_service.search.get_embeddings", return_value=[[0.1, 0.2]]):
                    with mock.patch(
                        "moreway_search_service.search.post_json",
                        return_value={
                            "results": [
                                {
                                    "id": "1",
                                    "text": "---\nsource_type: google_keep\ntags: []\nretrieval_terms: []\ncategory_path: \"notes/google-keep\"\ncreated_at: 2026-01-01\npriority: \"medium\"\n---\n\n# Alpha\n\nhello",
                                    "metadata": {
                                        "note_title": "Alpha",
                                        "path_in_snapshot": "Alpha.json",
                                        "keep_json_fid": "NBSS:0xAAA",
                                        "tags": ["china"],
                                    },
                                    "_distance": 0.1,
                                },
                                {
                                    "id": "2",
                                    "text": "---\nsource_type: google_keep\ntags: []\nretrieval_terms: []\ncategory_path: \"notes/google-keep\"\ncreated_at: 2026-01-01\npriority: \"medium\"\n---\n\n# Beta\n\nhello",
                                    "metadata": {
                                        "note_title": "Beta",
                                        "path_in_snapshot": "Beta.json",
                                        "keep_json_fid": "NBSS:0xBBB",
                                        "tags": ["spain"],
                                    },
                                    "_distance": 0.2,
                                },
                            ]
                        },
                    ):
                        with mock.patch(
                            "moreway_search_service.search.rerank",
                            return_value=[{"id": 0, "score": 0.9}],
                        ):
                                result = search_keep_cards(
                                    "test",
                                    tables=["t"],
                                    vector_limit=10,
                                    per_page=5,
                                    required_tags=["china"],
                            )
        self.assertEqual(result["filtered_hit_count"], 1)
        self.assertEqual(result["results"][0]["title"], "Alpha")
        self.assertEqual(result["results"][0]["tags"], ["china"])

    def test_search_includes_md_url(self) -> None:
        with mock.patch("moreway_search_service.search.resolve_embedding_config", return_value=("a", "b", "emb")):
            with mock.patch("moreway_search_service.search.resolve_reranker_config", return_value=("a", "b", "rer")):
                with mock.patch("moreway_search_service.search.resolve_nbss_server_endpoint", return_value="http://localhost:8080"):
                    with mock.patch("moreway_search_service.search.get_embeddings", return_value=[[0.1, 0.2]]):
                        with mock.patch(
                            "moreway_search_service.search.post_json",
                            return_value={
                                "results": [
                                    {
                                        "id": "1",
                                        "text": "---\nsource_type: google_keep\ntags: []\nretrieval_terms: []\ncategory_path: \"notes/google-keep\"\ncreated_at: 2026-01-01\npriority: \"medium\"\n---\n\n# Alpha\n\nhello",
                                        "metadata": {
                                            "note_title": "Alpha",
                                            "path_in_snapshot": "Alpha.json",
                                            "keep_json_fid": "NBSS:0xAAA",
                                            "keep_md_fid": "NBSS:0xDDD",
                                        },
                                        "_distance": 0.1,
                                    }
                                ]
                            },
                        ):
                            with mock.patch(
                                "moreway_search_service.search.rerank",
                                return_value=[{"id": 0, "score": 0.9}],
                            ):
                                result = search_keep_cards(
                                    "test",
                                    tables=["t"],
                                    vector_limit=10,
                                    per_page=5,
                                    required_tags=[],
                                )
        self.assertEqual(result["results"][0]["md_url"], "http://localhost:8080/nbss/0xDDD")

    def test_search_paginates_after_threshold_filter(self) -> None:
        with mock.patch("moreway_search_service.search.resolve_embedding_config", return_value=("a", "b", "emb")):
            with mock.patch("moreway_search_service.search.resolve_reranker_config", return_value=("a", "b", "rer")):
                with mock.patch("moreway_search_service.search.resolve_nbss_server_endpoint", return_value="http://localhost:8080"):
                    with mock.patch("moreway_search_service.search.get_embeddings", return_value=[[0.1, 0.2]]):
                        with mock.patch(
                            "moreway_search_service.search.post_json",
                            return_value={
                                "results": [
                                    {
                                        "id": str(i),
                                        "text": f"---\\nsource_type: google_keep\\ntags: []\\nretrieval_terms: []\\ncategory_path: \\\"notes/google-keep\\\"\\ncreated_at: 2026-01-01\\npriority: \\\"medium\\\"\\n---\\n\\n# Alpha {i}\\n\\nhello",
                                        "metadata": {
                                            "note_title": f"Alpha {i}",
                                            "path_in_snapshot": f"Alpha{i}.json",
                                            "keep_json_fid": f"NBSS:0x{i}AA",
                                            "keep_md_fid": f"NBSS:0x{i}DD",
                                        },
                                        "_distance": 0.1 + i,
                                    }
                                    for i in range(4)
                                ]
                            },
                        ):
                            with mock.patch(
                                "moreway_search_service.search.rerank",
                                return_value=[
                                    {"id": 0, "score": 0.95},
                                    {"id": 1, "score": 0.80},
                                    {"id": 2, "score": 0.39},
                                    {"id": 3, "score": 0.10},
                                ],
                            ):
                                result = search_keep_cards(
                                    "test",
                                    tables=["t"],
                                    vector_limit=10,
                                    per_page=1,
                                    page=2,
                                    min_score=0.4,
                                    required_tags=[],
                                )
        self.assertEqual(result["total_results"], 2)
        self.assertEqual(result["total_pages"], 2)
        self.assertEqual(result["page"], 2)
        self.assertEqual(len(result["results"]), 1)
        self.assertEqual(result["results"][0]["title"], "Alpha 1")

    def test_search_deduplicates_same_id_and_path(self) -> None:
        duplicate = {
            "id": "dup-1",
            "text": "---\ndoc_kind: asset_card\nsource_type: google_keep\ncard_schema: deep_asset_card_v1\ntags: []\nretrieval_terms: []\ncategory_path: \"notes/google-keep\"\ncreated_at: 2026-01-01\npriority: \"medium\"\n---\n\n# Alpha\n\nhello",
            "metadata": {
                "doc_kind": "asset_card",
                "source_type": "google_keep",
                "card_schema": "deep_asset_card_v1",
                "note_title": "Alpha",
                "path_in_snapshot": "Alpha.json",
                "keep_json_fid": "NBSS:0xAAA",
                "keep_md_fid": "NBSS:0xDDD",
            },
            "_distance": 0.1,
        }
        with mock.patch("moreway_search_service.search.resolve_embedding_config", return_value=("a", "b", "emb")):
            with mock.patch("moreway_search_service.search.resolve_reranker_config", return_value=("a", "b", "rer")):
                with mock.patch("moreway_search_service.search.resolve_nbss_server_endpoint", return_value="http://localhost:8080"):
                    with mock.patch("moreway_search_service.search.get_embeddings", return_value=[[0.1, 0.2]]):
                        with mock.patch(
                            "moreway_search_service.search.post_json",
                            return_value={"results": [duplicate, duplicate]},
                        ):
                            with mock.patch(
                                "moreway_search_service.search.rerank",
                                return_value=[{"id": 0, "score": 0.95}],
                            ):
                                result = search_keep_cards(
                                    "test",
                                    tables=["t"],
                                    vector_limit=10,
                                    per_page=10,
                                    required_tags=[],
                                    min_score=0.0,
                                )
        self.assertEqual(result["filtered_hit_count"], 1)
        self.assertEqual(len(result["results"]), 1)
        self.assertEqual(result["results"][0]["id"], "dup-1")

    def test_search_prefers_asset_card_when_keep_md_matches(self) -> None:
        asset = {
            "id": "asset-1",
            "text": "---\ndoc_kind: asset_card\nsource_type: google_keep\ncard_schema: deep_asset_card_v1\ntags: []\nretrieval_terms: []\ncategory_path: \"notes/google-keep\"\ncreated_at: 2026-01-01\npriority: \"medium\"\n---\n\n# Alpha\n\n> **核心观点**：一条核心观点\n> **意图识别**：一条意图识别\n> **认知资产**：一条认知资产\n\nhello",
            "metadata": {
                "doc_kind": "asset_card",
                "source_type": "google_keep",
                "card_schema": "deep_asset_card_v1",
                "note_title": "Alpha",
                "path_in_snapshot": "Alpha.json",
                "keep_json_fid": "NBSS:0xAAA",
                "keep_md_fid": "NBSS:0xDDD",
            },
            "_distance": 0.1,
            "_source_table": "cards",
        }
        raw = {
            "id": "raw-1",
            "text": "# Alpha\n\nraw content",
            "metadata": {
                "doc_kind": "raw_text",
                "source_type": "google_keep",
                "note_title": "Alpha",
                "path_in_snapshot": "Alpha.json",
                "keep_json_fid": "NBSS:0xAAA",
                "keep_md_fid": "NBSS:0xDDD",
            },
            "_distance": 0.2,
            "_source_table": "raw",
        }
        with mock.patch("moreway_search_service.search.resolve_embedding_config", return_value=("a", "b", "emb")):
            with mock.patch("moreway_search_service.search.resolve_reranker_config", return_value=("a", "b", "rer")):
                with mock.patch("moreway_search_service.search.resolve_nbss_server_endpoint", return_value="http://localhost:8080"):
                    with mock.patch("moreway_search_service.search.get_embeddings", return_value=[[0.1, 0.2]]):
                        with mock.patch(
                            "moreway_search_service.search.post_json",
                            side_effect=[{"results": [asset]}, {"results": [raw]}],
                        ):
                            with mock.patch(
                                "moreway_search_service.search.rerank",
                                return_value=[{"id": 0, "score": 0.95}, {"id": 1, "score": 0.80}],
                            ):
                                result = search_keep_cards(
                                    "test",
                                    tables=["cards", "raw"],
                                    vector_limit=10,
                                    per_page=10,
                                    required_tags=[],
                                    min_score=0.0,
                                )
        self.assertEqual(result["filtered_hit_count"], 2)
        self.assertEqual(len(result["results"]), 1)
        self.assertEqual(result["results"][0]["doc_kind"], "asset_card")
        self.assertEqual(result["results"][0]["core_view"], "一条核心观点")
        self.assertEqual(result["results"][0]["intent"], "一条意图识别")
        self.assertEqual(result["results"][0]["cognitive_asset"], "一条认知资产")

    def test_search_mobile_capture_asset_card_has_no_file_backed_card_url(self) -> None:
        mobile = {
            "id": "mobile-1",
            "text": "---\ndoc_kind: asset_card\nsource_type: mobile_photo_group\ncard_schema: mobile_capture_asset_card_v1\ncontent_completeness: partial\n---\n\n# 这是什么\n一张菜单照片\n\n# 直接可见信息\n可见法文菜单内容。\n\n# 关键信息提炼\n历史菜单。\n\n# 限制与风险\n部分内容模糊。",
            "metadata": {
                "doc_kind": "asset_card",
                "source_type": "mobile_photo_group",
                "card_schema": "mobile_capture_asset_card_v1",
                "capture_group_id": "cg_1",
                "group_image_fids": ["NBSS:0xIMG"],
            },
            "_distance": 0.1,
            "_source_table": "mobile",
        }
        with mock.patch("moreway_search_service.search.resolve_embedding_config", return_value=("a", "b", "emb")):
            with mock.patch("moreway_search_service.search.resolve_reranker_config", return_value=("a", "b", "rer")):
                with mock.patch("moreway_search_service.search.resolve_nbss_server_endpoint", return_value="http://localhost:8080"):
                    with mock.patch("moreway_search_service.search.get_embeddings", return_value=[[0.1, 0.2]]):
                        with mock.patch(
                            "moreway_search_service.search.post_json",
                            return_value={"results": [mobile]},
                        ):
                            with mock.patch(
                                "moreway_search_service.search.rerank",
                                return_value=[{"id": 0, "score": 0.95}],
                            ):
                                result = search_keep_cards(
                                    "menu",
                                    tables=["mobile"],
                                    vector_limit=10,
                                    per_page=10,
                                    required_tags=[],
                                    min_score=0.0,
                                )
        self.assertEqual(result["results"][0]["doc_kind"], "asset_card")
        self.assertEqual(result["results"][0]["card_schema"], "mobile_capture_asset_card_v1")
        self.assertEqual(result["results"][0]["card_url"], "")

    def test_search_page_renders_asset_card_summary(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            config = Config(
                host="127.0.0.1",
                port=0,
                tables=["cards", "raw"],
                vector_limit=10,
                per_page=20,
                min_score=0.1,
                asset_card_dir=Path(tmpdir),
            )
            server = build_server(config)
            try:
                with mock.patch("moreway_search_service.http.search_keep_cards") as search_mock:
                    search_mock.return_value = {
                        "query": "alpha",
                        "tables": ["cards", "raw"],
                        "vector_limit": 10,
                        "per_page": 20,
                        "page": 1,
                        "total_pages": 1,
                        "total_results": 1,
                        "min_score": 0.1,
                        "required_tags": [],
                        "vector_hit_count": 1,
                        "filtered_hit_count": 1,
                        "available_tags": [],
                        "results": [
                            {
                                "id": "asset-1",
                                "title": "Alpha",
                                "note_title": "Alpha",
                                "path_in_snapshot": "Alpha.json",
                                "snippet": "原始摘录",
                                "rerank_score": 0.9,
                                "distance": 0.1,
                                "source_table": "cards",
                                "doc_kind": "asset_card",
                                "source_type": "google_keep",
                                "card_schema": "deep_asset_card_v1",
                                "created_at": "2026-01-01",
                                "tags": ["china"],
                                "category_path": "notes/google-keep",
                                "priority": "medium",
                                "keep_md_fid": "NBSS:0xDDD",
                                "md_url": "http://localhost:8080/nbss/0xDDD",
                                "card_url": "/asset-card?id=asset-1",
                                "keep_json_fid": "NBSS:0xAAA",
                                "core_view": "一条核心观点",
                                "intent": "一条意图识别",
                                "cognitive_asset": "一条认知资产",
                            }
                        ],
                    }
                    import threading
                    import urllib.request

                    thread = threading.Thread(target=server.serve_forever, daemon=True)
                    thread.start()
                    with urllib.request.urlopen(
                        f"http://{server.server_address[0]}:{server.server_address[1]}/search?q=alpha"
                    ) as response:
                        body = response.read().decode("utf-8")
                self.assertIn("资产卡", body)
                self.assertIn("核心观点", body)
                self.assertIn("意图识别", body)
                self.assertIn("认知资产", body)
            finally:
                server.shutdown()
                server.server_close()

    def test_search_page_renders_mobile_asset_card_snippet_fallback(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            config = Config(
                host="127.0.0.1",
                port=0,
                tables=["mobile"],
                vector_limit=10,
                per_page=20,
                min_score=0.1,
                asset_card_dir=Path(tmpdir),
            )
            server = build_server(config)
            try:
                with mock.patch("moreway_search_service.http.search_keep_cards") as search_mock:
                    search_mock.return_value = {
                        "query": "menu",
                        "tables": ["mobile"],
                        "vector_limit": 10,
                        "per_page": 20,
                        "page": 1,
                        "total_pages": 1,
                        "total_results": 1,
                        "min_score": 0.1,
                        "required_tags": [],
                        "vector_hit_count": 1,
                        "filtered_hit_count": 1,
                        "available_tags": [],
                        "results": [
                            {
                                "id": "mobile-1",
                                "title": "Untitled",
                                "note_title": "",
                                "path_in_snapshot": "",
                                "snippet": "一张菜单照片，可见法文菜单内容。",
                                "rerank_score": 0.92,
                                "distance": 0.1,
                                "source_table": "mobile",
                                "doc_kind": "asset_card",
                                "source_type": "mobile_photo_group",
                                "card_schema": "mobile_capture_asset_card_v1",
                                "created_at": "",
                                "tags": [],
                                "category_path": "",
                                "priority": "",
                                "keep_md_fid": "",
                                "md_url": "",
                                "card_url": "",
                                "keep_json_fid": "",
                                "core_view": "",
                                "intent": "",
                                "cognitive_asset": "",
                            }
                        ],
                    }
                    import threading
                    import urllib.request

                    thread = threading.Thread(target=server.serve_forever, daemon=True)
                    thread.start()
                    with urllib.request.urlopen(
                        f"http://{server.server_address[0]}:{server.server_address[1]}/search?q=menu"
                    ) as response:
                        body = response.read().decode("utf-8")
                self.assertIn("一张菜单照片，可见法文菜单内容。", body)
                self.assertNotIn("查看 AI 分析", body)
            finally:
                server.shutdown()
                server.server_close()

    def test_http_search_api_returns_json(self) -> None:
        config = Config(host="127.0.0.1", port=0, tables=["cards"], vector_limit=20, per_page=20, min_score=0.4, asset_card_dir=Path("."))
        server = build_server(config)
        try:
            with mock.patch(
                "moreway_search_service.http.search_keep_cards",
                return_value={
                    "query": "china",
                    "tables": ["cards"],
                    "vector_limit": 20,
                    "per_page": 20,
                    "page": 1,
                    "total_pages": 1,
                    "total_results": 1,
                    "min_score": 0.4,
                    "required_tags": ["geo"],
                    "vector_hit_count": 2,
                    "filtered_hit_count": 1,
                    "results": [{"title": "Alpha", "path_in_snapshot": "Alpha.json", "snippet": "x", "rerank_score": 0.9, "created_at": "", "priority": "", "tags": [], "keep_md_fid": "", "keep_json_fid": "", "note_title": "Alpha", "id": "1", "distance": 0.1, "source_table": "cards", "doc_kind": "asset_card", "source_type": "google_keep", "card_schema": "deep_asset_card_v1", "category_path": ""}],
                    "available_tags": [],
                    "models": {"embedding": "e", "reranker": "r"},
                },
            ):
                import threading
                import urllib.request

                thread = threading.Thread(target=server.serve_forever, daemon=True)
                thread.start()
                host, port = server.server_address
                req = urllib.request.Request(
                    f"http://{host}:{port}/api/v1/search",
                    data=json.dumps({"query": "china", "tags": ["geo"]}).encode("utf-8"),
                    headers={"Content-Type": "application/json"},
                    method="POST",
                )
                with urllib.request.urlopen(req, timeout=5) as response:
                    body = json.loads(response.read().decode("utf-8"))
                self.assertEqual(body["query"], "china")
                self.assertEqual(body["required_tags"], ["geo"])
        finally:
            server.shutdown()
            server.server_close()

    def test_search_page_links_title_to_md_url(self) -> None:
        config = Config(host="127.0.0.1", port=0, tables=["cards"], vector_limit=20, per_page=20, min_score=0.4, asset_card_dir=Path("."))
        server = build_server(config)
        try:
            with mock.patch(
                "moreway_search_service.http.search_keep_cards",
                return_value={
                    "query": "china",
                    "tables": ["cards"],
                    "vector_limit": 20,
                    "per_page": 20,
                    "page": 1,
                    "total_pages": 1,
                    "total_results": 1,
                    "min_score": 0.4,
                    "required_tags": [],
                    "vector_hit_count": 2,
                    "filtered_hit_count": 1,
                    "results": [{
                        "title": "Alpha",
                        "path_in_snapshot": "Alpha.json",
                        "snippet": "x",
                        "rerank_score": 0.9,
                        "created_at": "",
                        "priority": "",
                        "tags": [],
                        "keep_md_fid": "NBSS:0xDDD",
                        "md_url": "http://localhost:8080/nbss/0xDDD",
                        "card_url": "/asset-card?id=1",
                        "keep_json_fid": "",
                        "note_title": "Alpha",
                        "id": "1",
                        "distance": 0.1,
                        "source_table": "cards",
                        "doc_kind": "asset_card",
                        "source_type": "google_keep",
                        "card_schema": "deep_asset_card_v1",
                        "category_path": "",
                    }],
                    "available_tags": [],
                    "models": {"embedding": "e", "reranker": "r"},
                },
            ):
                import threading
                import urllib.request

                thread = threading.Thread(target=server.serve_forever, daemon=True)
                thread.start()
                host, port = server.server_address
                with urllib.request.urlopen(f"http://{host}:{port}/search?q=china", timeout=5) as response:
                    body = response.read().decode("utf-8")
                self.assertIn("http://localhost:8080/nbss/0xDDD", body)
                self.assertIn("/asset-card?id=1", body)
                self.assertIn(">Alpha</a>", body)
        finally:
            server.shutdown()
            server.server_close()

    def test_asset_card_route_serves_card_markdown(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            asset_dir = Path(tmpdir)
            (asset_dir / "keep_demo.md").write_text("# Demo Card\n\nhello", encoding="utf-8")
            config = Config(
                host="127.0.0.1",
                port=0,
                tables=["cards"],
                vector_limit=20,
                per_page=20,
                min_score=0.4,
                asset_card_dir=asset_dir,
            )
            server = build_server(config)
            try:
                import threading
                import urllib.request

                thread = threading.Thread(target=server.serve_forever, daemon=True)
                thread.start()
                host, port = server.server_address
                with urllib.request.urlopen(f"http://{host}:{port}/asset-card?id=keep_demo", timeout=5) as response:
                    body = response.read().decode("utf-8")
                    content_type = response.headers.get("content-type")
                self.assertEqual(content_type, "text/markdown; charset=utf-8")
                self.assertIn("# Demo Card", body)
            finally:
                server.shutdown()
                server.server_close()
