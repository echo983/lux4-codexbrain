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
                                    },
                                    "_distance": 0.2,
                                },
                            ]
                        },
                    ):
                        with mock.patch(
                            "moreway_search_service.search.fetch_source_text",
                            side_effect=[
                                json.dumps({"labels": [{"name": "china"}]}),
                                json.dumps({"labels": [{"name": "spain"}]}),
                            ],
                        ):
                            with mock.patch(
                                "moreway_search_service.search.rerank",
                                return_value=[{"id": 0, "score": 0.9}],
                            ):
                                result = search_keep_cards(
                                    "test",
                                    table="t",
                                    vector_limit=10,
                                    result_limit=5,
                                    required_tags=["china"],
                                )
        self.assertEqual(result["filtered_hit_count"], 1)
        self.assertEqual(result["results"][0]["title"], "Alpha")
        self.assertEqual(result["results"][0]["tags"], ["china"])

    def test_http_search_api_returns_json(self) -> None:
        config = Config(host="127.0.0.1", port=18561, table="cards", vector_limit=20, result_limit=5)
        server = build_server(config)
        try:
            with mock.patch(
                "moreway_search_service.http.search_keep_cards",
                return_value={
                    "query": "china",
                    "table": "cards",
                    "vector_limit": 20,
                    "result_limit": 5,
                    "required_tags": ["geo"],
                    "vector_hit_count": 2,
                    "filtered_hit_count": 1,
                    "results": [{"title": "Alpha", "path_in_snapshot": "Alpha.json", "snippet": "x", "rerank_score": 0.9, "created_at": "", "priority": "", "tags": [], "keep_md_fid": "", "keep_json_fid": "", "note_title": "Alpha", "id": "1", "distance": 0.1, "source_type": "google_keep", "category_path": ""}],
                    "available_tags": [],
                    "models": {"embedding": "e", "reranker": "r"},
                },
            ):
                import threading
                import urllib.request

                thread = threading.Thread(target=server.serve_forever, daemon=True)
                thread.start()
                req = urllib.request.Request(
                    "http://127.0.0.1:18561/api/v1/search",
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

