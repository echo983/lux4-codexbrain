#!/usr/bin/env python3
from __future__ import annotations

import argparse
import base64
import json
import sys
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))
SRC_ROOT = REPO_ROOT / "src"
if str(SRC_ROOT) not in sys.path:
    sys.path.insert(0, str(SRC_ROOT))

from PIL import Image

from visual_asset_card_service.config import Config
from visual_asset_card_service.service import VisualAssetCardService


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run a real smoke test against visual_asset_card_service with one or more local images.")
    parser.add_argument("images", nargs="+", help="Local image paths in object order.")
    parser.add_argument("--object-hint", default="", help="Optional object hint, such as 菜单 / 名片 / 海报.")
    parser.add_argument("--group-note", default="", help="Optional group note.")
    parser.add_argument("--source-client", default="manual-smoke", help="Source client label stored in metadata.")
    parser.add_argument("--max-edge", type=int, default=1000, help="Resize longest edge to this size before upload. Use 0 to disable.")
    parser.add_argument("--jpeg-quality", type=int, default=82, help="JPEG quality for resized upload images.")
    parser.add_argument("--print-markdown", action="store_true", help="After ingest, fetch and print the written card markdown from LanceDB search.")
    return parser.parse_args()


def prepare_image_bytes(path: Path, *, max_edge: int, jpeg_quality: int) -> tuple[bytes, str]:
    raw = path.read_bytes()
    if max_edge <= 0:
        return raw, _guess_mime_type(path)
    img = Image.open(path)
    img.thumbnail((max_edge, max_edge))
    from io import BytesIO

    buffer = BytesIO()
    fmt = "JPEG"
    img = img.convert("RGB")
    img.save(buffer, format=fmt, quality=jpeg_quality)
    return buffer.getvalue(), "image/jpeg"


def _guess_mime_type(path: Path) -> str:
    suffix = path.suffix.lower()
    if suffix in {".jpg", ".jpeg"}:
        return "image/jpeg"
    if suffix == ".png":
        return "image/png"
    if suffix == ".webp":
        return "image/webp"
    return "application/octet-stream"


def fetch_card_markdown(card_id: str, table: str) -> str:
    from scripts.cloudflare_bge_m3_embed import get_embeddings, resolve_config as resolve_embedding_config
    from scripts.lancedb_local_api import post_json, resolve_lancedb_url

    account_id, token, model = resolve_embedding_config()
    query_vector = get_embeddings([card_id], account_id=account_id, token=token, model=model)[0]
    result = post_json(
        f"{resolve_lancedb_url()}/search",
        {
            "table": table,
            "query_vector": query_vector,
            "limit": 10,
        },
    )
    for item in result.get("results", []):
        if str(item.get("id") or "") == card_id:
            return str(item.get("text") or "")
    return ""


def main() -> int:
    args = parse_args()
    service = VisualAssetCardService(Config.from_env())

    images_payload: list[dict[str, Any]] = []
    for index, raw_path in enumerate(args.images, start=1):
        path = Path(raw_path).expanduser().resolve()
        if not path.exists():
            raise SystemExit(f"Image not found: {path}")
        content_bytes, mime_type = prepare_image_bytes(path, max_edge=args.max_edge, jpeg_quality=args.jpeg_quality)
        images_payload.append(
            {
                "contentBase64": base64.b64encode(content_bytes).decode("ascii"),
                "mimeType": mime_type,
                "order": index,
                "role": f"image_{index}",
            }
        )

    payload = {
        "objectHint": args.object_hint,
        "groupNote": args.group_note,
        "sourceClient": args.source_client,
        "images": images_payload,
    }
    result = service.ingest(payload)
    print(json.dumps(result, ensure_ascii=False, indent=2))

    if args.print_markdown:
        markdown = fetch_card_markdown(result["cardId"], result["table"])
        if markdown:
            print("\n--- CARD MARKDOWN ---\n")
            print(markdown)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
