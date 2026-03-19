from __future__ import annotations

import os
import site
import sys
from pathlib import Path


def add_optional_site_dir(venv_root: Path) -> None:
    site_dir = venv_root / "lib" / f"python{sys.version_info.major}.{sys.version_info.minor}" / "site-packages"
    if site_dir.is_dir():
        site.addsitedir(str(site_dir))


def bootstrap_audio_runtime() -> None:
    here = Path(__file__).resolve().parent
    repo_root = here.parent
    candidates = [
        repo_root / "refs" / "nbssUse" / ".venv",
        Path("/root/nbssUse/.venv"),
    ]
    env_hint = os.getenv("LUX4_AUDIO_VENV", "").strip()
    if env_hint:
        candidates.insert(0, Path(env_hint))
    for candidate in candidates:
        add_optional_site_dir(candidate)
