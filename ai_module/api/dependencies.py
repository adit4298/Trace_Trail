"""
FastAPI dependency factories shared across routers.
"""

from functools import lru_cache

from fastapi import Depends, Header, HTTPException

from ..config import Settings, get_settings
from ..services import AIPipeline
from ..utils.logger import get_logger

logger = get_logger(__name__)


@lru_cache(maxsize=1)
def _pipeline_factory(settings: Settings) -> AIPipeline:
    return AIPipeline(settings=settings)


def get_pipeline(settings: Settings = Depends(get_settings)) -> AIPipeline:
    """Provide a singleton pipeline instance to route handlers."""
    return _pipeline_factory(settings)


async def verify_api_key(x_api_key: str | None = Header(default=None)) -> None:
    """
    Verify API key for authentication. When no API key is configured the check
    is skipped to simplify local development.
    """
    settings = get_settings()
    if not settings.api_key:
        return

    if x_api_key != settings.api_key:
        logger.warning("Invalid API key attempt")
        raise HTTPException(status_code=401, detail="Invalid or missing API key")


async def rate_limit_check() -> None:
    """
    Placeholder rate-limit dependency. Hook into Redis or another shared store
    when you are ready to enforce organization wide limits.
    """
    return None