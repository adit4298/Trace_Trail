from __future__ import annotations

import logging
from typing import Literal

LOG_FORMAT = "%(levelname)s [%(name)s] %(message)s"


def configure_logging(level: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = "INFO") -> None:
    """Configure root logging for the backend application."""
    logging.basicConfig(format=LOG_FORMAT, level=getattr(logging, level))

