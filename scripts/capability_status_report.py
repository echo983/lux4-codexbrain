#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import shutil
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from typing import Any
from urllib import error, request


REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_OUTPUT_DIR = REPO_ROOT / "var" / "capability_status"
DEFAULT_LANCEDB_URL = "http://127.0.0.1:24681"
DEFAULT_NBSS_SERVER_ENDPOINT = "http://localhost:8080"
SKILLS_ROOT = Path("/root/.codex/skills")


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


DOTENV = {
    **load_dotenv_file(REPO_ROOT / ".env"),
    **load_dotenv_file(Path.cwd() / ".env"),
}


def read_config_value(*keys: str, default: str = "") -> str:
    for key in keys:
        value = os.getenv(key)
        if value is not None and value.strip():
            return value.strip()
    for key in keys:
        value = DOTENV.get(key)
        if value is not None and value.strip():
            return value.strip()
    return default.strip()


def resolve_lancedb_url() -> str:
    return read_config_value("LUX4_LANCEDB_URL", "LANCEDB_URL", default=DEFAULT_LANCEDB_URL).rstrip("/")


def resolve_nbss_endpoint() -> str:
    return read_config_value("NBSS_SERVER_ENDPOINT", default=DEFAULT_NBSS_SERVER_ENDPOINT).rstrip("/")


def is_http_reachable(url: str, *, timeout: float = 5.0) -> tuple[bool, str]:
    req = request.Request(url, method="GET")
    try:
        with request.urlopen(req, timeout=timeout) as response:
            return True, f"HTTP {response.status}"
    except error.HTTPError as exc:
        return True, f"HTTP {exc.code}"
    except Exception as exc:  # noqa: BLE001
        return False, str(exc)


def fetch_lancedb_tables(url: str) -> tuple[bool, list[str], str]:
    req = request.Request(f"{url.rstrip('/')}/tables", method="GET")
    try:
        with request.urlopen(req, timeout=10) as response:
            payload = json.loads(response.read().decode("utf-8"))
        tables = payload.get("tables", [])
        table_names = [str(item) for item in tables if isinstance(item, str)]
        return True, table_names, f"{len(table_names)} tables"
    except Exception as exc:  # noqa: BLE001
        return False, [], str(exc)


def check_executable(command: str) -> tuple[bool, str]:
    if command == "yt-dlp":
        candidates = [
            read_config_value("LUX4_YTDLP_BIN"),
            str(Path.cwd() / ".venv_ytdlp" / "bin" / "yt-dlp"),
            str(REPO_ROOT / ".venv_ytdlp" / "bin" / "yt-dlp"),
        ]
        for candidate in candidates:
            if candidate and Path(candidate).exists():
                return True, candidate

    resolved = shutil.which(command)
    if resolved:
        return True, resolved
    candidate = Path("/usr/local/bin") / command
    if candidate.exists():
        return True, str(candidate)
    return False, f"{command} not found"


def env_present(*keys: str) -> tuple[bool, str]:
    present = [key for key in keys if read_config_value(key)]
    if present:
        return True, ", ".join(present)
    return False, f"missing any of: {', '.join(keys)}"


@dataclass(frozen=True)
class CheckResult:
    ok: bool
    detail: str


@dataclass(frozen=True)
class CapabilitySpec:
    key: str
    name: str
    kind: str
    category: str
    path: str
    required_checks: tuple[str, ...] = ()
    optional_checks: tuple[str, ...] = ()
    notes: str = ""


