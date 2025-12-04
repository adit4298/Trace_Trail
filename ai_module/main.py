"""FastAPI application entrypoint for the TraceTrail AI module."""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import router as api_router
from .config import get_settings
from .observability import metrics_endpoint, metrics_middleware
from .utils.logger import get_logger

settings = get_settings()
logger = get_logger(__name__, level=settings.log_level, log_dir=settings.log_dir)

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    debug=settings.debug
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.middleware("http")
async def _metrics_middleware(request, call_next):
    """Wrap the shared metrics middleware so FastAPI can register it."""
    return await metrics_middleware(request, call_next)


@app.get("/")
async def root():
    """Provide basic service metadata."""
    return {
        "service": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment
    }


@app.get("/health")
async def health_check():
    """Lightweight health endpoint for Kubernetes probes."""
    return {"status": "healthy"}


app.include_router(api_router)
app.add_api_route("/metrics", metrics_endpoint, methods=["GET"])

logger.info(
    "TraceTrail AI module initialized (version=%s, env=%s)",
    settings.app_version,
    settings.environment
)

__all__ = ["app"]
