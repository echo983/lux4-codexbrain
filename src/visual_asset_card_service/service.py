from __future__ import annotations

import base64
import hashlib
import json
import re
import uuid
from dataclasses import dataclass
from typing import Any
from urllib import error, request

from mobile_card_api import build_mobile_card_detail_response
from scripts.cloudflare_bge_m3_embed import get_embeddings, resolve_config as resolve_embedding_config
from scripts.lancedb_local_api import post_json, resolve_lancedb_url
from scripts.openai_image_generate import resolve_config as resolve_openai_config

from .config import Config


ASSET_DOC_KIND = "asset_card"
ASSET_CARD_SCHEMA = "mobile_capture_asset_card_v1"
ASSET_SOURCE_TYPE = "mobile_photo_group"


@dataclass(frozen=True)
class InputImage:
    content_bytes: bytes
    mime_type: str
    order: int
    role: str


@dataclass(frozen=True)
class IngestRequest:
    object_hint: str
    group_note: str
    source_client: str
    namespace_id: str
    images: list[InputImage]


def parse_ingest_request(payload: dict[str, Any] | str | None) -> IngestRequest:
    if not isinstance(payload, dict):
        raise ValueError("payload must be a JSON object")
    object_hint = str(payload.get("objectHint") or "").strip()
    group_note = str(payload.get("groupNote") or "").strip()
    source_client = str(payload.get("sourceClient") or "").strip()
    namespace_id = str(payload.get("namespaceId") or "").strip()
    raw_images = payload.get("images")
    if not isinstance(raw_images, list) or not raw_images:
        raise ValueError("images must be a non-empty array")
    images: list[InputImage] = []
    for raw_item in raw_images:
        if not isinstance(raw_item, dict):
            raise ValueError("each image must be an object")
        raw_content = str(raw_item.get("contentBase64") or "").strip()
        if not raw_content:
            raise ValueError("contentBase64 is required")
        try:
            content_bytes = base64.b64decode(raw_content, validate=True)
        except Exception as exc:
            raise ValueError("contentBase64 is not valid base64") from exc
        if not content_bytes:
            raise ValueError("contentBase64 decoded to empty bytes")
        mime_type = str(raw_item.get("mimeType") or "").strip() or "application/octet-stream"
        raw_order = raw_item.get("order")
        try:
            order = int(raw_order)
        except (TypeError, ValueError) as exc:
            raise ValueError("image order must be an integer") from exc
        role = str(raw_item.get("role") or "").strip()
        images.append(InputImage(content_bytes=content_bytes, mime_type=mime_type, order=order, role=role))
    images.sort(key=lambda item: item.order)
    return IngestRequest(
        object_hint=object_hint,
        group_note=group_note,
        source_client=source_client,
        namespace_id=namespace_id,
        images=images,
    )


def put_nbss_bytes(data: bytes, mime_type: str) -> str:
    req = request.Request(
        "http://127.0.0.1:8080/nbss",
        data=data,
        method="PUT",
        headers={"Content-Type": mime_type or "application/octet-stream"},
    )
    try:
        with request.urlopen(req, timeout=60) as response:
            body = json.loads(response.read().decode("utf-8"))
    except error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"NBSS PUT failed with HTTP {exc.code}: {detail}") from exc
    except error.URLError as exc:
        raise RuntimeError(f"NBSS PUT failed: {exc}") from exc
    fid = str(body.get("fid") or "").strip()
    if not fid:
        raise RuntimeError(f"NBSS PUT returned no fid: {body}")
    return f"NBSS:{fid}"


def _capture_group_id(image_fids: list[str]) -> str:
    digest = hashlib.sha1("|".join(image_fids).encode("utf-8")).hexdigest()[:16]
    return f"cg_{digest}"


def _openai_json_request(url: str, *, api_key: str, payload: dict[str, Any]) -> dict[str, Any]:
    req = request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with request.urlopen(req, timeout=240) as response:
            body = response.read().decode("utf-8")
    except error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"OpenAI request failed with HTTP {exc.code}: {detail}") from exc
    except error.URLError as exc:
        raise RuntimeError(f"OpenAI request failed: {exc}") from exc
    return json.loads(body)


