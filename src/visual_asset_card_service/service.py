from __future__ import annotations

import base64
import hashlib
import json
import os
import re
import uuid
from datetime import UTC, datetime
from dataclasses import dataclass
from pathlib import Path
from typing import Any
from urllib.parse import urlencode
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
    captured_at: str
    group_note: str
    source_client: str
    namespace_id: str
    capture_location: dict[str, float] | None
    images: list[InputImage]


@dataclass(frozen=True)
class CaptureAddress:
    formatted_address: str
    place_id: str
    location_type: str
    result_types: list[str]


def parse_ingest_request(payload: dict[str, Any] | str | None) -> IngestRequest:
    if not isinstance(payload, dict):
        raise ValueError("payload must be a JSON object")
    captured_at = _parse_captured_at(payload.get("capturedAt"))
    group_note = str(payload.get("groupNote") or "").strip()
    source_client = str(payload.get("sourceClient") or "").strip()
    namespace_id = str(payload.get("namespaceId") or "").strip()
    if not namespace_id:
        raise ValueError("namespaceId is required")
    capture_location = _parse_capture_location(payload.get("captureLocation"))
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
        captured_at=captured_at,
        group_note=group_note,
        source_client=source_client,
        namespace_id=namespace_id,
        capture_location=capture_location,
        images=images,
    )