def build_check_catalog() -> dict[str, CheckResult]:
    results: dict[str, CheckResult] = {}

    def add(check_id: str, ok: bool, detail: str) -> None:
        results[check_id] = CheckResult(ok=ok, detail=detail)

    add("repo_root", True, str(REPO_ROOT))

    for command in ("codex", "ffmpeg", "yt-dlp", "npm", "npx", "node", "python3"):
        ok, detail = check_executable(command)
        add(f"exe:{command}", ok, detail)

    ok, detail = env_present("LUX4_CF_ACCOUNT_ID", "CF_ACCOUNT_ID")
    add("env:cf_account_id", ok, detail)
    ok, detail = env_present("LUX4_CF_API_TOKEN", "CF_AUTH_TOKEN")
    add("env:cf_api_token", ok, detail)
    add(
        "env:cloudflare_ai",
        results["env:cf_account_id"].ok and results["env:cf_api_token"].ok,
        "Cloudflare account + token present" if results["env:cf_account_id"].ok and results["env:cf_api_token"].ok else "Missing Cloudflare account or token",
    )

    ok, detail = env_present("GOOGLE_MAPS_API_KEY")
    add("env:google_maps_api_key", ok, detail)

    ok, detail = env_present("OPENAI_API_KEY")
    add("env:openai_api_key", ok, detail)

    ok, detail = env_present("LUX4_CF_ACCOUNT_ID")
    add("env:queue_account_id", ok, detail)
    ok, detail = env_present("LUX4_CF_QUEUE_ID")
    add("env:queue_id", ok, detail)
    ok, detail = env_present("LUX4_CF_API_TOKEN")
    add("env:queue_api_token", ok, detail)
    add(
        "env:queue_config",
        results["env:queue_account_id"].ok and results["env:queue_id"].ok and results["env:queue_api_token"].ok,
        "Cloudflare queue config present"
        if results["env:queue_account_id"].ok and results["env:queue_id"].ok and results["env:queue_api_token"].ok
        else "Missing one or more queue config values",
    )

    ok, detail = env_present("NEO4J_URI", "NEO4J_BOLT_URL")
    add("env:neo4j_uri", ok, detail)
    ok, detail = env_present("NEO4J_USERNAME", "NEO4J_USER")
    add("env:neo4j_user", ok, detail)
    ok, detail = env_present("NEO4J_PASSWORD")
    add("env:neo4j_password", ok, detail)
    add(
        "env:neo4j_config",
        results["env:neo4j_uri"].ok and results["env:neo4j_user"].ok and results["env:neo4j_password"].ok,
        "Neo4j config present"
        if results["env:neo4j_uri"].ok and results["env:neo4j_user"].ok and results["env:neo4j_password"].ok
        else "Missing one or more Neo4j config values",
    )

    nbss_url = resolve_nbss_endpoint()
    ok, detail = is_http_reachable(nbss_url)
    add("svc:nbss", ok, f"{nbss_url} -> {detail}")

    lancedb_url = resolve_lancedb_url()
    ok, detail = is_http_reachable(lancedb_url)
    add("svc:lancedb", ok, f"{lancedb_url} -> {detail}")
    tables_ok, table_names, table_detail = fetch_lancedb_tables(lancedb_url) if ok else (False, [], "LanceDB unreachable")
    add("svc:lancedb_tables", tables_ok, table_detail)
    add(
        "table:keep_asset_cards",
        "google_keep_asset_cards_directmd_eval200" in table_names,
        "google_keep_asset_cards_directmd_eval200 present"
        if "google_keep_asset_cards_directmd_eval200" in table_names
        else "google_keep_asset_cards_directmd_eval200 missing",
    )
    add(
        "table:keep_raw_md",
        "google_keep_raw_md" in table_names,
        "google_keep_raw_md present" if "google_keep_raw_md" in table_names else "google_keep_raw_md missing",
    )

    add(
        "ctx:agent_runtime",
        bool(read_config_value("LUX4_AGENT_DB_PATH") and read_config_value("LUX4_AGENT_SESSION_KEY")),
        "agent runtime context present"
        if read_config_value("LUX4_AGENT_DB_PATH") and read_config_value("LUX4_AGENT_SESSION_KEY")
        else "agent runtime context not active",
    )

    return results


