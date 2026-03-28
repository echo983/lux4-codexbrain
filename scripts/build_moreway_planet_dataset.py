#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_OUTPUT_ROOT = REPO_ROOT / "var" / "moreway_planet_dataset"
DEFAULT_LANCEDB_URI = Path("/opt/lancedb/data")

if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))


def _maybe_extend_sys_path_from_venv(venv_name: str) -> None:
    root = REPO_ROOT / venv_name
    if not root.exists():
        return
    version = f"python{sys.version_info.major}.{sys.version_info.minor}"
    site_packages = root / "lib" / version / "site-packages"
    if site_packages.exists():
        sys.path.insert(0, str(site_packages))


_maybe_extend_sys_path_from_venv(".venv_moreway_planet")

from src.moreway_planet_explorer import DEFAULT_MAX_DEPTH, DEFAULT_MAX_LEAF_POINTS  # noqa: E402
from src.moreway_planet_explorer.build_utils import (  # noqa: E402
    PointRecord,
    build_octree,
    build_surface_density_map,
    compute_bounds,
    estimate_density,
    make_build_id,
    map_points_to_planet_surface,
    normalize_points,
    utc_now_iso,
)
from scripts.bake_moreway_planet_material_textures import bake_for_manifest  # noqa: E402


def require_dependencies() -> tuple[Any, Any, Any, Any]:
    try:
        import lancedb
        import numpy as np
        import pyarrow as pa
        import umap
    except ModuleNotFoundError as exc:
        missing = str(exc).split()[-1].strip("'\"")
        raise SystemExit(
            "Missing dependency for moreway planet dataset build: "
            f"{missing}. Install into .venv_moreway_planet, for example:\n"
            "python3 -m venv .venv_moreway_planet && "
            ". .venv_moreway_planet/bin/activate && "
            "pip install lancedb pyarrow umap-learn numpy"
        ) from exc
    return lancedb, np, pa, umap


def resolve_lancedb_uri() -> Path:
    value = os.getenv("MOREWAY_PLANET_LANCEDB_URI")
    if value and value.strip():
        return Path(value.strip())
    return DEFAULT_LANCEDB_URI


def list_target_tables(db: Any, explicit_tables: list[str] | None = None) -> list[str]:
    if explicit_tables:
        return explicit_tables
    names = list(db.table_names())
    return sorted(name for name in names if not name.endswith("_smoke"))


def source_signature(db: Any, tables: list[str]) -> str:
    parts: list[str] = []
    for table_name in tables:
        table = db.open_table(table_name)
        count = table.count_rows()
        parts.append(f"{table_name}:{count}")
    return "|".join(parts)


def load_rows(db: Any, tables: list[str]) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for table_name in tables:
        table = db.open_table(table_name)
        arrow_table = table.to_arrow()
        chunk_rows = arrow_table.to_pylist()
        for row in chunk_rows:
            row["_table"] = table_name
            rows.append(row)
    return rows


def build_records(rows: list[dict[str, Any]], np: Any, umap: Any) -> list[PointRecord]:
    usable = [row for row in rows if isinstance(row.get("vector"), list) and row.get("vector")]
    if len(usable) < 2:
        raise SystemExit("Need at least 2 LanceDB rows with vectors to build a planet dataset.")

    matrix = np.array([row["vector"] for row in usable], dtype=float)
    neighbors = min(15, max(2, len(usable) - 1))
    reducer = umap.UMAP(n_components=3, metric="cosine", n_neighbors=neighbors, random_state=42)
    embedding = reducer.fit_transform(matrix)
    normalized = normalize_points([tuple(float(v) for v in point) for point in embedding.tolist()])
    densities = estimate_density(normalized)
    surface = map_points_to_planet_surface(normalized, densities)

    records: list[PointRecord] = []
    for row, umap_point, surface_point, density in zip(usable, normalized, surface, densities):
        metadata_raw = row.get("metadata")
        if isinstance(metadata_raw, dict):
            metadata = dict(metadata_raw)
        elif isinstance(metadata_raw, str) and metadata_raw.strip():
            try:
                parsed = json.loads(metadata_raw)
            except json.JSONDecodeError:
                parsed = {}
            metadata = dict(parsed) if isinstance(parsed, dict) else {}
        else:
            metadata = {}
        title = (
            metadata.get("display_title")
            or metadata.get("note_title")
            or metadata.get("title")
            or row.get("title")
            or str(row.get("id") or "untitled")
        )
        text = str(row.get("text") or "")
        payload = {
            "title": title,
            "doc_kind": metadata.get("doc_kind"),
            "source_type": metadata.get("source_type"),
            "card_schema": metadata.get("card_schema"),
            "created_at": metadata.get("created_at"),
            "card_created_at": metadata.get("card_created_at"),
            "namespace_id": metadata.get("namespace_id"),
            "path_in_snapshot": metadata.get("path_in_snapshot"),
            "keep_md_fid": metadata.get("keep_md_fid"),
            "group_image_fids": metadata.get("group_image_fids"),
            "content_completeness": metadata.get("content_completeness"),
            "observation_confidence": metadata.get("observation_confidence"),
            "text_preview": text[:240],
            "umap_x": umap_point[0],
            "umap_y": umap_point[1],
            "umap_z": umap_point[2],
            "density": density,
        }
        records.append(
            PointRecord(
                doc_id=str(row.get("id")),
                table=str(row.get("_table")),
                position=surface_point,
                payload=payload,
            )
        )
    return records