def _build_vision_prompt(request_data: IngestRequest) -> str:
    object_hint = request_data.object_hint or "未提供"
    group_note = request_data.group_note or "未提供"
    return (
        "你在生成手机视觉信息对象的资产卡正文。"
        "这些图片属于同一个现实对象的多张拍摄结果。"
        "只根据可见内容写，不要补全现实，不要编造缺失信息。"
        "如果信息不完整，明确指出不完整。"
        "输出中文 Markdown，且只输出以下 4 个区块，顺序固定：\n"
        "# 这是什么\n"
        "# 直接可见信息\n"
        "# 关键信息提炼\n"
        "# 限制与风险\n\n"
        "要求：\n"
        "- 多图按给定顺序综合理解为同一对象。\n"
        "- 对文字可见部分尽量提取，但不要伪造看不清的内容。\n"
        "- 对时间、地点、价格、联系方式等仅在可见时写出。\n"
        "- 若图片模糊、遮挡、裁切不完整，要在“限制与风险”里写明。\n"
        f"- 用户对象提示：{object_hint}\n"
        f"- 用户备注：{group_note}\n"
    )


def _extract_openai_text(response: dict[str, Any]) -> str:
    texts: list[str] = []
    for item in response.get("output", []):
        if item.get("type") != "message":
            continue
        for content in item.get("content", []):
            if content.get("type") == "output_text":
                text = str(content.get("text") or "").strip()
                if text:
                    texts.append(text)
    if texts:
        return "\n\n".join(texts).strip()
    raise RuntimeError(f"OpenAI response did not contain output_text: {response}")


def _extract_section_markdown(markdown_text: str, section_title: str) -> str:
    current_title = ""
    current_lines: list[str] = []
    for line in markdown_text.splitlines():
        stripped = line.strip()
        if stripped.startswith("#"):
            if current_title == section_title:
                return "\n".join(current_lines).strip()
            current_title = stripped.lstrip("#").strip()
            current_lines = []
            continue
        current_lines.append(line)
    if current_title == section_title:
        return "\n".join(current_lines).strip()
    return ""


def derive_display_title(body_markdown: str, request_data: IngestRequest) -> str:
    subject = _extract_section_markdown(body_markdown, "这是什么")
    if not subject:
        subject = request_data.object_hint
    subject = re.sub(r"\s+", " ", subject).strip()
    if subject:
        subject = re.split(r"[。！？\n]", subject, maxsplit=1)[0].strip()
    replacements = [
        (r"^这是一[张份个组]\s*", ""),
        (r"^这是一[^，。；：]*?的\s*", ""),
        (r"^一[张份个组]\s*", ""),
        (r"^某个\s*", ""),
        (r"^某份\s*", ""),
        (r"^某张\s*", ""),
    ]
    for pattern, repl in replacements:
        subject = re.sub(pattern, repl, subject)
    subject = re.sub(r"[，,:：；。！？]+$", "", subject).strip()
    if not subject:
        subject = request_data.object_hint.strip()
    if not subject:
        subject = "手机拍照资产卡"
    if len(subject) > 32:
        subject = subject[:32].rstrip()
    return subject


def generate_card_body_with_openai(request_data: IngestRequest) -> str:
    api_key, base_url = resolve_openai_config()
    if not api_key:
        raise RuntimeError("Missing OPENAI_API_KEY in env or .env.")
    content: list[dict[str, Any]] = [{"type": "input_text", "text": _build_vision_prompt(request_data)}]
    for item in request_data.images:
        data_url = f"data:{item.mime_type};base64,{base64.b64encode(item.content_bytes).decode('ascii')}"
        label = f"图像顺序 {item.order}" + (f"，角色 {item.role}" if item.role else "")
        content.append({"type": "input_text", "text": label})
        content.append({"type": "input_image", "image_url": data_url})
    payload = {
        "model": "gpt-4.1-mini",
        "input": [
            {
                "role": "user",
                "content": content,
            }
        ],
    }
    response = _openai_json_request(f"{base_url}/responses", api_key=api_key, payload=payload)
    return _extract_openai_text(response)


