#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import subprocess
from pathlib import Path
from typing import Any


def find_yt_dlp_binary() -> str:
    candidates = [
        os.getenv("LUX4_YTDLP_BIN", "").strip(),
        str(Path.cwd() / ".venv_ytdlp" / "bin" / "yt-dlp"),
        str(Path(__file__).resolve().parent.parent / ".venv_ytdlp" / "bin" / "yt-dlp"),
        "yt-dlp",
    ]
    for candidate in candidates:
        if not candidate:
            continue
        path = Path(candidate)
        if path.exists():
            return str(path)
        if candidate == "yt-dlp":
            return candidate
    return "yt-dlp"


def run_yt_dlp(args: list[str], *, cwd: Path) -> subprocess.CompletedProcess[str]:
    command = [find_yt_dlp_binary(), *args]
    return subprocess.run(command, cwd=cwd, text=True, capture_output=True, check=False)


def extract_video_info(url: str, *, cwd: Path) -> dict[str, Any]:
    completed = run_yt_dlp(["--dump-single-json", "--no-download", url], cwd=cwd)
    if completed.returncode != 0:
        raise RuntimeError(completed.stderr.strip() or completed.stdout.strip() or "yt-dlp metadata extraction failed")
    return json.loads(completed.stdout)


def choose_subtitle_language(info: dict[str, Any]) -> tuple[str | None, str | None]:
    subtitles = info.get("subtitles") or {}
    if subtitles:
        lang = sorted(subtitles.keys())[0]
        return "manual", lang

    automatic = info.get("automatic_captions") or {}
    original_language = str(info.get("language") or "").strip()
    if original_language and original_language in automatic:
        return "automatic", original_language
    if automatic:
        lang = sorted(automatic.keys())[0]
        return "automatic", lang
    return None, None


def detect_downloaded_files(before: set[Path], output_dir: Path) -> list[Path]:
    after = set(output_dir.iterdir())
    return sorted(after - before)


def fetch_subtitles_or_audio(url: str, *, output_dir: Path) -> dict[str, Any]:
    output_dir.mkdir(parents=True, exist_ok=True)
    info = extract_video_info(url, cwd=output_dir)
    mode, language = choose_subtitle_language(info)
    title = str(info.get("title") or "").strip()
    video_id = str(info.get("id") or "").strip()

    if mode and language:
        before = set(output_dir.iterdir())
        args = [
            "--skip-download",
            "--write-sub" if mode == "manual" else "--write-auto-sub",
            "--sub-langs",
            language,
            "--convert-subs",
            "srt",
            "-o",
            "%(title)s [%(id)s].%(ext)s",
            url,
        ]
        completed = run_yt_dlp(args, cwd=output_dir)
        if completed.returncode != 0:
            raise RuntimeError(completed.stderr.strip() or completed.stdout.strip() or "yt-dlp subtitle download failed")
        downloaded = [path for path in detect_downloaded_files(before, output_dir) if path.suffix.lower() in {".srt", ".vtt", ".ass", ".srv3"}]
        if not downloaded:
            raise RuntimeError("yt-dlp reported subtitle success but no subtitle file was created.")
        return {
            "mode": "subtitle",
            "subtitle_kind": mode,
            "subtitle_language": language,
            "video_id": video_id,
            "title": title,
            "path": str(downloaded[0]),
            "info": info,
        }

    before = set(output_dir.iterdir())
    completed = run_yt_dlp(
        [
            "-f",
            "bestaudio",
            "-o",
            "%(title)s [%(id)s].%(ext)s",
            url,
        ],
        cwd=output_dir,
    )
    if completed.returncode != 0:
        raise RuntimeError(completed.stderr.strip() or completed.stdout.strip() or "yt-dlp audio download failed")
    downloaded = [path for path in detect_downloaded_files(before, output_dir) if path.is_file()]
    if not downloaded:
        raise RuntimeError("yt-dlp audio download finished but no file was created.")
    return {
        "mode": "audio",
        "video_id": video_id,
        "title": title,
        "path": str(downloaded[0]),
        "info": info,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Fetch YouTube subtitles if available, otherwise download audio.")
    parser.add_argument("url")
    parser.add_argument("--output-dir", default="var/youtube_fetch")
    parser.add_argument("--output", default="")
    args = parser.parse_args()

    result = fetch_subtitles_or_audio(args.url, output_dir=Path(args.output_dir))
    text = json.dumps(result, ensure_ascii=False, indent=2)
    if args.output:
        Path(args.output).write_text(text, encoding="utf-8")
    print(text)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