def write_arrow_chunks(chunk_specs: list[dict[str, Any]], build_dir: Path, pa: Any) -> list[dict[str, Any]]:
    written_chunks: list[dict[str, Any]] = []
    for spec in chunk_specs:
        rows: list[dict[str, Any]] = []
        for record in spec["records"]:
            rows.append(
                {
                    "doc_id": record.doc_id,
                    "table": record.table,
                    "surface_x": record.position[0],
                    "surface_y": record.position[1],
                    "surface_z": record.position[2],
                    **record.payload,
                }
            )
        output_path = build_dir / spec["path"]
        output_path.parent.mkdir(parents=True, exist_ok=True)
        table = pa.Table.from_pylist(rows)
        with pa.OSFile(str(output_path), "wb") as sink:
            with pa.ipc.new_file(sink, table.schema) as writer:
                writer.write(table)
        written_chunks.append(
            {
                "chunk_id": spec["chunk_id"],
                "path": spec["path"],
                "point_count": spec["point_count"],
                "bounds": spec["bounds"],
                "center": spec["center"],
                "depth": spec["depth"],
            }
        )
    return written_chunks


def write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Build the Moreway planet exploration dataset from LanceDB.")
    parser.add_argument("--tables", default="", help="Comma-separated LanceDB table names. Default: all non-_smoke tables.")
    parser.add_argument("--output-root", default=str(DEFAULT_OUTPUT_ROOT))
    parser.add_argument("--max-leaf-points", type=int, default=DEFAULT_MAX_LEAF_POINTS)
    parser.add_argument("--max-depth", type=int, default=DEFAULT_MAX_DEPTH)
    parser.add_argument("--force", action="store_true", help="Build even if source signature did not change.")
    args = parser.parse_args()

    lancedb, np, pa, umap = require_dependencies()
    db = lancedb.connect(resolve_lancedb_uri())
    tables = list_target_tables(db, [part.strip() for part in args.tables.split(",") if part.strip()] or None)
    signature = source_signature(db, tables)

    output_root = Path(args.output_root)
    latest_path = output_root / "latest.json"
    if latest_path.exists() and not args.force:
        latest = json.loads(latest_path.read_text(encoding="utf-8"))
        if latest.get("source_signature") == signature:
            result = {
                "status": "skipped",
                "reason": "source signature unchanged",
                "source_tables": tables,
                "source_signature": signature,
                "latest_build_id": latest.get("build_id"),
            }
            print(json.dumps(result, ensure_ascii=False, indent=2))
            return 0

    rows = load_rows(db, tables)
    records = build_records(rows, np, umap)
    octree, chunk_specs = build_octree(records, max_leaf_points=args.max_leaf_points, max_depth=args.max_depth)
    build_id = make_build_id(signature)
    build_dir = output_root / "builds" / build_id
    chunks = write_arrow_chunks(chunk_specs, build_dir, pa)

    all_points = [record.position for record in records]
    manifest = {
        "build_id": build_id,
        "generated_at": utc_now_iso(),
        "source_tables": tables,
        "source_signature": signature,
        "document_count": len(records),
        "bounds": compute_bounds(all_points),
        "planet": {
            "radius": 10.0,
            "shell_thickness": 2.5,
            "surface_map": build_surface_density_map(all_points),
        },
        "octree": octree,
        "chunks": chunks,
    }
    write_json(build_dir / "manifest.json", manifest)
    baked_textures = bake_for_manifest(build_dir / "manifest.json")
    manifest["planet"]["baked_textures"] = baked_textures

    latest = {
        "build_id": build_id,
        "generated_at": manifest["generated_at"],
        "source_tables": tables,
        "source_signature": signature,
        "manifest_path": str((build_dir / "manifest.json").relative_to(output_root)),
        "document_count": len(records),
        "chunk_count": len(chunks),
    }
    write_json(latest_path, latest)
    print(json.dumps({"status": "built", **latest}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
