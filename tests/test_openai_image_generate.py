from __future__ import annotations

import io
import json
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from scripts.openai_image_generate import (
    _multipart_body,
    build_parser,
    default_output_path,
    generate_with_image_api,
    generate_with_responses_api,
    load_dotenv_file,
    resolve_config,
)


class OpenAIImageGenerateTests(unittest.TestCase):
    def test_load_dotenv_file_parses_values(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            env_path = Path(tmpdir) / ".env"
            env_path.write_text("OPENAI_API_KEY='sk-test'\nOPENAI_BASE_URL=\"https://example.test/v1\"\n", encoding="utf-8")
            values = load_dotenv_file(env_path)
        self.assertEqual(values["OPENAI_API_KEY"], "sk-test")
        self.assertEqual(values["OPENAI_BASE_URL"], "https://example.test/v1")

    def test_resolve_config_reads_repo_env(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            repo_root = Path(tmpdir)
            script_path = repo_root / "scripts" / "openai_image_generate.py"
            script_path.parent.mkdir(parents=True, exist_ok=True)
            script_path.write_text("# placeholder", encoding="utf-8")
            (repo_root / ".env").write_text("OPENAI_API_KEY=sk-repo\n", encoding="utf-8")
            with mock.patch("scripts.openai_image_generate.REPO_ROOT", repo_root):
                with mock.patch("scripts.openai_image_generate.Path.cwd", return_value=repo_root / "cwd"):
                    with mock.patch.dict("os.environ", {}, clear=True):
                        api_key, base_url = resolve_config()
        self.assertEqual(api_key, "sk-repo")
        self.assertEqual(base_url, "https://api.openai.com/v1")

    def test_multipart_body_contains_fields_and_files(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            image_path = Path(tmpdir) / "a.png"
            image_path.write_bytes(b"png-bytes")
            body, boundary = _multipart_body([("model", "gpt-image-1.5")], [("image[]", image_path)])
        text = body.decode("utf-8", errors="replace")
        self.assertIn(boundary, text)
        self.assertIn('name="model"', text)
        self.assertIn('name="image[]"; filename="a.png"', text)

    def test_generate_with_image_api_parses_json_and_writes_file(self) -> None:
        response = mock.MagicMock()
        response.read.return_value = json.dumps({"data": [{"b64_json": "aGVsbG8="}]}).encode("utf-8")
        response.__enter__.return_value = response
        response.__exit__.return_value = None
        with tempfile.TemporaryDirectory() as tmpdir:
            output = Path(tmpdir) / "image.png"
            with mock.patch("scripts.openai_image_generate.request.urlopen", return_value=response):
                result = generate_with_image_api(
                    api_key="sk-test",
                    base_url="https://api.openai.com/v1",
                    prompt="draw a planet",
                    model="gpt-image-1.5",
                    output=output,
                    size="1024x1024",
                    quality="high",
                    background="opaque",
                    output_format="png",
                    output_compression=None,
                    moderation=None,
                    n=1,
                    input_images=[],
                    mask=None,
                    input_fidelity=None,
                )
            self.assertEqual(output.read_bytes(), b"hello")
            self.assertEqual(result["mode"], "generate")

    def test_generate_with_responses_api_parses_output(self) -> None:
        response = mock.MagicMock()
        response.read.return_value = json.dumps(
            {
                "output": [
                    {
                        "type": "image_generation_call",
                        "result": "aGVsbG8=",
                    }
                ]
            }
        ).encode("utf-8")
        response.__enter__.return_value = response
        response.__exit__.return_value = None
        with tempfile.TemporaryDirectory() as tmpdir:
            output = Path(tmpdir) / "image.png"
            with mock.patch("scripts.openai_image_generate.request.urlopen", return_value=response):
                result = generate_with_responses_api(
                    api_key="sk-test",
                    base_url="https://api.openai.com/v1",
                    prompt="draw a planet",
                    model="gpt-5",
                    output=output,
                    image_action="generate",
                    quality="high",
                    background="opaque",
                    size="1024x1024",
                    output_format="png",
                    output_compression=None,
                    moderation=None,
                    partial_images=0,
                )
            self.assertEqual(output.read_bytes(), b"hello")
            self.assertEqual(result["api"], "responses")

    def test_default_output_path_uses_var_directory(self) -> None:
        output = default_output_path("", "png")
        self.assertEqual(output.suffix, ".png")
        self.assertIn("/var/openai_image_experiments/", str(output))

    def test_parser_accepts_image_flags(self) -> None:
        parser = build_parser()
        args = parser.parse_args(["--api", "image", "--image", "a.png", "--mask", "m.png", "hello"])
        self.assertEqual(args.api, "image")
        self.assertEqual(args.input_images, ["a.png"])
        self.assertEqual(args.mask, "m.png")


if __name__ == "__main__":
    unittest.main()
