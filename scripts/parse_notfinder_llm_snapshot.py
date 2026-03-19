#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from urllib import error, request


FORMAT_NAME = "notFinder LLM Snapshot"
DEFAULT_NBSS_BASE_URL = "http://127.0.0.1:8080/nbss"
NBSS_PREFIX = "NBSS:"


def fetch_snapshot_text(source: str) -> str:
    if source.startswith(NBSS_PREFIX):
        fid = source[len(NBSS_PREFIX) :].strip()
        if not fid:
            raise RuntimeError("NBSS source must include a FID after NBSS:.")
        url = f"{DEFAULT_NBSS_BASE_URL}/{fid}"
        req = request.Request(url, method="GET")
        try:
            with request.urlopen(req, timeout=30) as response:
                return response.read().decode("utf-8")
        except error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"NBSS fetch failed with HTTP {exc.code}: {detail}") from exc
        except error.URLError as exc:
            raise RuntimeError(f"NBSS fetch failed: {exc}") from exc

    path = Path(source)
    if not path.exists():
        raise RuntimeError(f"Snapshot source not found: {source}")
    return path.read_text(encoding="utf-8")


def parse_snapshot_text(text: str) -> dict[str, object]:
    lines = text.splitlines()
    metadata: dict[str, str] = {}
    columns: list[str] = []
    paths: list[dict[str, object]] = []
    records: list[dict[str, object]] = []
    section_rows: dict[str, list[dict[str, object]]] = {}

    idx = 0
    while idx < len(lines):
        line = lines[idx]
        if not line.strip():
            idx += 1
            continue
        if line == "paths:":
            idx += 1
            break
        if ":" not in line:
            raise RuntimeError(f"Unexpected header line: {line}")
        key, value = line.split(":", 1)
        metadata[key.strip()] = value.strip()
        idx += 1

    if "version" not in metadata or "columns" not in metadata:
        raise RuntimeError("Snapshot header is missing required fields such as version or columns.")

    columns = [part.strip() for part in metadata["columns"].split("\t") if part.strip()]
    if not columns:
        columns = [part.strip() for part in re.split(r"\s+", metadata["columns"]) if part.strip()]

    while idx < len(lines):
        line = lines[idx]
        if not line.strip():
            idx += 1
            continue
        if line.count("\t") != 1:
            break
        parts = line.split("\t", 1)
        pid_text, path_text = parts
        if not pid_text.isdigit():
            break
        paths.append(
            {
                "pid": int(pid_text),
                "path": path_text,
            }
        )
        idx += 1

    active_record_columns = columns

    while idx < len(lines):
        line = lines[idx].strip()
        if not line:
            idx += 1
            continue
        if line.endswith(":"):
            section_name = line[:-1]
            idx += 1
            rows: list[dict[str, object]] = []
            while idx < len(lines):
                row_line = lines[idx].strip()
                if not row_line:
                    idx += 1
                    continue
                if row_line.endswith(":"):
                    break
                parts = row_line.split("\t")
                if len(parts) == len(columns):
                    break
                if len(parts) == 2 and parts[0].isdigit() and parts[1].isdigit():
                    rows.append({"key": int(parts[0]), "value": int(parts[1])})
                    idx += 1
                    continue
                break
            section_rows[section_name] = rows
            continue
        if ":" in line:
            key, value = line.split(":", 1)
            key = key.strip()
            value = value.strip()
            if key.startswith("columns") and value:
                active_record_columns = [part.strip() for part in value.split("\t") if part.strip()]
                if not active_record_columns:
                    active_record_columns = [part.strip() for part in re.split(r"\s+", value) if part.strip()]
                metadata[key] = value
                idx += 1
                continue
        break

    while idx < len(lines):
        line = lines[idx].strip()
        idx += 1
        if not line:
            continue
        parts = [part for part in line.split("\t")]
        if len(parts) != len(active_record_columns):
            if line.endswith(":"):
                continue
            raise RuntimeError(f"Record column count mismatch: expected {len(active_record_columns)}, got {len(parts)} in line: {line}")
        record: dict[str, object] = {}
        for col_name, value in zip(active_record_columns, parts):
            if col_name in {"pid", "vid", "size", "mode", "ts"} and value != "-":
                try:
                    record[col_name] = int(value)
                except ValueError:
                    record[col_name] = value
            else:
                record[col_name] = value
        records.append(record)

    path_map = {entry["pid"]: entry["path"] for entry in paths}

    return {
        "format_name": FORMAT_NAME,
        "format_id": "notfinder_llm_snapshot_v2",
        "endpoint": metadata.get("endpoint", ""),
        "internal_name": metadata.get("internal_name", ""),
        "version": metadata.get("version", ""),
        "head_fid": metadata.get("head_fid", ""),
        "exported_at_ms": int(metadata.get("exported_at_ms", "0") or 0),
        "columns": columns,
        "active_record_columns": active_record_columns,
        "path_count": len(paths),
        "record_count": len(records),
        "section_rows": section_rows,
        "paths": paths,
        "path_map": path_map,
        "records": records,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Parse a notFinder LLM Snapshot manifest from a file path or NBSS:FID source.")
    parser.add_argument("source", help="Local file path or NBSS:0x... source.")
    parser.add_argument("--summary-only", action="store_true", help="Return only metadata, counts, and path samples.")
    parser.add_argument("--sample-paths", type=int, default=20, help="Number of paths to include in summary mode.")
    args = parser.parse_args()

    text = fetch_snapshot_text(args.source)
    parsed = parse_snapshot_text(text)

    if args.summary_only:
        output = {
            "format_name": parsed["format_name"],
            "format_id": parsed["format_id"],
            "endpoint": parsed["endpoint"],
            "internal_name": parsed["internal_name"],
            "version": parsed["version"],
            "head_fid": parsed["head_fid"],
            "exported_at_ms": parsed["exported_at_ms"],
            "columns": parsed["columns"],
            "record_columns": parsed["active_record_columns"],
            "path_count": parsed["path_count"],
            "record_count": parsed["record_count"],
            "sections": {name: len(rows) for name, rows in parsed["section_rows"].items()},
            "sample_paths": parsed["paths"][: args.sample_paths],
        }
    else:
        output = parsed

    json.dump(output, sys.stdout, ensure_ascii=False)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
