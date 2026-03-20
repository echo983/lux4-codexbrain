#!/usr/bin/env python3
from __future__ import annotations

import argparse
import io
import json
import struct
import sys
from pathlib import Path
from urllib import error, request


DEFAULT_NBSS_BASE_URL = "http://127.0.0.1:8080/nbss"
NBSS_PREFIX = "NBSS:"
HEAD_MAGIC = b"PVLOGHD^"
SEGMENT_MAGIC = b"PVLOGSG^"


def fetch_bytes(source: str) -> bytes:
    if source.startswith(NBSS_PREFIX):
        source = source[len(NBSS_PREFIX) :].strip()
    if source.startswith("0x"):
        base_path = Path(DEFAULT_NBSS_BASE_URL)
        if base_path.is_dir():
            local_object = base_path / source
            if not local_object.exists():
                raise RuntimeError(f"Local PVLog object not found: {local_object}")
            return local_object.read_bytes()

        url = f"{DEFAULT_NBSS_BASE_URL}/{source}"
        req = request.Request(url, method="GET")
        try:
            with request.urlopen(req, timeout=30) as response:
                return response.read()
        except error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"NBSS fetch failed with HTTP {exc.code}: {detail}") from exc
        except error.URLError as exc:
            raise RuntimeError(f"NBSS fetch failed: {exc}") from exc

    path = Path(source)
    if not path.exists():
        raise RuntimeError(f"PVLog source not found: {source}")
    return path.read_bytes()


def parse_string(buffer: io.BytesIO) -> str | None:
    length_bytes = buffer.read(8)
    if len(length_bytes) < 8:
        return None
    length = struct.unpack("<Q", length_bytes)[0]
    return buffer.read(length).decode("utf-8", errors="ignore")


def parse_base_ref(buffer: io.BytesIO) -> dict[str, object] | None:
    tag_bytes = buffer.read(4)
    if len(tag_bytes) < 4:
        return None
    tag = struct.unpack("<I", tag_bytes)[0]
    if tag in (0, 1):
        fid = struct.unpack("<Q", buffer.read(8))[0]
        size = struct.unpack("<Q", buffer.read(8))[0]
        return {
            "kind": "DIRECT" if tag == 0 else "MANIFEST",
            "fid": f"0x{fid:016X}",
            "size": size,
        }
    if tag == 2:
        vid = struct.unpack("<Q", buffer.read(8))[0]
        return {"kind": "VERSION", "vid": vid}
    return {"kind": "UNKNOWN", "tag": tag}


