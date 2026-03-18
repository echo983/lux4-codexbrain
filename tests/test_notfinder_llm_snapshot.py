from __future__ import annotations

import io
import json
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from scripts.parse_notfinder_llm_snapshot import FORMAT_NAME, main, parse_snapshot_text


SAMPLE_SNAPSHOT = """endpoint: http://127.0.0.1:9090
internal_name: sample
version: 2
head_fid: 0xABC
exported_at_ms: 1773797747266
columns: pid\tvid\tprev\tfid\tsize\tmode\tts
paths:
0\t.notFinder/me
1\tnote-1.json
2\tnote-2.html
0\t100\t-\tD:0xAAA:12\t12\t0\t1773797700000
1\t101\t100\tD:0xBBB:34\t34\t0\t1773797710000
"""


class NotFinderLlmSnapshotTests(unittest.TestCase):
    def test_parse_snapshot_text(self) -> None:
        parsed = parse_snapshot_text(SAMPLE_SNAPSHOT)
        self.assertEqual(parsed["format_name"], FORMAT_NAME)
        self.assertEqual(parsed["version"], "2")
        self.assertEqual(parsed["path_count"], 3)
        self.assertEqual(parsed["record_count"], 2)
        self.assertEqual(parsed["path_map"][1], "note-1.json")
        self.assertEqual(parsed["records"][1]["fid"], "D:0xBBB:34")

    def test_main_summary_only(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            source_path = Path(tmpdir) / "snapshot.txt"
            source_path.write_text(SAMPLE_SNAPSHOT, encoding="utf-8")
            stdout = io.StringIO()
            with mock.patch("sys.argv", ["parse_notfinder_llm_snapshot.py", str(source_path), "--summary-only", "--sample-paths", "1"]):
                with mock.patch("sys.stdout", stdout):
                    exit_code = main()

        self.assertEqual(exit_code, 0)
        output = json.loads(stdout.getvalue())
        self.assertEqual(output["path_count"], 3)
        self.assertEqual(len(output["sample_paths"]), 1)


if __name__ == "__main__":
    unittest.main()
