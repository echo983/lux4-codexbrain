from __future__ import annotations

import io
import json
import unittest
from unittest import mock

from scripts.lancedb_rerank_search import main, search_with_rerank


class LanceDbRerankSearchTests(unittest.TestCase):
    def test_search_with_rerank_combines_search_and_rerank(self) -> None:
        search_response = {
            "table": "documents",
            "count": 2,
            "results": [
                {"id": "doc-1", "text": "hardware store", "_distance": 0.2},
                {"id": "doc-2", "text": "coffee shop", "_distance": 0.4},
            ],
        }
        rerank_response = [
            {"id": 1, "score": 0.9, "text": "coffee shop"},
            {"id": 0, "score": 0.1, "text": "hardware store"},
        ]
        with mock.patch("scripts.lancedb_rerank_search.resolve_embedding_config", return_value=("acct-1", "token-1", "@cf/baai/bge-m3")):
            with mock.patch("scripts.lancedb_rerank_search.get_embeddings", return_value=[[0.1, 0.2]]):
                with mock.patch("scripts.lancedb_rerank_search.resolve_lancedb_url", return_value="http://127.0.0.1:24681"):
                    with mock.patch("scripts.lancedb_rerank_search.post_json", return_value=search_response):
                        with mock.patch("scripts.lancedb_rerank_search.resolve_reranker_config", return_value=("acct-1", "token-1", "@cf/baai/bge-reranker-base")):
                            with mock.patch("scripts.lancedb_rerank_search.rerank", return_value=rerank_response):
                                result = search_with_rerank("coffee", table="documents", vector_limit=5)

        self.assertEqual(result["vector_hit_count"], 2)
        self.assertEqual(result["rerank_count"], 2)
        self.assertEqual(result["results"][0]["id"], "doc-2")
        self.assertEqual(result["results"][0]["rerank_score"], 0.9)
        self.assertEqual(result["results"][0]["rerank_rank"], 1)

    def test_main_prints_json(self) -> None:
        stdout = io.StringIO()
        fake_result = {"results": [{"id": "doc-1"}]}
        with mock.patch("scripts.lancedb_rerank_search.search_with_rerank", return_value=fake_result) as search_mock:
            with mock.patch("sys.argv", ["lancedb_rerank_search.py", "coffee", "--table", "docs", "--vector-limit", "7"]):
                with mock.patch("sys.stdout", stdout):
                    exit_code = main()

        self.assertEqual(exit_code, 0)
        self.assertEqual(json.loads(stdout.getvalue()), fake_result)
        self.assertEqual(search_mock.call_args.args[0], "coffee")
        self.assertEqual(search_mock.call_args.kwargs["table"], "docs")
        self.assertEqual(search_mock.call_args.kwargs["vector_limit"], 7)


if __name__ == "__main__":
    unittest.main()
