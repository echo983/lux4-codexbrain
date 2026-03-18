from __future__ import annotations

import io
import json
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from scripts.lancedb_local_api import load_dotenv_file, post_json, resolve_lancedb_url
from scripts import lancedb_search, lancedb_upsert


class LanceDbLocalApiTests(unittest.TestCase):
    def test_load_dotenv_file_parses_quotes(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            env_path = Path(tmpdir) / ".env"
            env_path.write_text("LUX4_LANCEDB_URL='http://127.0.0.1:24681'\n", encoding="utf-8")
            values = load_dotenv_file(env_path)
        self.assertEqual(values["LUX4_LANCEDB_URL"], "http://127.0.0.1:24681")

    def test_resolve_lancedb_url_reads_repo_env(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            repo_root = Path(tmpdir)
            script_path = repo_root / "scripts" / "lancedb_local_api.py"
            script_path.parent.mkdir(parents=True, exist_ok=True)
            script_path.write_text("# placeholder", encoding="utf-8")
            (repo_root / ".env").write_text("LUX4_LANCEDB_URL=http://127.0.0.1:29999\n", encoding="utf-8")
            with mock.patch("scripts.lancedb_local_api.__file__", str(script_path)):
                with mock.patch("scripts.lancedb_local_api.Path.cwd", return_value=repo_root / "isolated-cwd"):
                    with mock.patch.dict("os.environ", {}, clear=True):
                        url = resolve_lancedb_url()
        self.assertEqual(url, "http://127.0.0.1:29999")

    def test_post_json_parses_success_response(self) -> None:
        response = mock.MagicMock()
        response.read.return_value = b'{"ok":true}'
        response.__enter__.return_value = response
        response.__exit__.return_value = None
        with mock.patch("scripts.lancedb_local_api.request.urlopen", return_value=response):
            result = post_json("http://127.0.0.1:24681/upsert", {"hello": "world"})
        self.assertEqual(result, {"ok": True})


class LanceDbPrimitiveScriptTests(unittest.TestCase):
    def test_lancedb_upsert_prints_json(self) -> None:
        stdout = io.StringIO()
        with mock.patch("scripts.lancedb_upsert.resolve_lancedb_url", return_value="http://127.0.0.1:24681"):
            with mock.patch("scripts.lancedb_upsert.post_json", return_value={"rows_written": 1}) as post_mock:
                with mock.patch("sys.argv", ["lancedb_upsert.py", "--id", "a", "--text", "hello", "--vector-json", "[0.1, 0.2]"]):
                    with mock.patch("sys.stdout", stdout):
                        exit_code = lancedb_upsert.main()
        self.assertEqual(exit_code, 0)
        self.assertEqual(json.loads(stdout.getvalue()), {"rows_written": 1})
        payload = post_mock.call_args.args[1]
        self.assertEqual(payload["table"], "documents")
        self.assertEqual(payload["documents"][0]["id"], "a")

    def test_lancedb_search_prints_json(self) -> None:
        stdout = io.StringIO()
        with mock.patch("scripts.lancedb_search.resolve_lancedb_url", return_value="http://127.0.0.1:24681"):
            with mock.patch("scripts.lancedb_search.post_json", return_value={"count": 1}) as post_mock:
                with mock.patch("sys.argv", ["lancedb_search.py", "--query-vector-json", "[0.1, 0.2]", "--limit", "3"]):
                    with mock.patch("sys.stdout", stdout):
                        exit_code = lancedb_search.main()
        self.assertEqual(exit_code, 0)
        self.assertEqual(json.loads(stdout.getvalue()), {"count": 1})
        payload = post_mock.call_args.args[1]
        self.assertEqual(payload["table"], "documents")
        self.assertEqual(payload["limit"], 3)


if __name__ == "__main__":
    unittest.main()