CAPABILITIES: tuple[CapabilitySpec, ...] = (
    CapabilitySpec("lux4_daemon", "lux4_daemon", "service", "runtime", "src/lux4_daemon/__main__.py", ("repo_root", "exe:python3", "exe:codex", "env:queue_config")),
    CapabilitySpec("moreway_search_service", "moreway_search_service", "service", "search", "src/moreway_search_service/__main__.py", ("repo_root", "exe:python3", "svc:lancedb", "table:keep_asset_cards", "table:keep_raw_md")),
    CapabilitySpec("agent_enqueue_message", "agent_enqueue_message", "primitive", "runtime", "scripts/agent_enqueue_message.py", ("repo_root", "exe:python3"), ("ctx:agent_runtime",)),
    CapabilitySpec("cron_memory_extraction", "run_cron_memory_extraction", "primitive", "runtime", "scripts/run_cron_memory_extraction.py", ("repo_root", "exe:python3", "exe:codex")),
    CapabilitySpec("cron_memory_consolidation", "run_cron_memory_consolidation", "primitive", "runtime", "scripts/run_cron_memory_consolidation.py", ("repo_root", "exe:python3", "exe:codex")),
    CapabilitySpec("google_places_search", "google_places_search", "primitive", "maps", "scripts/google_places_search.py", ("repo_root", "exe:python3", "env:google_maps_api_key")),
    CapabilitySpec("google_place_details", "google_place_details", "primitive", "maps", "scripts/google_place_details.py", ("repo_root", "exe:python3", "env:google_maps_api_key")),
    CapabilitySpec("google_geocode", "google_geocode", "primitive", "maps", "scripts/google_geocode.py", ("repo_root", "exe:python3", "env:google_maps_api_key")),
    CapabilitySpec("google_compute_routes", "google_compute_routes", "primitive", "maps", "scripts/google_compute_routes.py", ("repo_root", "exe:python3", "env:google_maps_api_key")),
    CapabilitySpec("google_weather", "google_weather", "primitive", "maps", "scripts/google_weather.py", ("repo_root", "exe:python3", "env:google_maps_api_key")),
    CapabilitySpec("cloudflare_bge_m3_embed", "cloudflare_bge_m3_embed", "primitive", "ai", "scripts/cloudflare_bge_m3_embed.py", ("repo_root", "exe:python3", "env:cloudflare_ai")),
    CapabilitySpec("cloudflare_bge_reranker_base", "cloudflare_bge_reranker_base", "primitive", "ai", "scripts/cloudflare_bge_reranker_base.py", ("repo_root", "exe:python3", "env:cloudflare_ai")),
    CapabilitySpec("cloudflare_qwen3_chat", "cloudflare_qwen3_chat", "primitive", "ai", "scripts/cloudflare_qwen3_chat.py", ("repo_root", "exe:python3", "env:cloudflare_ai")),
    CapabilitySpec("openai_image_generate", "openai_image_generate", "primitive", "ai", "scripts/openai_image_generate.py", ("repo_root", "exe:python3", "env:openai_api_key")),
    CapabilitySpec("openai_planet_texture_experiment", "openai_planet_texture_experiment", "primitive", "ai", "scripts/openai_planet_texture_experiment.py", ("repo_root", "exe:python3", "env:openai_api_key")),
    CapabilitySpec("lancedb_upsert", "lancedb_upsert", "primitive", "vector", "scripts/lancedb_upsert.py", ("repo_root", "exe:python3", "svc:lancedb")),
    CapabilitySpec("lancedb_search", "lancedb_search", "primitive", "vector", "scripts/lancedb_search.py", ("repo_root", "exe:python3", "svc:lancedb")),
    CapabilitySpec("lancedb_rerank_search", "lancedb_rerank_search", "primitive", "vector", "scripts/lancedb_rerank_search.py", ("repo_root", "exe:python3", "svc:lancedb", "env:cloudflare_ai")),
    CapabilitySpec("parse_notfinder_llm_snapshot", "parse_notfinder_llm_snapshot", "primitive", "nbss", "scripts/parse_notfinder_llm_snapshot.py", ("repo_root", "exe:python3")),
    CapabilitySpec("parse_pvlog_head", "parse_pvlog_head", "primitive", "nbss", "scripts/parse_pvlog_head.py", ("repo_root", "exe:python3")),
    CapabilitySpec("build_notfinder_snapshot_static_site", "build_notfinder_snapshot_static_site", "primitive", "nbss", "scripts/build_notfinder_snapshot_static_site.py", ("repo_root", "exe:python3", "svc:nbss", "exe:npm", "exe:npx", "exe:node")),
    CapabilitySpec("google_keep_json_to_md", "google_keep_json_to_md", "primitive", "google_keep", "scripts/google_keep_json_to_md.py", ("repo_root", "exe:python3"), ("svc:nbss",)),
    CapabilitySpec("google_keep_deep_asset_card_pipeline", "google_keep_deep_asset_card_pipeline", "primitive", "google_keep", "scripts/google_keep_deep_asset_card_pipeline.py", ("repo_root", "exe:python3", "svc:lancedb", "svc:nbss", "env:cloudflare_ai")),
    CapabilitySpec("google_keep_raw_md_pipeline", "google_keep_raw_md_pipeline", "primitive", "google_keep", "scripts/google_keep_raw_md_pipeline.py", ("repo_root", "exe:python3", "svc:lancedb", "svc:nbss", "env:cloudflare_ai")),
    CapabilitySpec("google_keep_asset_card_search", "google_keep_asset_card_search", "primitive", "google_keep", "scripts/google_keep_asset_card_search.py", ("repo_root", "exe:python3", "svc:lancedb", "table:keep_asset_cards")),
    CapabilitySpec("google_keep_nfs_delivery", "google_keep_nfs_delivery", "primitive", "google_keep", "scripts/google_keep_nfs_delivery.py", ("repo_root", "exe:python3", "svc:lancedb", "table:keep_asset_cards", "svc:nbss", "exe:npm", "exe:npx", "exe:node")),
    CapabilitySpec("youtube_fetch_subtitles_or_audio", "youtube_fetch_subtitles_or_audio", "primitive", "youtube", "scripts/youtube_fetch_subtitles_or_audio.py", ("repo_root", "exe:python3", "exe:yt-dlp")),
    CapabilitySpec("youtube_analyze_video", "youtube_analyze_video", "primitive", "youtube", "scripts/youtube_analyze_video.py", ("repo_root", "exe:python3", "exe:yt-dlp", "exe:ffmpeg", "svc:nbss", "env:cloudflare_ai")),
    CapabilitySpec("nbss_vad_table_builder", "nbss_vad_table_builder", "primitive", "audio", "scripts/nbss_vad_table_builder.py", ("repo_root", "exe:python3", "exe:ffmpeg", "svc:nbss", "env:cloudflare_ai")),
)


