from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from scripts.cloudflare_flux_image_generate import _multipart_body, generate_image


class CloudflareFluxImageGenerateTests(unittest.TestCase):
    def test_multipart_body_contains_fields(self) -> None:
        body, boundary = _multipart_body([("prompt", "hello"), ("width", "1024")], [])
        text = body.decode("utf-8", errors="replace")
        self.assertIn(boundary, text)
        self.assertIn('name="prompt"', text)
        self.assertIn("hello", text)

    def test_generate_image_writes_png(self) -> None:
        response = mock.MagicMock()
        response.read.return_value = json.dumps(
            {"success": True, "result": {"image": "aGVsbG8="}}
        ).encode("utf-8")
        response.__enter__.return_value = response
        response.__exit__.return_value = None
        with tempfile.TemporaryDirectory() as tmpdir:
            output = Path(tmpdir) / "image.png"
            with (
                mock.patch("scripts.cloudflare_flux_image_generate.resolve_config", return_value=("acct", "token")),
                mock.patch("scripts.cloudflare_flux_image_generate.request.urlopen", return_value=response),
            ):
                result = generate_image(
                    prompt="draw terrain",
                    output=output,
                    model="@cf/black-forest-labs/flux-2-klein-9b",
                    width=1024,
                    height=1024,
                    steps=25,
                    seed=None,
                    input_images=[],
                )
            self.assertEqual(output.read_bytes(), b"hello")
            self.assertEqual(result["output_path"], str(output))


if __name__ == "__main__":
    unittest.main()
