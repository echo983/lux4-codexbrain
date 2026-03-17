#!/usr/bin/env python3
from __future__ import annotations

import argparse
import sqlite3
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Clear local SQLite session and message state without touching Neo4j memory.",
    )
    parser.add_argument(
        "--db-path",
        default="var/lux4_daemon.sqlite3",
        help="Path to the local SQLite database. Default: %(default)s",
    )
    parser.add_argument(
        "--yes",
        action="store_true",
        help="Actually perform the delete. Without this flag, the script exits without changing anything.",
    )
    args = parser.parse_args()

    db_path = Path(args.db_path)
    if not db_path.exists():
        raise SystemExit(f"Database not found: {db_path}")

    if not args.yes:
        raise SystemExit(
            "Refusing to clear session state without --yes. "
            "This only deletes local SQLite sessions/messages and does not touch Neo4j."
        )

    conn = sqlite3.connect(db_path)
    try:
        cur = conn.cursor()
        cur.execute("DELETE FROM messages")
        cur.execute("DELETE FROM sessions")
        conn.commit()
        sessions = cur.execute("SELECT count(*) FROM sessions").fetchone()[0]
        messages = cur.execute("SELECT count(*) FROM messages").fetchone()[0]
    finally:
        conn.close()

    print({
        "db": str(db_path),
        "sessions": sessions,
        "messages": messages,
    })
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