def _parse_captured_at(value: Any) -> str:
    captured_at = str(value or "").strip()
    if not captured_at:
        raise ValueError("capturedAt is required")
    normalized = captured_at.replace("Z", "+00:00")
    try:
        parsed = datetime.fromisoformat(normalized)
    except ValueError as exc:
        raise ValueError("capturedAt must be a valid ISO 8601 timestamp") from exc
    if parsed.tzinfo is None:
        raise ValueError("capturedAt must include timezone information")
    return parsed.astimezone(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def _parse_capture_location(value: Any) -> dict[str, float] | None:
    if value is None:
        return None
    if not isinstance(value, dict):
        raise ValueError("captureLocation must be an object")
    if "latitude" not in value or "longitude" not in value:
        raise ValueError("captureLocation must include latitude and longitude")
    try:
        latitude = float(value.get("latitude"))
        longitude = float(value.get("longitude"))
    except (TypeError, ValueError) as exc:
        raise ValueError("captureLocation latitude/longitude must be numbers") from exc
    if not (-90.0 <= latitude <= 90.0):
        raise ValueError("captureLocation latitude must be between -90 and 90")
    if not (-180.0 <= longitude <= 180.0):
        raise ValueError("captureLocation longitude must be between -180 and 180")
    return {"latitude": latitude, "longitude": longitude}


def _load_env_value(key: str) -> str:
    value = os.getenv(key)
    if value is not None and value.strip():
        return value.strip()
    repo_root = Path(__file__).resolve().parent.parent.parent
    for env_path in (Path.cwd() / ".env", repo_root / ".env"):
        if not env_path.exists():
            continue
        for raw_line in env_path.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#"):
                continue
            if line.startswith("export "):
                line = line[7:].strip()
            if "=" not in line:
                continue
            current_key, raw_value = line.split("=", 1)
            if current_key.strip() != key:
                continue
            parsed = raw_value.strip()
            if len(parsed) >= 2 and parsed[0] == parsed[-1] and parsed[0] in {"'", '"'}:
                parsed = parsed[1:-1]
            return parsed.strip()
    return ""


def reverse_geocode_capture_location(capture_location: dict[str, float] | None) -> CaptureAddress | None:
    if capture_location is None:
        return None
    api_key = _load_env_value("GOOGLE_MAPS_API_KEY")
    if not api_key:
        return None
    query = urlencode(
        {
            "latlng": f'{capture_location["latitude"]},{capture_location["longitude"]}',
            "language": "zh-CN",
            "key": api_key,
        }
    )
    url = f"https://maps.googleapis.com/maps/api/geocode/json?{query}"
    try:
        with request.urlopen(url, timeout=30) as response:
            body = json.loads(response.read().decode("utf-8"))
    except error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Google Geocoding API request failed with HTTP {exc.code}: {detail}") from exc
    except error.URLError as exc:
        raise RuntimeError(f"Google Geocoding API request failed: {exc}") from exc
    results = body.get("results") or []
    if body.get("status") != "OK" or not results:
        return None
    first = results[0] or {}
    geometry = first.get("geometry") or {}
    return CaptureAddress(
        formatted_address=str(first.get("formatted_address") or "").strip(),
        place_id=str(first.get("place_id") or "").strip(),
        location_type=str(geometry.get("location_type") or "").strip(),
        result_types=[str(item).strip() for item in (first.get("types") or []) if str(item).strip()],
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


def _build_vision_prompt(request_data: IngestRequest, capture_address: CaptureAddress | None) -> str:
    group_note = request_data.group_note or "未提供"
    captured_at = request_data.captured_at or "未提供"
    source_client = request_data.source_client or "未提供"
    namespace_id = request_data.namespace_id or "未提供"
    capture_location = "未提供"
    if request_data.capture_location is not None:
        capture_location = (
            f'{request_data.capture_location["latitude"]}, {request_data.capture_location["longitude"]}'
        )
    capture_address_text = "未提供"
    capture_place_id = "未提供"
    capture_location_type = "未提供"
    capture_result_types = "未提供"
    if capture_address is not None:
        capture_address_text = capture_address.formatted_address or "未提供"
        capture_place_id = capture_address.place_id or "未提供"
        capture_location_type = capture_address.location_type or "未提供"
        capture_result_types = "、".join(capture_address.result_types) or "未提供"
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
        "- 下列采集上下文是辅助信息，可用于增强理解，但不能覆盖图片可见事实。\n"
        f"- 用户备注：{group_note}\n"
        f"- 采集时间：{captured_at}\n"
        f"- 采集经纬度：{capture_location}\n"
        f"- 采集地址：{capture_address_text}\n"
        f"- 地点 place_id：{capture_place_id}\n"
        f"- 地理精度类型：{capture_location_type}\n"
        f"- 地理结果类型：{capture_result_types}\n"
        f"- 来源客户端：{source_client}\n"
        f"- 命名空间：{namespace_id}\n"
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
        subject = "手机拍照资产卡"
    if len(subject) > 32:
        subject = subject[:32].rstrip()
    return subject


def generate_card_body_with_openai(request_data: IngestRequest, capture_address: CaptureAddress | None) -> str:
    api_key, base_url = resolve_openai_config()
    if not api_key:
        raise RuntimeError("Missing OPENAI_API_KEY in env or .env.")
    content: list[dict[str, Any]] = [{"type": "input_text", "text": _build_vision_prompt(request_data, capture_address)}]
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
    card_created_at: str,
    body_markdown: str,
    capture_address: CaptureAddress | None,
) -> str:
    capture_location_lines = ""
    if request_data.capture_location is not None:
        capture_location_lines = (
            f'capture_location_latitude: {request_data.capture_location["latitude"]}\n'
            f'capture_location_longitude: {request_data.capture_location["longitude"]}\n'
        )
    capture_address_lines = ""
    if capture_address is not None:
        capture_address_lines = (
            f'capture_address: "{capture_address.formatted_address}"\n'
            f'capture_place_id: "{capture_address.place_id}"\n'
            f'capture_location_type: "{capture_address.location_type}"\n'
            f"capture_result_types: {json.dumps(capture_address.result_types, ensure_ascii=False)}\n"
        )
    capture_context_markdown = [
        "## 采集上下文",
        f"- 采集时间: {request_data.captured_at}",
    ]
    if request_data.capture_location is not None:
        capture_context_markdown.append(
            f'- 采集经纬度: {request_data.capture_location["latitude"]}, {request_data.capture_location["longitude"]}'
        )
    if capture_address is not None and capture_address.formatted_address:
        capture_context_markdown.append(f"- 采集地址: {capture_address.formatted_address}")
    if capture_address is not None and capture_address.place_id:
        capture_context_markdown.append(f"- 地点 place_id: {capture_address.place_id}")
    if request_data.group_note:
        capture_context_markdown.append(f"- 手工备注: {request_data.group_note}")
    if request_data.source_client:
        capture_context_markdown.append(f"- 来源客户端: {request_data.source_client}")
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
        f'created_at: "{request_data.captured_at}"\n'
        f'captured_at: "{request_data.captured_at}"\n'
        f'group_note: "{request_data.group_note}"\n'
        f"{capture_location_lines}"
        f"{capture_address_lines}"
        f'card_created_at: "{card_created_at}"\n'
        'content_completeness: "partial"\n'
        'observation_confidence: "medium"\n'
        f'source_client: "{request_data.source_client}"\n'
        f'namespace_id: "{request_data.namespace_id}"\n'
        "---\n\n"
        f"{body_markdown.strip()}\n\n"
        + "\n".join(capture_context_markdown)
        + "\n\n"
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
        capture_address = reverse_geocode_capture_location(request_data.capture_location)
        capture_group_id = _capture_group_id(image_fids)
        card_id = f"mobile_capture_{uuid.uuid4().hex[:16]}"
        card_created_at = datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")
        body_markdown = generate_card_body_with_openai(request_data, capture_address)
        display_title = derive_display_title(body_markdown, request_data)
        markdown = build_card_markdown(
            card_id=card_id,
            capture_group_id=capture_group_id,
            request_data=request_data,
            image_fids=image_fids,
            display_title=display_title,
            card_created_at=card_created_at,
            body_markdown=body_markdown,
            capture_address=capture_address,
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
            "created_at": request_data.captured_at,
            "captured_at": request_data.captured_at,
            "card_created_at": card_created_at,
            "group_note": request_data.group_note,
            "content_completeness": "partial",
            "observation_confidence": "medium",
            "source_client": request_data.source_client,
            "namespace_id": request_data.namespace_id,
        }
        if request_data.capture_location is not None:
            metadata["capture_location_latitude"] = request_data.capture_location["latitude"]
            metadata["capture_location_longitude"] = request_data.capture_location["longitude"]
        if capture_address is not None:
            metadata["capture_address"] = capture_address.formatted_address
            metadata["capture_place_id"] = capture_address.place_id
            metadata["capture_location_type"] = capture_address.location_type
            metadata["capture_result_types"] = capture_address.result_types
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
                "created_at": request_data.captured_at,
                "captured_at": request_data.captured_at,
                "card_created_at": card_created_at,
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
                "capture_address": capture_address.formatted_address if capture_address is not None else "",
                "capture_place_id": capture_address.place_id if capture_address is not None else "",
                "capture_location_type": capture_address.location_type if capture_address is not None else "",
                "capture_result_types": capture_address.result_types if capture_address is not None else [],
                "capture_location_latitude": (
                    request_data.capture_location["latitude"] if request_data.capture_location is not None else ""
                ),
                "capture_location_longitude": (
                    request_data.capture_location["longitude"] if request_data.capture_location is not None else ""
                ),
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
            "capturedAt": request_data.captured_at,
            "captureLocation": request_data.capture_location,
            "captureAddress": capture_address.formatted_address if capture_address is not None else "",
            "cardCreatedAt": card_created_at,
            "rowsWritten": int(response.get("rows_written", 0)),
            "table": str(response.get("table") or self.config.table),
            "card": card,
        }
