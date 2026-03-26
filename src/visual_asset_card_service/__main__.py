from __future__ import annotations

from .app import create_app


def main() -> None:
    server = create_app()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()

