from __future__ import annotations

import logging

from .config import Config
from .http import build_server
from .publisher import HttpReplyPublisher
from .service import DaemonService
from .session_store import SessionStore


def create_app(config: Config | None = None) -> tuple[DaemonService, object]:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )

    resolved_config = config or Config.from_env()
    store = SessionStore(resolved_config.database_path)
    publisher = HttpReplyPublisher(resolved_config)
    daemon_service = DaemonService(store=store, publisher=publisher)
    daemon_service.start()
    server = build_server(resolved_config.host, resolved_config.port, daemon_service)
    return daemon_service, server
