#!/usr/bin/env python3
from __future__ import annotations

import argparse
import base64
import json
import mimetypes
import os
import sys
import uuid
from pathlib import Path
from urllib import error, request


REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_BASE_URL = "https://api.openai.com/v1"
DEFAULT_IMAGE_MODEL = "gpt-image-1.5"
DEFAULT_RESPONSES_MODEL = "gpt-5"
DEFAULT_OUTPUT_DIR = REPO_ROOT / "var" / "openai_image_experiments"


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
    cwd_env = load_dotenv_file(Path.cwd() / ".env")
    repo_env = load_dotenv_file(REPO_ROOT / ".env")

    def read_value(*keys: str, default: str = "") -> str:
        for key in keys:
            value = os.getenv(key)
            if value is not None:
                return value.strip()
        for source in (cwd_env, repo_env):
            for key in keys:
                value = source.get(key)
                if value is not None:
                    return value.strip()
        return default.strip()

    api_key = read_value("OPENAI_API_KEY")
    base_url = read_value("OPENAI_BASE_URL", default=DEFAULT_BASE_URL).rstrip("/")
    return api_key, base_url


def read_prompt(args: argparse.Namespace) -> str:
    prompt_parts = list(args.prompt)
    if args.stdin:
        stdin_text = sys.stdin.read().strip()
        if stdin_text:
            prompt_parts.append(stdin_text)
    prompt = "\n".join(part for part in prompt_parts if part.strip())
    if not prompt.strip():
        raise RuntimeError("Provide a non-empty prompt.")
    return prompt


def make_output_paths(output: Path, count: int, suffix: str) -> list[Path]:
    output.parent.mkdir(parents=True, exist_ok=True)
    if count <= 1:
        return [output]
    stem = output.stem
    ext = output.suffix or suffix
    return [output.with_name(f"{stem}_{index + 1}{ext}") for index in range(count)]


def save_images(image_base64_list: list[str], output: Path, suffix: str) -> list[Path]:
    paths = make_output_paths(output, len(image_base64_list), suffix)
    for path, image_base64 in zip(paths, image_base64_list):
        path.write_bytes(base64.b64decode(image_base64))
    return paths


def _json_request(url: str, *, api_key: str, payload: dict) -> dict:
    req = request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with request.urlopen(req, timeout=240) as response:
            body = response.read().decode("utf-8")
    except error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"OpenAI request failed with HTTP {exc.code}: {detail}") from exc
    except error.URLError as exc:
        raise RuntimeError(f"OpenAI request failed: {exc}") from exc
    return json.loads(body)


def _multipart_body(fields: list[tuple[str, str]], files: list[tuple[str, Path]]) -> tuple[bytes, str]:
    boundary = f"----OpenAICodexBoundary{uuid.uuid4().hex}"
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


def _multipart_request(url: str, *, api_key: str, fields: list[tuple[str, str]], files: list[tuple[str, Path]]) -> dict:
    body, boundary = _multipart_body(fields, files)
    req = request.Request(
        url,
        data=body,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": f"multipart/form-data; boundary={boundary}",
        },
        method="POST",
    )
    try:
        with request.urlopen(req, timeout=240) as response:
            body_text = response.read().decode("utf-8")
    except error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"OpenAI multipart request failed with HTTP {exc.code}: {detail}") from exc
    except error.URLError as exc:
        raise RuntimeError(f"OpenAI multipart request failed: {exc}") from exc
    return json.loads(body_text)


def generate_with_image_api(
    *,
    api_key: str,
    base_url: str,
    prompt: str,
    model: str,
    output: Path,
    size: str,
    quality: str,
    background: str,
    output_format: str,
    output_compression: int | None,
    moderation: str | None,
    n: int,
    input_images: list[Path],
    mask: Path | None,
    input_fidelity: str | None,
) -> dict:
    if input_images:
        fields = [
            ("model", model),
            ("prompt", prompt),
            ("size", size),
            ("quality", quality),
            ("background", background),
            ("output_format", output_format),
            ("n", str(n)),
        ]
        if output_compression is not None:
            fields.append(("output_compression", str(output_compression)))
        if moderation:
            fields.append(("moderation", moderation))
        if input_fidelity:
            fields.append(("input_fidelity", input_fidelity))
        files: list[tuple[str, Path]] = [("image[]", path) for path in input_images]
        if mask is not None:
            files.append(("mask", mask))
        data = _multipart_request(
            f"{base_url}/images/edits",
            api_key=api_key,
            fields=fields,
            files=files,
        )
    else:
        payload: dict[str, object] = {
            "model": model,
            "prompt": prompt,
            "size": size,
            "quality": quality,
            "background": background,
            "output_format": output_format,
            "n": n,
        }
        if output_compression is not None:
            payload["output_compression"] = output_compression
        if moderation:
            payload["moderation"] = moderation
        data = _json_request(f"{base_url}/images/generations", api_key=api_key, payload=payload)

    image_data = [item.get("b64_json") for item in data.get("data", []) if isinstance(item.get("b64_json"), str)]
    if not image_data:
        raise RuntimeError(f"OpenAI image response did not contain b64_json: {data}")
    saved_paths = save_images(image_data, output, f".{output_format}")
    return {
        "api": "image",
        "mode": "edit" if input_images else "generate",
        "output_paths": [str(path) for path in saved_paths],
        "response": data,
    }