def parse_record(buffer: io.BytesIO) -> dict[str, object] | None:
    type_byte = buffer.read(1)
    if not type_byte:
        return None
    flags_byte = buffer.read(1)
    if not flags_byte:
        raise RuntimeError("PVLog record missing flags byte.")
    length_bytes = buffer.read(4)
    timestamp_bytes = buffer.read(8)
    if len(length_bytes) < 4 or len(timestamp_bytes) < 8:
        raise RuntimeError("PVLog record header is truncated.")
    payload_length = struct.unpack("<I", length_bytes)[0]
    record_timestamp = struct.unpack("<Q", timestamp_bytes)[0]
    payload = buffer.read(payload_length)
    if len(payload) != payload_length:
        raise RuntimeError("PVLog record payload is truncated.")

    record_type = type_byte[0]
    payload_buffer = io.BytesIO(payload)
    record: dict[str, object] = {
        "raw_type": record_type,
        "flags": flags_byte[0],
        "payload_length": payload_length,
        "record_ts": record_timestamp,
    }

    if record_type == 1:
        record["type"] = "MKDIR"
        record["path"] = parse_string(payload_buffer)
        record["ts"] = record_timestamp
        return record

    if record_type in (2, 3):
        path = parse_string(payload_buffer)
        fid = struct.unpack("<Q", payload_buffer.read(8))[0]
        size = struct.unpack("<Q", payload_buffer.read(8))[0]
        record["type"] = "FILE_V1" if record_type == 2 else "FILE_V1_MANIFEST"
        record["path"] = path
        record["ts"] = record_timestamp
        record["base_ref"] = {
            "kind": "DIRECT" if record_type == 2 else "MANIFEST",
            "fid": f"0x{fid:016X}",
            "size": size,
        }
        return record

    if record_type == 8:
        path = parse_string(payload_buffer)
        vid_bytes = payload_buffer.read(8)
        opt_tag_bytes = payload_buffer.read(1)
        if len(vid_bytes) < 8 or len(opt_tag_bytes) < 1:
            raise RuntimeError("PVLog FILE_V2 record is truncated before version fields.")
        vid = struct.unpack("<Q", vid_bytes)[0]
        opt_tag = opt_tag_bytes[0]
        prev_vid = None
        if opt_tag == 1:
            prev_vid_bytes = payload_buffer.read(8)
            if len(prev_vid_bytes) < 8:
                raise RuntimeError("PVLog FILE_V2 record is truncated at prev_vid.")
            prev_vid = struct.unpack("<Q", prev_vid_bytes)[0]
        size_bytes = payload_buffer.read(8)
        ts_bytes = payload_buffer.read(8)
        if len(size_bytes) < 8 or len(ts_bytes) < 8:
            raise RuntimeError("PVLog FILE_V2 record is truncated at size/ts.")
        record["type"] = "FILE_V2"
        record["path"] = path
        record["vid"] = vid
        record["prev_vid"] = prev_vid
        record["size"] = struct.unpack("<Q", size_bytes)[0]
        record["ts"] = struct.unpack("<Q", ts_bytes)[0]
        record["base_ref"] = parse_base_ref(payload_buffer)
        return record

    record["type"] = "OTHER"
    return record


def parse_head_bytes(data: bytes) -> dict[str, object]:
    if len(data) < 20:
        raise RuntimeError("PVLog head is too short.")
    if data[:8] != HEAD_MAGIC:
        raise RuntimeError("Object is not a PVLog head: missing PVLOGHD^ magic.")
    return {
        "format_name": "PVLog Head",
        "format_id": "pvlog_head_v2",
        "magic": data[:8].decode("ascii", errors="replace"),
        "version": struct.unpack("<I", data[8:12])[0],
        "current_seg_fid": f"0x{struct.unpack('<Q', data[12:20])[0]:016X}",
        "raw_size": len(data),
    }


def parse_segment_bytes(data: bytes) -> dict[str, object]:
    if len(data) < 32:
        raise RuntimeError("PVLog segment is too short.")
    if data[:8] != SEGMENT_MAGIC:
        raise RuntimeError("Object is not a PVLog segment: missing PVLOGSG^ magic.")
    record_count = struct.unpack("<I", data[24:28])[0]
    payload_buffer = io.BytesIO(data[32:])
    records = []
    for _ in range(record_count):
        record = parse_record(payload_buffer)
        if record is None:
            raise RuntimeError("PVLog segment ended before all records were parsed.")
        records.append(record)
    return {
        "magic": data[:8].decode("ascii", errors="replace"),
        "version": struct.unpack("<I", data[8:12])[0],
        "prev_seg_fid": f"0x{struct.unpack('<Q', data[16:24])[0]:016X}",
        "record_count": record_count,
        "records": records,
        "raw_size": len(data),
    }


def collect_segments(source: str) -> tuple[dict[str, object], list[dict[str, object]]]:
    head = parse_head_bytes(fetch_bytes(source))
    segments: list[dict[str, object]] = []
    current_seg_fid = head["current_seg_fid"]
    seen: set[str] = set()
    while current_seg_fid != "0x0000000000000000":
        if current_seg_fid in seen:
            raise RuntimeError(f"Detected PVLog segment loop at {current_seg_fid}.")
        seen.add(current_seg_fid)
        segment = parse_segment_bytes(fetch_bytes(current_seg_fid))
        segment["segment_fid"] = current_seg_fid
        segments.append(segment)
        current_seg_fid = segment["prev_seg_fid"]
    return head, segments