def evaluate_capability(spec: CapabilitySpec, checks: dict[str, CheckResult]) -> dict[str, Any]:
    path = REPO_ROOT / spec.path
    path_ok = path.exists()
    required = [{"id": "file:path", "ok": path_ok, "detail": str(path)}]
    for check_id in spec.required_checks:
        result = checks[check_id]
        required.append({"id": check_id, "ok": result.ok, "detail": result.detail})
    optional = []
    for check_id in spec.optional_checks:
        result = checks[check_id]
        optional.append({"id": check_id, "ok": result.ok, "detail": result.detail})

    required_ok = all(item["ok"] for item in required)
    optional_ok = all(item["ok"] for item in optional) if optional else True
    if required_ok and optional_ok:
        status = "available"
    elif required_ok:
        status = "degraded"
    else:
        status = "unavailable"
    return {
        "key": spec.key,
        "name": spec.name,
        "kind": spec.kind,
        "category": spec.category,
        "path": spec.path,
        "status": status,
        "notes": spec.notes,
        "required_checks": required,
        "optional_checks": optional,
    }


def collect_skills() -> list[dict[str, Any]]:
    skills: list[dict[str, Any]] = []
    if not SKILLS_ROOT.exists():
        return skills
    for skill_file in sorted(SKILLS_ROOT.glob("*/SKILL.md")):
        skills.append(
            {
                "name": skill_file.parent.name,
                "path": str(skill_file),
                "status": "available" if skill_file.exists() else "unavailable",
            }
        )
    return skills


def render_markdown(report: dict[str, Any]) -> str:
    lines = [
        "# Capability Status Report",
        "",
        f"- Generated at: `{report['generated_at']}`",
        f"- Repo root: `{report['repo_root']}`",
        f"- Summary: `{report['summary']['available']}` available, `{report['summary']['degraded']}` degraded, `{report['summary']['unavailable']}` unavailable",
        "",
        "## Shared Checks",
        "",
        "| Check | Status | Detail |",
        "|---|---|---|",
    ]
    for check_id, payload in sorted(report["shared_checks"].items()):
        lines.append(f"| `{check_id}` | {'ok' if payload['ok'] else 'fail'} | {payload['detail']} |")

    lines.extend(["", "## Capabilities", "", "| Name | Kind | Category | Status | Path |", "|---|---|---|---|---|"])
    for item in report["capabilities"]:
        lines.append(
            f"| `{item['name']}` | `{item['kind']}` | `{item['category']}` | `{item['status']}` | `{item['path']}` |"
        )

    lines.extend(["", "## Skills", "", "| Skill | Status | Path |", "|---|---|---|"])
    for skill in report["skills"]:
        lines.append(f"| `{skill['name']}` | `{skill['status']}` | `{skill['path']}` |")
    lines.append("")
    return "\n".join(lines)


def build_report() -> dict[str, Any]:
    checks = build_check_catalog()
    capabilities = [evaluate_capability(spec, checks) for spec in CAPABILITIES]
    summary = {
        "available": sum(1 for item in capabilities if item["status"] == "available"),
        "degraded": sum(1 for item in capabilities if item["status"] == "degraded"),
        "unavailable": sum(1 for item in capabilities if item["status"] == "unavailable"),
        "skills": len(collect_skills()),
    }
    return {
        "generated_at": datetime.now(tz=UTC).isoformat(),
        "repo_root": str(REPO_ROOT),
        "shared_checks": {
            check_id: {"ok": result.ok, "detail": result.detail}
            for check_id, result in sorted(checks.items())
        },
        "capabilities": capabilities,
        "skills": collect_skills(),
        "summary": summary,
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Generate an availability status report for repository primitives, services, and skills."
    )
    parser.add_argument("--output-dir", default=str(DEFAULT_OUTPUT_DIR))
    parser.add_argument("--stdout-format", choices=("summary", "json", "markdown"), default="summary")
    args = parser.parse_args()

    report = build_report()
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    json_path = output_dir / "latest.json"
    md_path = output_dir / "latest.md"
    json_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    md_path.write_text(render_markdown(report), encoding="utf-8")

    if args.stdout_format == "json":
        print(json.dumps(report, ensure_ascii=False, indent=2))
    elif args.stdout_format == "markdown":
        print(render_markdown(report))
    else:
        print(
            json.dumps(
                {
                    "generated_at": report["generated_at"],
                    "summary": report["summary"],
                    "json_report": str(json_path),
                    "markdown_report": str(md_path),
                },
                ensure_ascii=False,
                indent=2,
            )
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
