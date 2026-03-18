from __future__ import annotations

import io
import json
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from scripts.cloudflare_bge_reranker_base import load_dotenv_file, main, rerank, resolve_config


class CloudflareBgeRerankerBaseTests(unittest.TestCase):
    def test_load_dotenv_file_parses_quotes(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            env_path = Path(tmpdir) / ".env"
            env_path.write_text(
                "\n".join(
                    [
                        "CF_ACCOUNT_ID=acct-1",
                        "CF_AUTH_TOKEN='token-2'",
                        'CF_RERANKER_MODEL="@cf/baai/bge-reranker-base"',
                    ]
                ),
                encoding="utf-8",
            )
            values = load_dotenv_file(env_path)

        self.assertEqual(values["CF_ACCOUNT_ID"], "acct-1")
        self.assertEqual(values["CF_AUTH_TOKEN"], "token-2")
        self.assertEqual(values["CF_RERANKER_MODEL"], "@cf/baai/bge-reranker-base")

    def test_resolve_config_falls_back_to_lux4_keys(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            repo_root = Path(tmpdir)
            script_path = repo_root / "scripts" / "cloudflare_bge_reranker_base.py"
            script_path.parent.mkdir(parents=True, exist_ok=True)
            script_path.write_text("# placeholder", encoding="utf-8")
            (repo_root / ".env").write_text(
                "\n".join(
                    [
                        "LUX4_CF_ACCOUNT_ID=acct-123",
                        "LUX4_CF_API_TOKEN=token-456",
                    ]
                ),
                encoding="utf-8",
            )
            with mock.patch("scripts.cloudflare_bge_reranker_base.__file__", str(script_path)):
                with mock.patch("scripts.cloudflare_bge_reranker_base.Path.cwd", return_value=repo_root / "isolated-cwd"):
                    with mock.patch.dict("os.environ", {}, clear=True):
                        account_id, token, model = resolve_config()

        self.assertEqual(account_id, "acct-123")
        self.assertEqual(token, "token-456")
        self.assertEqual(model, "@cf/baai/bge-reranker-base")

    def test_rerank_parses_and_sorts_success_response(self) -> None:
        response = mock.MagicMock()
        response.read.return_value = json.dumps(
            {
                "success": True,
                "result": {
                    "response": [
                        {"id": 1, "score": 0.1},
                        {"id": 0, "score": 0.9},
                    ]
                },
            }
        ).encode("utf-8")
        response.__enter__.return_value = response
        response.__exit__.return_value = None

        with mock.patch("scripts.cloudflare_bge_reranker_base.request.urlopen", return_value=response) as urlopen_mock:
            ranked = rerank(
                "coffee shop",
                ["cafe and pastries", "drills and screws"],
                account_id="acct-1",
                token="token-1",
                model="@cf/baai/bge-reranker-base",
            )

        self.assertEqual(ranked[0]["id"], 0)
        self.assertEqual(ranked[0]["text"], "cafe and pastries")
        req = urlopen_mock.call_args.args[0]
        self.assertEqual(req.full_url, "https://api.cloudflare.com/client/v4/accounts/acct-1/ai/run/@cf/baai/bge-reranker-base")

    def test_main_prints_ranked_json(self) -> None:
        stdout = io.StringIO()
        fake_ranked = [{"id": 0, "score": 0.7, "text": "doc"}]
        with mock.patch("scripts.cloudflare_bge_reranker_base.resolve_config", return_value=("acct-1", "token-1", "@cf/baai/bge-reranker-base")):
            with mock.patch("scripts.cloudflare_bge_reranker_base.rerank", return_value=fake_ranked) as rerank_mock:
                with mock.patch("sys.argv", ["cloudflare_bge_reranker_base.py", "query", "doc"]):
                    with mock.patch("sys.stdout", stdout):
                        exit_code = main()

        self.assertEqual(exit_code, 0)
        self.assertEqual(json.loads(stdout.getvalue()), fake_ranked)
        self.assertEqual(rerank_mock.call_args.args[0], "query")
        self.assertEqual(rerank_mock.call_args.args[1], ["doc"])


if __name__ == "__main__":
    unittest.main()
