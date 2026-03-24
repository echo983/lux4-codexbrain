#!/bin/bash

# Web Daemon Management Script for Moreway Planet Explorer
# Handles Vite dev server lifecycle

APP_DIR="/root/lux4-codexbrain/apps/moreway_planet_explorer_web"
PID_FILE="$APP_DIR/vite.pid"
LOG_FILE="$APP_DIR/vite.log"
PORT=18571
HOST="0.0.0.0"

cd "$APP_DIR" || exit 1

case "$1" in
    start)
        if [ -f "$PID_FILE" ] && kill -0 $(cat "$PID_FILE") 2>/dev/null; then
            echo "Vite is already running (PID: $(cat "$PID_FILE"))"
            exit 0
        fi
        echo "Starting Vite on port $PORT..."
        nohup npx vite --port $PORT --host $HOST > "$LOG_FILE" 2>&1 &
        echo $! > "$PID_FILE"
        sleep 2
        if kill -0 $(cat "$PID_FILE") 2>/dev/null; then
            echo "Vite started successfully (PID: $(cat "$PID_FILE"))"
            echo "URL: http://$HOST:$PORT"
        else
            echo "Failed to start Vite. Check $LOG_FILE for details."
            rm -f "$PID_FILE"
            exit 1
        fi
        ;;
    stop)
        if [ -f "$PID_FILE" ]; then
            PID=$(cat "$PID_FILE")
            echo "Stopping Vite (PID: $PID)..."
            kill "$PID" 2>/dev/null || kill -9 "$PID" 2>/dev/null
            rm -f "$PID_FILE"
            echo "Stopped."
        else
            echo "Vite is not running (no PID file found)."
            # Fallback: kill by port or name
            pkill -f "vite.*--port $PORT" && echo "Killed existing Vite process on port $PORT."
        fi
        ;;
    restart)
        "$0" stop
        sleep 1
        "$0" start
        ;;
    status)
        if [ -f "$PID_FILE" ] && kill -0 $(cat "$PID_FILE") 2>/dev/null; then
            echo "Vite is running (PID: $(cat "$PID_FILE"))"
            netstat -tulnp | grep ":$PORT"
        else
            echo "Vite is NOT running."
        fi
        ;;
    logs)
        if [ -f "$LOG_FILE" ]; then
            tail -n 50 "$LOG_FILE"
        else
            echo "Log file not found."
        fi
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs}"
        exit 1
        ;;
esac