def build_latest_records(segments: list[dict[str, object]]) -> dict[str, dict[str, object]]:
    latest_by_path: dict[str, dict[str, object]] = {}
    for segment in segments:
        for record in segment["records"]:
            path = record.get("path")
            if isinstance(path, str) and path not in latest_by_path:
                latest_by_path[path] = record
    return latest_by_path


def read_projected_file(source: str, target_path: str) -> bytes | None:
    _, segments = collect_segments(source)
    for segment in segments:
        records = segment["records"]
        for record in reversed(records):
            if record.get("path") != target_path:
                continue
            base_ref = record.get("base_ref")
            if not isinstance(base_ref, dict):
                continue
            fid = base_ref.get("fid")
            kind = base_ref.get("kind")
            if isinstance(fid, str) and kind in {"DIRECT", "MANIFEST"}:
                try:
                    return fetch_bytes(fid)
                except RuntimeError:
                    continue
    return None


def build_summary(source: str, sample_paths: int) -> dict[str, object]:
    head, segments = collect_segments(source)
    latest_by_path = build_latest_records(segments)
    type_counts: dict[str, int] = {}
    for segment in segments:
        for record in segment["records"]:
            record_type = str(record.get("type", "OTHER"))
            type_counts[record_type] = type_counts.get(record_type, 0) + 1
    return {
        **head,
        "segment_count": len(segments),
        "record_count": sum(segment["record_count"] for segment in segments),
        "record_types": type_counts,
        "path_count": len(latest_by_path),
        "sample_paths": [
            {
                "path": path,
                "type": latest_by_path[path].get("type"),
                "base_ref": latest_by_path[path].get("base_ref"),
            }
            for path in list(latest_by_path)[:sample_paths]
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Inspect or project a PVLog head from NBSS or a local file.")
    subparsers = parser.add_subparsers(dest="command", required=True)

    inspect_parser = subparsers.add_parser("inspect", help="Print JSON metadata and segment summaries.")
    inspect_parser.add_argument("source", help="NBSS:0x..., bare 0x..., or a local file path.")
    inspect_parser.add_argument("--sample-paths", type=int, default=20, help="Number of projected paths to include in summary output.")
    inspect_parser.add_argument("--full", action="store_true", help="Include full segment and record details.")

    list_parser = subparsers.add_parser("list", help="List projected live paths from a PVLog head.")
    list_parser.add_argument("source", help="NBSS:0x..., bare 0x..., or a local file path.")

    read_parser = subparsers.add_parser("read", help="Read a projected file from a PVLog head.")
    read_parser.add_argument("source", help="NBSS:0x..., bare 0x..., or a local file path.")
    read_parser.add_argument("path", help="Projected path to read.")

    args = parser.parse_args()

    if args.command == "inspect":
        if args.full:
            head, segments = collect_segments(args.source)
            output = {
                **head,
                "segments": segments,
            }
        else:
            output = build_summary(args.source, sample_paths=args.sample_paths)
        json.dump(output, sys.stdout, ensure_ascii=False)
        sys.stdout.write("\n")
        return 0

    if args.command == "list":
        _, segments = collect_segments(args.source)
        latest_by_path = build_latest_records(segments)
        for path, record in latest_by_path.items():
            sys.stdout.write(f"{record.get('type', 'OTHER')}\t{path}\n")
        return 0

    if args.command == "read":
        content = read_projected_file(args.source, args.path)
        if content is None:
            raise SystemExit(f"Projected path not found or target object missing: {args.path}")
        sys.stdout.buffer.write(content)
        return 0

    raise SystemExit(1)


if __name__ == "__main__":
    raise SystemExit(main())
