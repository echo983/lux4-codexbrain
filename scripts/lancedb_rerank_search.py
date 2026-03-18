#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import sys
from typing import Any

try:
    from scripts.cloudflare_bge_m3_embed import get_embeddings, resolve_config as resolve_embedding_config
    from scripts.cloudflare_bge_reranker_base import rerank, resolve_config as resolve_reranker_config
    from scripts.lancedb_local_api import post_json, resolve_lancedb_url
except ModuleNotFoundError:
    from cloudflare_bge_m3_embed import get_embeddings, resolve_config as resolve_embedding_config
    from cloudflare_bge_reranker_base import rerank, resolve_config as resolve_reranker_config
    from lancedb_local_api import post_json, resolve_lancedb_url


def search_with_rerank(
    query: str,
    *,
    table: str,
    vector_limit: int,
    rerank_top_k: int | None = None,
) -> dict[str, Any]:
    emb_account_id, emb_token, emb_model = resolve_embedding_config()
    query_vector = get_embeddings([query], account_id=emb_account_id, token=emb_token, model=emb_model)[0]

    search_response = post_json(
        f"{resolve_lancedb_url()}/search",
        {
            "table": table,
            "query_vector": query_vector,
            "limit": vector_limit,
        },
    )
    raw_results = list(search_response.get("results") or [])
    candidate_texts = [str(item.get("text", "")) for item in raw_results]

    reranked_results: list[dict[str, Any]] = []
    if candidate_texts:
        rerank_account_id, rerank_token, rerank_model = resolve_reranker_config()
        reranked_scores = rerank(
            query,
            candidate_texts,
            account_id=rerank_account_id,
            token=rerank_token,
            model=rerank_model,
            top_k=rerank_top_k,
        )

        for rank, score_item in enumerate(reranked_scores, start=1):
            idx = score_item.get("id")
            if not isinstance(idx, int) or idx < 0 or idx >= len(raw_results):
                continue
            base = dict(raw_results[idx])
            base["rerank_score"] = score_item.get("score")
            base["rerank_rank"] = rank
            reranked_results.append(base)
    else:
        reranked_scores = []

    return {
        "table": table,
        "query": query,
        "vector_limit": vector_limit,
        "vector_hit_count": len(raw_results),
        "rerank_count": len(reranked_results),
        "results": reranked_results,
        "vector_search": {
            "table": search_response.get("table", table),
            "count": search_response.get("count", len(raw_results)),
        },
        "models": {
            "embedding": emb_model,
            "reranker": rerank_model if candidate_texts else resolve_reranker_config()[2],
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Search LanceDB with embedding retrieval followed by Cloudflare reranking.")
    parser.add_argument("query", help="Natural-language query.")
    parser.add_argument("--table", default="documents")
    parser.add_argument("--vector-limit", type=int, default=10)
    parser.add_argument("--rerank-top-k", type=int, default=None)
    args = parser.parse_args()

    result = search_with_rerank(
        args.query,
        table=args.table,
        vector_limit=args.vector_limit,
        rerank_top_k=args.rerank_top_k,
    )
    json.dump(result, sys.stdout, ensure_ascii=False)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
