#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import tempfile
from datetime import UTC, datetime
from pathlib import Path, PurePosixPath
from typing import Any
from urllib import error, request

try:
    from scripts.parse_notfinder_llm_snapshot import NBSS_PREFIX, parse_snapshot_text
except ModuleNotFoundError:
    from parse_notfinder_llm_snapshot import NBSS_PREFIX, parse_snapshot_text


DEFAULT_NBSS_SERVER_ENDPOINT = "http://localhost:8080"


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


def resolve_nbss_server_endpoint() -> str:
    repo_root = Path(__file__).resolve().parent.parent
    for key in ("NBSS_SERVER_ENDPOINT",):
        value = os.getenv(key)
        if value:
            return value.rstrip("/")
    for env_file in (Path.cwd() / ".env", repo_root / ".env"):
        values = load_dotenv_file(env_file)
        value = values.get("NBSS_SERVER_ENDPOINT")
        if value:
            return value.rstrip("/")
    return DEFAULT_NBSS_SERVER_ENDPOINT


def nbss_object_url(fid: str, *, server_endpoint: str) -> str:
    clean = fid[5:] if fid.startswith(NBSS_PREFIX) else fid
    return f"{server_endpoint.rstrip('/')}/nbss/{clean}"


def fetch_snapshot_text(source: str, *, server_endpoint: str) -> str:
    if source.startswith(NBSS_PREFIX):
        req = request.Request(nbss_object_url(source, server_endpoint=server_endpoint), method="GET")
        try:
            with request.urlopen(req, timeout=60) as response:
                return response.read().decode("utf-8")
        except error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"NBSS fetch failed with HTTP {exc.code}: {detail}") from exc
        except error.URLError as exc:
            raise RuntimeError(f"NBSS fetch failed: {exc}") from exc
    path = Path(source)
    if not path.exists():
        raise RuntimeError(f"Snapshot source not found: {source}")
    return path.read_text(encoding="utf-8")


def nbss_put_bytes(data: bytes, *, server_endpoint: str, content_type: str) -> dict[str, Any]:
    req = request.Request(
        f"{server_endpoint.rstrip('/')}/nbss",
        data=data,
        method="PUT",
        headers={"Content-Type": content_type},
    )
    try:
        with request.urlopen(req, timeout=120) as response:
            return json.loads(response.read().decode("utf-8"))
    except error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"NBSS PUT failed with HTTP {exc.code}: {detail}") from exc
    except error.URLError as exc:
        raise RuntimeError(f"NBSS PUT failed: {exc}") from exc


def normalize_data_fid(ref: str) -> str:
    if ref.startswith("D:"):
        return ref.split(":", 2)[1]
    return ref


def iso_from_ms(value: int | str | None) -> str:
    try:
        if value is None:
            return ""
        return datetime.fromtimestamp(int(value) / 1000, tz=UTC).isoformat()
    except (TypeError, ValueError, OSError):
        return ""


def latest_records_by_path(snapshot_source: str, *, server_endpoint: str) -> tuple[dict[str, Any], dict[str, dict[str, Any]]]:
    text = fetch_snapshot_text(snapshot_source, server_endpoint=server_endpoint)
    parsed = parse_snapshot_text(text)
    path_map = parsed["path_map"]
    latest: dict[str, dict[str, Any]] = {}
    for record in parsed["records"]:
        path = path_map.get(record["pid"], "")
        if not isinstance(path, str) or not path:
            continue
        if record.get("size", 0) <= 0:
            continue
        prev = latest.get(path)
        if prev is None or int(record["ts"]) > int(prev["ts"]):
            latest[path] = record
    return parsed, latest


