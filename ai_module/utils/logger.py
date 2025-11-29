"""
Logging configuration for AI module.
"""

import logging
import sys
from pathlib import Path
from typing import Optional


def get_logger(
    name: str,
    level: str = "INFO",
    log_dir: Optional[Path] = None,
    filename: str = "ai_module.log"
) -> logging.Logger:
    """
    Configure or retrieve a logger that writes to stdout and an optional file.

    Args:
        name: Logger name.
        level: Logging level string.
        log_dir: Directory to store log files. When None, file logging is skipped.
        filename: Name of the log file when ``log_dir`` is provided.

    Returns:
        A configured ``logging.Logger`` instance.
    """
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, level.upper(), logging.INFO))
    logger.propagate = False

    if logger.handlers:
        return logger

    formatter = logging.Formatter(
        "%(asctime)s | %(levelname)s | %(name)s | %(message)s"
    )

    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    if log_dir:
        log_dir.mkdir(parents=True, exist_ok=True)
        file_handler = logging.FileHandler(log_dir / filename)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)

    return logger