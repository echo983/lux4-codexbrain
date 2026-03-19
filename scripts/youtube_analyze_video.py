#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import subprocess
from pathlib import Path
from typing import Any

import requests

try:
    from scripts.build_notfinder_snapshot_static_site import nbss_put_bytes, resolve_nbss_server_endpoint
    from scripts.cloudflare_qwen3_chat import chat, resolve_config as resolve_qwen_config
    from scripts.youtube_fetch_subtitles_or_audio import fetch_subtitles_or_audio
except ModuleNotFoundError:
    from build_notfinder_snapshot_static_site import nbss_put_bytes, resolve_nbss_server_endpoint
    from cloudflare_qwen3_chat import chat, resolve_config as resolve_qwen_config
    from youtube_fetch_subtitles_or_audio import fetch_subtitles_or_audio


ANALYSIS_SYSTEM = (
    "You analyze YouTube video content for a Chinese-speaking user. "
    "Be concrete. Explain what the video mainly argues, its structure, important claims, tone, and any obvious uncertainty or ASR/subtitle issues. "
    "Return Markdown."
)


def sanitize_slug(value: str) -> str:
    cleaned = re.sub(r"[\\/:*?\"<>|]+", "_", value).strip()
    return cleaned or "video"


def load_vad_table(fid: str, *, server_endpoint: str) -> dict[str, Any]:
    clean = fid[2:] if fid.startswith("0x") else fid
    response = requests.get(f"{server_endpoint.rstrip('/')}/nbss/0x{clean}", timeout=120)
    response.raise_for_status()
    return response.json()


def build_transcript_from_vad_table(vad_table: dict[str, Any]) -> str:
    lines: list[str] = []
    for segment in vad_table.get("segments", []):
        start = segment.get("start")
        end = segment.get("end")
        text = str(segment.get("text") or "").strip()
        if not text:
            continue
        if isinstance(start, (int, float)) and isinstance(end, (int, float)):
            lines.append(f"[{start:.3f}-{end:.3f}] {text}")
        else:
            lines.append(text)
    return "\n".join(lines).strip() + "\n"


def analyze_text_content(source_text: str, *, source_label: str) -> str:
    account_id, token, model = resolve_qwen_config()
    prompt = (
        f"Source type: {source_label}\n"
        "Task: Analyze what this YouTube video is about.\n\n"
        "Output structure:\n"
        "1. 标题判断\n"
        "2. 核心观点\n"
        "3. 内容结构\n"
        "4. 关键事实或论点\n"
        "5. 说话风格与立场\n"
        "6. 可能的不确定点或转写问题\n"
        "7. 一段简短总结\n\n"
        "Source text:\n"
        f"{source_text[:32000]}"
    )
    return chat(prompt, system=ANALYSIS_SYSTEM, account_id=account_id, token=token, model=model)


def analyze_youtube_video(url: str, *, output_dir: Path) -> dict[str, Any]:
    output_dir.mkdir(parents=True, exist_ok=True)
    fetched = fetch_subtitles_or_audio(url, output_dir=output_dir / "fetch")
    title = fetched.get("title") or fetched.get("video_id") or "video"
    slug = sanitize_slug(str(fetched.get("video_id") or title))
    server_endpoint = resolve_nbss_server_endpoint()
    transcript_text = ""
    source_label = ""
    vad_table_fid = ""

    if fetched["mode"] == "subtitle":
        subtitle_path = Path(fetched["path"])
        transcript_text = subtitle_path.read_text(encoding="utf-8", errors="replace")
        source_label = f"{fetched['subtitle_kind']} subtitle ({fetched['subtitle_language']})"
    else:
        audio_path = Path(fetched["path"])
        audio_put = nbss_put_bytes(audio_path.read_bytes(), server_endpoint=server_endpoint, content_type="audio/webm")
        command = [
            "python3",
            "scripts/nbss_vad_table_builder.py",
            audio_put["fid"],
            "--original-path",
            audio_path.name,
        ]
        completed = subprocess.run(command, text=True, capture_output=True, check=False)
        if completed.returncode != 0:
            raise RuntimeError(completed.stderr.strip() or completed.stdout.strip() or "nbss_vad_table_builder failed")
        result = json.loads(completed.stdout.strip())
        vad_table_fid = result["vad_table_fid"]
        vad_table = load_vad_table(vad_table_fid, server_endpoint=server_endpoint)
        transcript_text = build_transcript_from_vad_table(vad_table)
        source_label = f"audio transcription via AudioVADTable ({vad_table_fid})"

    analysis_md = analyze_text_content(transcript_text, source_label=source_label)
    transcript_path = output_dir / f"{slug}.transcript.txt"
    analysis_path = output_dir / f"{slug}.analysis.md"
    meta_path = output_dir / f"{slug}.json"
    transcript_path.write_text(transcript_text, encoding="utf-8")
    analysis_path.write_text(analysis_md, encoding="utf-8")
    result = {
        "url": url,
        "title": title,
        "video_id": fetched.get("video_id"),
        "mode": fetched["mode"],
        "source_label": source_label,
        "fetched_path": fetched["path"],
        "transcript_path": str(transcript_path),
        "analysis_path": str(analysis_path),
        "vad_table_fid": vad_table_fid,
    }
    meta_path.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    result["meta_path"] = str(meta_path)
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description="Analyze what a YouTube video talks about.")
    parser.add_argument("url")
    parser.add_argument("--output-dir", default="var/youtube_analysis")
    args = parser.parse_args()
    result = analyze_youtube_video(args.url, output_dir=Path(args.output_dir))
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