def build_snapshot_manifest(snapshot_source: str, *, server_endpoint: str) -> dict[str, Any]:
    parsed, latest = latest_records_by_path(snapshot_source, server_endpoint=server_endpoint)
    folders: dict[str, dict[str, Any]] = {
        "/": {
            "id": "/",
            "name": parsed.get("internal_name") or "snapshot",
            "parentId": None,
            "path": "/",
            "isDir": True,
        }
    }
    files_by_folder: dict[str, list[dict[str, Any]]] = {"/": []}

    for path in sorted(latest.keys()):
        record = latest[path]
        parts = PurePosixPath(path).parts
        parent_id = "/"
        built_parts: list[str] = []
        for folder_name in parts[:-1]:
            built_parts.append(folder_name)
            folder_id = "/" + "/".join(built_parts)
            if folder_id not in folders:
                folders[folder_id] = {
                    "id": folder_id,
                    "name": folder_name,
                    "parentId": parent_id,
                    "path": folder_id,
                    "isDir": True,
                }
                files_by_folder.setdefault(parent_id, []).append(
                    {
                        "id": folder_id,
                        "name": folder_name,
                        "isDir": True,
                        "path": folder_id,
                        "modDate": "",
                    }
                )
                files_by_folder.setdefault(folder_id, [])
            parent_id = folder_id

        file_name = parts[-1]
        base_ref = record.get("base_ref") or record.get("fid") or ""
        fid = normalize_data_fid(str(base_ref))
        files_by_folder.setdefault(parent_id, []).append(
            {
                "id": f"file:{path}",
                "name": file_name,
                "isDir": False,
                "path": path,
                "fid": f"{NBSS_PREFIX}{fid}",
                "size": int(record.get("size", 0) or 0),
                "modDate": iso_from_ms(record.get("ts")),
                "downloadUrl": nbss_object_url(fid, server_endpoint=server_endpoint),
            }
        )

    for entries in files_by_folder.values():
        entries.sort(key=lambda item: (not item["isDir"], item["name"].lower()))

    return {
        "formatName": "notFinder LLM Snapshot Static Site",
        "snapshotSource": snapshot_source,
        "headFid": parsed.get("head_fid", ""),
        "internalName": parsed.get("internal_name", ""),
        "exportedAtMs": parsed.get("exported_at_ms", 0),
        "recordCount": parsed.get("record_count", 0),
        "pathCount": parsed.get("path_count", 0),
        "nbssServerEndpoint": server_endpoint,
        "rootFolderId": "/",
        "folders": folders,
        "filesByFolder": files_by_folder,
    }


