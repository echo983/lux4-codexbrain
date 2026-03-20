from __future__ import annotations

import io
import json
import struct
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from scripts.parse_pvlog_head import (
    HEAD_MAGIC,
    SEGMENT_MAGIC,
    build_latest_records,
    collect_segments,
    main,
    parse_head_bytes,
    parse_segment_bytes,
    read_projected_file,
)


def pack_string(value: str) -> bytes:
    encoded = value.encode("utf-8")
    return struct.pack("<Q", len(encoded)) + encoded


def build_record_mkdir(path: str, ts: int) -> bytes:
    payload = pack_string(path)
    return bytes([1, 0]) + struct.pack("<I", len(payload)) + struct.pack("<Q", ts) + payload


def build_record_file_v1(path: str, fid: int, size: int, ts: int) -> bytes:
    payload = pack_string(path) + struct.pack("<Q", fid) + struct.pack("<Q", size)
    return bytes([2, 0]) + struct.pack("<I", len(payload)) + struct.pack("<Q", ts) + payload


def build_record_file_v2(path: str, vid: int, prev_vid: int | None, size: int, ts: int, base_fid: int, base_size: int) -> bytes:
    payload = pack_string(path)
    payload += struct.pack("<Q", vid)
    if prev_vid is None:
        payload += bytes([0])
    else:
        payload += bytes([1]) + struct.pack("<Q", prev_vid)
    payload += struct.pack("<Q", size)
    payload += struct.pack("<Q", ts)
    payload += struct.pack("<I", 0)
    payload += struct.pack("<Q", base_fid)
    payload += struct.pack("<Q", base_size)
    return bytes([8, 0]) + struct.pack("<I", len(payload)) + struct.pack("<Q", ts) + payload


def build_segment(prev_seg_fid: int, *records: bytes) -> bytes:
    return (
        SEGMENT_MAGIC
        + struct.pack("<I", 2)
        + struct.pack("<I", 0)
        + struct.pack("<Q", prev_seg_fid)
        + struct.pack("<I", len(records))
        + struct.pack("<I", 0)
        + b"".join(records)
    )


def build_head(current_seg_fid: int) -> bytes:
    return HEAD_MAGIC + struct.pack("<I", 2) + struct.pack("<Q", current_seg_fid) + struct.pack("<Q", 0)


class ParsePvlogHeadTests(unittest.TestCase):
    def test_parse_head_and_segment_bytes(self) -> None:
        head = parse_head_bytes(build_head(0x111))
        self.assertEqual(head["magic"], "PVLOGHD^")
        self.assertEqual(head["current_seg_fid"], "0x0000000000000111")

        segment = parse_segment_bytes(build_segment(0, build_record_mkdir(".notFinder", 123)))
        self.assertEqual(segment["magic"], "PVLOGSG^")
        self.assertEqual(segment["record_count"], 1)
        self.assertEqual(segment["records"][0]["type"], "MKDIR")

    def test_collect_latest_records_and_read(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            tmp = Path(tmpdir)
            head_path = tmp / "head.bin"
            seg_new_path = tmp / "0x0000000000000AAA"
            seg_old_path = tmp / "0x0000000000000BBB"
            file_path = tmp / "0x0000000000000CCC"

            file_path.write_bytes(b"hello pvlog")
            seg_old_path.write_bytes(
                build_segment(
                    0,
                    build_record_file_v2("doc.txt", 100, None, 0, 1000, 0x0CCC, 0),
                    build_record_file_v2("doc.txt", 101, 100, 11, 1001, 0x0CCC, 11),
                )
            )
            seg_new_path.write_bytes(
                build_segment(
                    0x0BBB,
                    build_record_mkdir(".notFinder", 2000),
                    build_record_file_v1(".notFinder/me", 0x0CCC, 11, 2000),
                )
            )
            head_path.write_bytes(build_head(0x0AAA))

            with mock.patch("scripts.parse_pvlog_head.DEFAULT_NBSS_BASE_URL", str(tmp)):
                head, segments = collect_segments(str(head_path))
                latest = build_latest_records(segments)
                self.assertEqual(head["current_seg_fid"], "0x0000000000000AAA")
                self.assertEqual(list(latest), [".notFinder", ".notFinder/me", "doc.txt"])
                content = read_projected_file(str(head_path), "doc.txt")

        self.assertEqual(content, b"hello pvlog")

    def test_main_inspect_summary(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            tmp = Path(tmpdir)
            head_path = tmp / "head.bin"
            seg_path = tmp / "0x0000000000000555"
            file_path = tmp / "0x0000000000000777"

            file_path.write_bytes(b"abc")
            seg_path.write_bytes(build_segment(0, build_record_file_v1("note.txt", 0x777, 3, 1234)))
            head_path.write_bytes(build_head(0x555))

            with mock.patch("sys.argv", ["parse_pvlog_head.py", "inspect", str(head_path), "--sample-paths", "1"]):
                with mock.patch("scripts.parse_pvlog_head.DEFAULT_NBSS_BASE_URL", str(tmp)):
                    stdout = io.StringIO()
                    with mock.patch("sys.stdout", stdout):
                        exit_code = main()

        self.assertEqual(exit_code, 0)
        output = json.loads(stdout.getvalue())
        self.assertEqual(output["segment_count"], 1)
        self.assertEqual(output["path_count"], 1)
        self.assertEqual(output["sample_paths"][0]["path"], "note.txt")


if __name__ == "__main__":
    unittest.main()
