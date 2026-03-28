#!/usr/bin/env bash

set -euo pipefail

REPO_ROOT="/root/lux4-codexbrain"
APP_DIR="$REPO_ROOT/apps/moreway_planet_explorer_web"
HOST="${MOREWAY_PLANET_HOST:-0.0.0.0}"
PORT="${MOREWAY_PLANET_PORT:-18571}"

cd "$APP_DIR"
exec npm run dev -- --host "$HOST" --port "$PORT"
