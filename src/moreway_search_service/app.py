from __future__ import annotations

import logging
from http.server import ThreadingHTTPServer

from .config import Config
from .http import build_server


def create_app(config: Config | None = None) -> ThreadingHTTPServer:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )
    resolved = config or Config.from_env()
    resolved.debug_log_path.parent.mkdir(parents=True, exist_ok=True)
    debug_logger = logging.getLogger("moreway_search_service.debug")
    debug_logger.setLevel(logging.INFO)
    debug_logger.propagate = False
    handler_paths = {
        getattr(handler, "baseFilename", "")
        for handler in debug_logger.handlers
        if hasattr(handler, "baseFilename")
    }
    debug_log_file = str(resolved.debug_log_path)
    if debug_log_file not in handler_paths:
        file_handler = logging.FileHandler(debug_log_file, encoding="utf-8")
        file_handler.setLevel(logging.INFO)
        file_handler.setFormatter(logging.Formatter("%(message)s"))
        debug_logger.addHandler(file_handler)
    return build_server(resolved)
