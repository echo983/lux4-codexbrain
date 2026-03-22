from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from typing import Any


def _utc_now_iso() -> str:
    return datetime.now(UTC).isoformat()


def _sanitize_for_filename(value: str) -> str:
    cleaned = "".join(ch if ch.isalnum() or ch in {"-", "_"} else "-" for ch in value)
    return cleaned.strip("-") or "flow"


@dataclass(frozen=True)
class FlowDebugRecord:
    flow_type: str
    flow_id: str
    path: str


class FlowDebugLogger:
    def __init__(self, path: Path, *, flow_type: str, flow_id: str) -> None:
        self._path = path
        self._path.parent.mkdir(parents=True, exist_ok=True)
        self._flow_type = flow_type
        self._flow_id = flow_id

    @property
    def record(self) -> FlowDebugRecord:
        return FlowDebugRecord(
            flow_type=self._flow_type,
            flow_id=self._flow_id,
            path=str(self._path),
        )

    def event(self, event_type: str, **payload: Any) -> None:
        entry = {
            "ts": _utc_now_iso(),
            "flow_type": self._flow_type,
            "flow_id": self._flow_id,
            "event": event_type,
            "payload": payload,
        }
        with self._path.open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(entry, ensure_ascii=False, sort_keys=True))
            handle.write("\n")


class NullFlowDebugLogger:
    @property
    def record(self) -> FlowDebugRecord:
        return FlowDebugRecord(flow_type="disabled", flow_id="disabled", path="")

    def event(self, event_type: str, **payload: Any) -> None:
        return None


def build_flow_debug_logger(
    *,
    enabled: bool,
    root_dir: str,
    category: str,
    flow_id: str,
) -> FlowDebugLogger | NullFlowDebugLogger:
    if not enabled:
        return NullFlowDebugLogger()

    timestamp = datetime.now(UTC).strftime("%Y%m%dT%H%M%SZ")
    safe_flow_id = _sanitize_for_filename(flow_id)
    path = Path(root_dir) / category / f"{timestamp}-{safe_flow_id}.jsonl"
    return FlowDebugLogger(path, flow_type=category, flow_id=flow_id)
