from __future__ import annotations

import io
import json
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from scripts.cloudflare_qwen3_chat import chat, load_dotenv_file, main, resolve_config


class CloudflareQwen3ChatTests(unittest.TestCase):
    def test_load_dotenv_file_parses_quotes(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            env_path = Path(tmpdir) / ".env"
            env_path.write_text(
                "\n".join(
                    [
                        "CF_ACCOUNT_ID=acct-1",
                        "CF_AUTH_TOKEN='token-2'",
                        'CF_MODEL="@cf/qwen/qwen3-30b-a3b-fp8"',
                    ]
                ),
                encoding="utf-8",
            )
            values = load_dotenv_file(env_path)

        self.assertEqual(values["CF_ACCOUNT_ID"], "acct-1")
        self.assertEqual(values["CF_AUTH_TOKEN"], "token-2")
        self.assertEqual(values["CF_MODEL"], "@cf/qwen/qwen3-30b-a3b-fp8")

    def test_resolve_config_falls_back_to_lux4_keys(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            repo_root = Path(tmpdir)
            script_path = repo_root / "scripts" / "cloudflare_qwen3_chat.py"
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
            with mock.patch("scripts.cloudflare_qwen3_chat.__file__", str(script_path)):
                with mock.patch("scripts.cloudflare_qwen3_chat.Path.cwd", return_value=repo_root / "isolated-cwd"):
                    with mock.patch.dict("os.environ", {}, clear=True):
                        account_id, token, model = resolve_config()

        self.assertEqual(account_id, "acct-123")
        self.assertEqual(token, "token-456")
        self.assertEqual(model, "@cf/qwen/qwen3-30b-a3b-fp8")

    def test_chat_parses_success_response(self) -> None:
        response = mock.MagicMock()
        response.read.return_value = json.dumps(
            {
                "success": True,
                "result": {
                    "choices": [
                        {
                            "message": {
                                "content": "hello from qwen",
                            }
                        }
                    ]
                },
            }
        ).encode("utf-8")
        response.__enter__.return_value = response
        response.__exit__.return_value = None

        with mock.patch("scripts.cloudflare_qwen3_chat.request.urlopen", return_value=response) as urlopen_mock:
            text = chat(
                "hello",
                system="You are helpful.",
                account_id="acct-1",
                token="token-1",
                model="@cf/qwen/qwen3-30b-a3b-fp8",
            )

        self.assertEqual(text, "hello from qwen")
        req = urlopen_mock.call_args.args[0]
        self.assertEqual(req.full_url, "https://api.cloudflare.com/client/v4/accounts/acct-1/ai/run/@cf/qwen/qwen3-30b-a3b-fp8")

    def test_main_prints_text(self) -> None:
        stdout = io.StringIO()
        with mock.patch("scripts.cloudflare_qwen3_chat.resolve_config", return_value=("acct-1", "token-1", "@cf/qwen/qwen3-30b-a3b-fp8")):
            with mock.patch("scripts.cloudflare_qwen3_chat.chat", return_value="hello from qwen") as chat_mock:
                with mock.patch("sys.argv", ["cloudflare_qwen3_chat.py", "hello", "world"]):
                    with mock.patch("sys.stdout", stdout):
                        exit_code = main()

        self.assertEqual(exit_code, 0)
        self.assertEqual(stdout.getvalue(), "hello from qwen\n")
        self.assertEqual(chat_mock.call_args.args[0], "hello\nworld")


if __name__ == "__main__":
    unittest.main()