def build_frontend_bundle() -> str:
    with tempfile.TemporaryDirectory(prefix="lux4-notfinder-site-") as tmpdir:
        root = Path(tmpdir)
        package_json = {
            "name": "lux4-notfinder-snapshot-site",
            "private": True,
            "version": "0.0.0",
            "dependencies": {
                "react": "18",
                "react-dom": "18",
                "chonky": "2.1.0",
                "chonky-icon-fontawesome": "2.1.0",
                "path-browserify": "^1.0.1",
            },
        }
        (root / "package.json").write_text(json.dumps(package_json, indent=2), encoding="utf-8")
        (root / "entry.jsx").write_text(
            """import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { FullFileBrowser, ChonkyActions, setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';

setChonkyDefaults({ iconComponent: ChonkyIconFA });

const manifest = window.__SNAPSHOT_MANIFEST__;

const formatBytes = (size) => {
  if (!size) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = size;
  let idx = 0;
  while (value >= 1024 && idx < units.length - 1) {
    value /= 1024;
    idx += 1;
  }
  return `${value.toFixed(value >= 10 || idx === 0 ? 0 : 1)} ${units[idx]}`;
};

function buildFolderChain(currentFolderId) {
  const chain = [];
  let cursor = currentFolderId;
  while (cursor) {
    const folder = manifest.folders[cursor];
    if (!folder) break;
    chain.unshift({ id: folder.id, name: folder.name, isDir: true });
    cursor = folder.parentId;
  }
  return chain;
}

function App() {
  const [currentFolderId, setCurrentFolderId] = useState(manifest.rootFolderId);

  const folderChain = useMemo(() => buildFolderChain(currentFolderId), [currentFolderId]);
  const files = useMemo(
    () =>
      (manifest.filesByFolder[currentFolderId] || []).map((entry) => ({
        id: entry.id,
        name: entry.name,
        isDir: !!entry.isDir,
        path: entry.path,
        openable: true,
        size: entry.size,
        modDate: entry.modDate ? new Date(entry.modDate) : undefined,
        fid: entry.fid,
        downloadUrl: entry.downloadUrl,
      })),
    [currentFolderId]
  );

  const onFileAction = (data) => {
    if (data.id !== ChonkyActions.OpenFiles.id) return;
    const target = data.payload?.targetFile || data.state?.selectedFiles?.[0];
    if (!target) return;
    if (target.isDir) {
      setCurrentFolderId(target.id);
      return;
    }
    window.open(target.downloadUrl, '_blank', 'noopener,noreferrer');
  };

  return React.createElement(
    'div',
    { className: 'app' },
    React.createElement(
      'div',
      { className: 'hero' },
      React.createElement('h1', null, manifest.internalName || 'notFinder Snapshot Browser'),
      React.createElement(
        'p',
        null,
        `${manifest.pathCount} paths · ${manifest.recordCount} records · source ${manifest.snapshotSource}`
      )
    ),
    React.createElement(
      'div',
      { className: 'main main-single' },
      React.createElement(
        'div',
        { className: 'browser-panel browser-shell' },
        React.createElement(
          'div',
          { className: 'chonky-wrap' },
          React.createElement(FullFileBrowser, { files, folderChain, onFileAction })
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'footer' },
      `NBSS server endpoint: ${manifest.nbssServerEndpoint}`
    )
  );
}

createRoot(document.getElementById('root')).render(React.createElement(App));
""",
            encoding="utf-8",
        )
        npm_cmd = shutil.which("npm")
        npx_cmd = shutil.which("npx")
        if not npm_cmd or not npx_cmd:
            raise RuntimeError("This primitive requires npm and npx to be available.")
        subprocess.run(
            [npm_cmd, "install", "--legacy-peer-deps"],
            cwd=root,
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        subprocess.run(
            [
                npx_cmd,
                "esbuild",
                "entry.jsx",
                "--bundle",
                "--format=iife",
                "--platform=browser",
                "--target=es2020",
                "--alias:path=path-browserify",
                "--outfile=bundle.js",
                "--minify",
            ],
            cwd=root,
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        return (root / "bundle.js").read_text(encoding="utf-8")


def render_static_site_html(manifest: dict[str, Any], *, bundle_js: str) -> str:
    manifest_json = json.dumps(manifest, ensure_ascii=False)
    title = manifest.get("internalName") or "notFinder Snapshot"
    return f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title} - Snapshot Browser</title>
    <style>
      :root {{
        --bg: #f5f1e8;
        --panel: #fffdf8;
        --ink: #1f1b16;
        --muted: #6b6256;
        --line: #ded4c6;
        --accent: #aa5c2b;
      }}
      * {{ box-sizing: border-box; }}
      html, body, #root {{ height: 100%; margin: 0; }}
      body {{
        font-family: "IBM Plex Sans", "Noto Sans", sans-serif;
        background:
          radial-gradient(circle at top left, rgba(170,92,43,.12), transparent 24%),
          linear-gradient(180deg, #f7f3ec 0%, #efe7da 100%);
        color: var(--ink);
      }}
      .app {{
        display: grid;
        grid-template-rows: auto 1fr auto;
        height: 100%;
      }}
      .hero {{
        padding: 18px 24px 14px;
        border-bottom: 1px solid var(--line);
        background: rgba(255,253,248,.88);
        backdrop-filter: blur(8px);
      }}
      .hero h1 {{
        margin: 0;
        font-family: "Space Grotesk", "IBM Plex Sans", sans-serif;
        font-size: 22px;
      }}
      .hero p {{
        margin: 6px 0 0;
        color: var(--muted);
        font-size: 13px;
      }}
      .main {{
        display: grid;
        gap: 14px;
        padding: 14px;
        min-height: 0;
      }}
      .main-single {{
        grid-template-columns: minmax(540px, 1fr);
      }}
      .browser-panel {{
        min-height: 0;
        border: 1px solid var(--line);
        border-radius: 18px;
        background: var(--panel);
        box-shadow: 0 14px 40px rgba(63, 48, 29, 0.08);
        overflow: hidden;
      }}
      .footer {{
        padding: 10px 18px;
        font-size: 12px;
        color: var(--muted);
        border-top: 1px solid var(--line);
        background: rgba(255,253,248,.75);
      }}
      .browser-shell {{
        height: 100%;
        display: flex;
        flex-direction: column;
      }}
      .chonky-wrap {{
        flex: 1 1 auto;
        min-height: 0;
      }}
      @media (max-width: 960px) {{
        .main {{
          grid-template-columns: 1fr;
        }}
      }}
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script>
      window.__SNAPSHOT_MANIFEST__ = {manifest_json};
    </script>
    <script>
{bundle_js}
    </script>
  </body>
</html>
"""


def build_snapshot_static_site(snapshot_source: str, *, server_endpoint: str) -> dict[str, Any]:
    manifest = build_snapshot_manifest(snapshot_source, server_endpoint=server_endpoint)
    bundle_js = build_frontend_bundle()
    html = render_static_site_html(manifest, bundle_js=bundle_js)
    put_result = nbss_put_bytes(
        html.encode("utf-8"),
        server_endpoint=server_endpoint,
        content_type="text/html; charset=utf-8",
    )
    site_fid = put_result["fid"]
    return {
        "snapshot_source": snapshot_source,
        "site_fid": f"{NBSS_PREFIX}{site_fid}",
        "site_url": nbss_object_url(site_fid, server_endpoint=server_endpoint),
        "nbss_server_endpoint": server_endpoint,
        "path_count": manifest["pathCount"],
        "record_count": manifest["recordCount"],
        "internal_name": manifest["internalName"],
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Build a browser-friendly static site for a notFinder LLM Snapshot and store it in NBSS."
    )
    parser.add_argument("snapshot_source", help="Local snapshot file path or NBSS:0x... source.")
    parser.add_argument("--server-endpoint", default="", help="Override NBSS server endpoint.")
    args = parser.parse_args()

    server_endpoint = args.server_endpoint.rstrip("/") if args.server_endpoint else resolve_nbss_server_endpoint()
    result = build_snapshot_static_site(args.snapshot_source, server_endpoint=server_endpoint)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
