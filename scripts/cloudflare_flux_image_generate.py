#!/usr/bin/env python3
from __future__ import annotations

import argparse
import base64
import mimetypes
import os
import sys
import uuid
from pathlib import Path
from urllib import error, request


REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_MODEL = "@cf/black-forest-labs/flux-2-klein-9b"
DEFAULT_OUTPUT_DIR = REPO_ROOT / "var" / "cloudflare_image_experiments"


def load_dotenv_file(path: Path) -> dict[str, str]:
    if not path.exists():
        return {}
    values: dict[str, str] = {}
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("export "):
            line = line[7:].strip()
        if "=" not in line:
            continue
        key, raw_value = line.split("=", 1)
        key = key.strip()
        if not key:
            continue
        value = raw_value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
            value = value[1:-1]
        values[key] = value
    return values


def resolve_config() -> tuple[str, str]:
    repo_env = load_dotenv_file(REPO_ROOT / ".env")
    cwd_env = load_dotenv_file(Path.cwd() / ".env")

    def read_value(*keys: str, default: str = "") -> str:
        for key in keys:
            value = os.getenv(key)
            if value is not None and value.strip():
                return value.strip()
        for source in (cwd_env, repo_env):
            for key in keys:
                value = source.get(key)
                if value is not None and value.strip():
                    return value.strip()
        return default.strip()

    account_id = read_value("CF_ACCOUNT_ID", "LUX4_CF_ACCOUNT_ID")
    token = read_value("CF_AUTH_TOKEN", "LUX4_CF_API_TOKEN")
    return account_id, token


def _multipart_body(fields: list[tuple[str, str]], files: list[tuple[str, Path]]) -> tuple[bytes, str]:
    boundary = f"----CodexCloudflareBoundary{uuid.uuid4().hex}"
    chunks: list[bytes] = []
    for name, value in fields:
        chunks.append(f"--{boundary}\r\n".encode("utf-8"))
        chunks.append(f'Content-Disposition: form-data; name="{name}"\r\n\r\n'.encode("utf-8"))
        chunks.append(value.encode("utf-8"))
        chunks.append(b"\r\n")
    for name, path in files:
        mime_type = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
        chunks.append(f"--{boundary}\r\n".encode("utf-8"))
        chunks.append(
            (
                f'Content-Disposition: form-data; name="{name}"; filename="{path.name}"\r\n'
                f"Content-Type: {mime_type}\r\n\r\n"
            ).encode("utf-8")
        )
        chunks.append(path.read_bytes())
        chunks.append(b"\r\n")
    chunks.append(f"--{boundary}--\r\n".encode("utf-8"))
    return b"".join(chunks), boundary


def generate_image(
    *,
    prompt: str,
    output: Path,
    model: str,
    width: int,
    height: int,
    steps: int | None,
    seed: int | None,
    input_images: list[Path],
) -> dict:
    account_id, token = resolve_config()
    if not account_id:
        raise RuntimeError("Missing CF_ACCOUNT_ID or LUX4_CF_ACCOUNT_ID.")
    if not token:
        raise RuntimeError("Missing CF_AUTH_TOKEN or LUX4_CF_API_TOKEN.")
    if not prompt.strip():
        raise RuntimeError("Provide a non-empty prompt.")

    fields = [
        ("prompt", prompt),
        ("width", str(width)),
        ("height", str(height)),
    ]
    if steps is not None:
        fields.append(("steps", str(steps)))
    if seed is not None:
        fields.append(("seed", str(seed)))
    files = [(f"input_image_{idx}", path) for idx, path in enumerate(input_images)]
    body, boundary = _multipart_body(fields, files)
    req = request.Request(
        f"https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/run/{model}",
        data=body,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": f"multipart/form-data; boundary={boundary}",
        },
        method="POST",
    )

    try:
        with request.urlopen(req, timeout=240) as response:
            payload = response.read().decode("utf-8")
    except error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Cloudflare FLUX request failed with HTTP {exc.code}: {detail}") from exc
    except error.URLError as exc:
        raise RuntimeError(f"Cloudflare FLUX request failed: {exc}") from exc

    import json

    data = json.loads(payload)
    if not data.get("success"):
        raise RuntimeError(f"Cloudflare FLUX request was not successful: {data.get('errors')}")
    image_b64 = (data.get("result") or {}).get("image")
    if not isinstance(image_b64, str):
        raise RuntimeError(f"Cloudflare FLUX response did not contain result.image: {data}")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_bytes(base64.b64decode(image_b64))
    return {"output_path": str(output), "response": data}


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate or edit an image via Cloudflare Workers AI FLUX.")
    parser.add_argument("prompt", nargs="+")
    parser.add_argument("--output", default="", help="Output image path.")
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--width", type=int, default=1024)
    parser.add_argument("--height", type=int, default=1024)
    parser.add_argument("--steps", type=int, default=25)
    parser.add_argument("--seed", type=int, default=None)
    parser.add_argument("--image", action="append", default=[], help="Optional reference images; max 4, smaller than 512x512.")
    parser.add_argument("--print-json", action="store_true")
    args = parser.parse_args()

    prompt = "\n".join(args.prompt).strip()
    output = Path(args.output).expanduser().resolve() if args.output else (DEFAULT_OUTPUT_DIR / f"flux_{uuid.uuid4().hex[:10]}.png").resolve()
    input_images = [Path(path).expanduser().resolve() for path in args.image]
    for path in input_images:
        if not path.exists():
            raise SystemExit(f"Input image not found: {path}")

    result = generate_image(
        prompt=prompt,
        output=output,
        model=args.model,
        width=args.width,
        height=args.height,
        steps=args.steps,
        seed=args.seed,
        input_images=input_images,
    )
    if args.print_json:
        import json
        print(json.dumps({"model": args.model, "output_path": result["output_path"]}, ensure_ascii=False, indent=2))
    else:
        print(result["output_path"])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