def generate_with_responses_api(
    *,
    api_key: str,
    base_url: str,
    prompt: str,
    model: str,
    output: Path,
    image_action: str,
    quality: str,
    background: str,
    size: str,
    output_format: str,
    output_compression: int | None,
    moderation: str | None,
    partial_images: int,
) -> dict:
    tool: dict[str, object] = {
        "type": "image_generation",
        "action": image_action,
        "quality": quality,
        "background": background,
        "size": size,
        "output_format": output_format,
    }
    if output_compression is not None:
        tool["output_compression"] = output_compression
    if moderation:
        tool["moderation"] = moderation
    if partial_images > 0:
        tool["partial_images"] = partial_images

    payload = {
        "model": model,
        "input": prompt,
        "tools": [tool],
    }
    data = _json_request(f"{base_url}/responses", api_key=api_key, payload=payload)
    image_calls = [item for item in data.get("output", []) if item.get("type") == "image_generation_call"]
    image_data = [item.get("result") for item in image_calls if isinstance(item.get("result"), str)]
    if not image_data:
        raise RuntimeError(f"OpenAI responses image output did not contain result image data: {data}")
    saved_paths = save_images(image_data, output, f".{output_format}")
    return {
        "api": "responses",
        "mode": image_action,
        "output_paths": [str(path) for path in saved_paths],
        "response": data,
    }


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Generate or edit images with the OpenAI Image API or Responses API.")
    parser.add_argument("prompt", nargs="*", help="Prompt text.")
    parser.add_argument("--stdin", action="store_true", help="Read additional prompt text from stdin.")
    parser.add_argument("--api", choices=("image", "responses"), default="image")
    parser.add_argument("--model", default="", help="Override the model. Defaults depend on API.")
    parser.add_argument("--output", default="", help="Output file path. Defaults to var/openai_image_experiments/<timestamp>.png")
    parser.add_argument("--size", default="1024x1024")
    parser.add_argument("--quality", default="high")
    parser.add_argument("--background", default="opaque")
    parser.add_argument("--output-format", default="png", choices=("png", "jpeg", "webp"))
    parser.add_argument("--output-compression", type=int, default=None)
    parser.add_argument("--moderation", default=None, choices=("auto", "low"))
    parser.add_argument("--n", type=int, default=1, help="Image API only.")
    parser.add_argument("--action", default="generate", choices=("generate", "edit", "auto"), help="Responses API image action.")
    parser.add_argument("--partial-images", type=int, default=0, help="Responses API partial image count.")
    parser.add_argument("--image", dest="input_images", action="append", default=[], help="Reference/input image path. For Image API edits.")
    parser.add_argument("--mask", default="", help="Mask image path for Image API edits.")
    parser.add_argument("--input-fidelity", default=None, choices=("low", "high"))
    parser.add_argument("--print-json", action="store_true", help="Print a JSON summary to stdout.")
    return parser


def default_output_path(output_arg: str, output_format: str) -> Path:
    if output_arg.strip():
        return Path(output_arg).expanduser().resolve()
    DEFAULT_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    name = f"image_{uuid.uuid4().hex[:10]}.{output_format}"
    return (DEFAULT_OUTPUT_DIR / name).resolve()


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    prompt = read_prompt(args)
    api_key, base_url = resolve_config()
    if not api_key:
        raise SystemExit("Missing OPENAI_API_KEY in env or .env.")

    output = default_output_path(args.output, args.output_format)
    model = args.model or (DEFAULT_RESPONSES_MODEL if args.api == "responses" else DEFAULT_IMAGE_MODEL)
    input_images = [Path(path).expanduser().resolve() for path in args.input_images]
    for path in input_images:
        if not path.exists():
            raise SystemExit(f"Input image not found: {path}")
    mask = Path(args.mask).expanduser().resolve() if args.mask else None
    if mask is not None and not mask.exists():
        raise SystemExit(f"Mask image not found: {mask}")

    if args.api == "responses":
        if input_images or mask is not None:
            raise SystemExit("This script currently supports text-only Responses API image generation. Use --api image for edits.")
        result = generate_with_responses_api(
            api_key=api_key,
            base_url=base_url,
            prompt=prompt,
            model=model,
            output=output,
            image_action=args.action,
            quality=args.quality,
            background=args.background,
            size=args.size,
            output_format=args.output_format,
            output_compression=args.output_compression,
            moderation=args.moderation,
            partial_images=args.partial_images,
        )
    else:
        result = generate_with_image_api(
            api_key=api_key,
            base_url=base_url,
            prompt=prompt,
            model=model,
            output=output,
            size=args.size,
            quality=args.quality,
            background=args.background,
            output_format=args.output_format,
            output_compression=args.output_compression,
            moderation=args.moderation,
            n=args.n,
            input_images=input_images,
            mask=mask,
            input_fidelity=args.input_fidelity,
        )

    summary = {
        "api": result["api"],
        "mode": result["mode"],
        "model": model,
        "output_paths": result["output_paths"],
    }
    if args.print_json:
        sys.stdout.write(json.dumps(summary, ensure_ascii=False, indent=2))
        sys.stdout.write("\n")
    else:
        for path in result["output_paths"]:
            sys.stdout.write(f"{path}\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
