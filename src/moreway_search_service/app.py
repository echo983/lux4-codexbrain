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
    return build_server(resolved)