def build_card_markdown(
    *,
    card_id: str,
    capture_group_id: str,
    request_data: IngestRequest,
    image_fids: list[str],
    display_title: str,
    body_markdown: str,
) -> str:
    return (
        "---\n"
        f"id: {card_id}\n"
        f"doc_kind: {ASSET_DOC_KIND}\n"
        f"card_schema: {ASSET_CARD_SCHEMA}\n"
        f"source_type: {ASSET_SOURCE_TYPE}\n"
        f"capture_group_id: {capture_group_id}\n"
        f"group_image_fids: {json.dumps(image_fids, ensure_ascii=False)}\n"
        f"group_size: {len(image_fids)}\n"
        f'display_title: "{display_title}"\n'
        f'object_hint: "{request_data.object_hint}"\n'
        f'group_note: "{request_data.group_note}"\n'
        'content_completeness: "partial"\n'
        'observation_confidence: "medium"\n'
        f'source_client: "{request_data.source_client}"\n'
        f'namespace_id: "{request_data.namespace_id}"\n'
        "---\n\n"
        f"{body_markdown.strip()}\n\n"
        "## NBSS 图像引用\n"
        + "\n".join(f"- {fid}" for fid in image_fids)
        + "\n"
    )


class VisualAssetCardService:
    def __init__(self, config: Config) -> None:
        self.config = config

    def ingest(self, payload: dict[str, Any] | str | None) -> dict[str, Any]:
        request_data = parse_ingest_request(payload)
        image_fids = [put_nbss_bytes(item.content_bytes, item.mime_type) for item in request_data.images]
        capture_group_id = _capture_group_id(image_fids)
        card_id = f"mobile_capture_{uuid.uuid4().hex[:16]}"
        body_markdown = generate_card_body_with_openai(request_data)
        display_title = derive_display_title(body_markdown, request_data)
        markdown = build_card_markdown(
            card_id=card_id,
            capture_group_id=capture_group_id,
            request_data=request_data,
            image_fids=image_fids,
            display_title=display_title,
            body_markdown=body_markdown,
        )
        account_id, token, model = resolve_embedding_config()
        vector = get_embeddings([markdown], account_id=account_id, token=token, model=model)[0]
        metadata = {
            "doc_kind": ASSET_DOC_KIND,
            "card_schema": ASSET_CARD_SCHEMA,
            "source_type": ASSET_SOURCE_TYPE,
            "capture_group_id": capture_group_id,
            "group_image_fids": image_fids,
            "group_size": len(image_fids),
            "display_title": display_title,
            "object_hint": request_data.object_hint,
            "group_note": request_data.group_note,
            "content_completeness": "partial",
            "observation_confidence": "medium",
            "source_client": request_data.source_client,
            "namespace_id": request_data.namespace_id,
        }
        response = post_json(
            f"{resolve_lancedb_url()}/upsert",
            {
                "table": self.config.table,
                "documents": [
                    {
                        "id": card_id,
                        "text": markdown,
                        "vector": vector,
                        "metadata": metadata,
                    }
                ],
            },
        )
        card = build_mobile_card_detail_response(
            {
                "id": card_id,
                "doc_kind": ASSET_DOC_KIND,
                "card_schema": ASSET_CARD_SCHEMA,
                "source_type": ASSET_SOURCE_TYPE,
                "source_table": str(response.get("table") or self.config.table),
                "title": display_title,
                "created_at": "",
                "tags": [],
                "group_image_fids": image_fids,
                "md_url": "",
                "markdown": markdown,
                "core_view": "",
                "intent": "",
                "cognitive_asset": "",
                "content_completeness": "partial",
                "observation_confidence": "medium",
                "category_path": "",
                "priority": "",
                "namespace_id": request_data.namespace_id,
            }
        )
        return {
            "ok": True,
            "cardId": card_id,
            "cardSchema": ASSET_CARD_SCHEMA,
            "status": "written",
            "captureGroupId": capture_group_id,
            "groupImageFids": image_fids,
            "namespaceId": request_data.namespace_id,
            "rowsWritten": int(response.get("rows_written", 0)),
            "table": str(response.get("table") or self.config.table),
            "card": card,
        }
