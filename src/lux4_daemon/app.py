from __future__ import annotations

import logging
from http.server import ThreadingHTTPServer

from .codex_exec import CodexExecClient
from .config import Config
from .http import build_server
from .publisher import CloudflareQueueReplyPublisher
from .responder import CodexResponder
from .service import DaemonService
from .session_store import SessionStore


def create_app(config: Config | None = None) -> tuple[DaemonService, ThreadingHTTPServer]:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )

    resolved_config = config or Config.from_env()
    resolved_config.validate_for_startup()
    store = SessionStore(resolved_config.database_path)
    publisher = CloudflareQueueReplyPublisher(resolved_config)
    responder = CodexResponder(store=store, client=CodexExecClient(resolved_config), config=resolved_config)
    daemon_service = DaemonService(store=store, publisher=publisher, responder=responder)
    daemon_service.start()
    server = build_server(resolved_config.host, resolved_config.port, daemon_service)
    return daemon_service, server
