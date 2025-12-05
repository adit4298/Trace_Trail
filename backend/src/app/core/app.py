"""FastAPI application factory for the refactored backend."""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.gzip import GZipMiddleware

from .config import get_settings
from .dependencies import get_oauth_registry
from ..routes import (
    accounts_routes,
    anomalies_routes,
    auth_routes,
    health_routes,
    insight_routes,
    oauth_routes,
    signals_routes,
    sync_routes,
)
from ..tasks.scheduler import SyncScheduler


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""

    settings = get_settings()
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        docs_url="/docs" if settings.SHOW_DOCS else None,
        redoc_url="/redoc" if settings.SHOW_DOCS else None,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(settings.CORS_ORIGINS),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(GZipMiddleware)

    # Routers
    app.include_router(auth_routes.router, prefix="/auth", tags=["auth"])
    app.include_router(accounts_routes.router, prefix="/accounts", tags=["accounts"])
    app.include_router(oauth_routes.router, prefix="/auth", tags=["oauth"])
    app.include_router(sync_routes.router, prefix="/sync", tags=["sync"])
    app.include_router(signals_routes.router, prefix="/dashboard", tags=["signals"])
    app.include_router(anomalies_routes.router, prefix="/dashboard", tags=["anomalies"])
    app.include_router(insight_routes.router, prefix="/dashboard", tags=["insights"])
    app.include_router(health_routes.router, tags=["health"])

    scheduler = SyncScheduler(settings=settings)

    @app.on_event("startup")
    async def startup_event() -> None:  # pylint: disable=unused-variable
        get_oauth_registry()  # Warm cache
        scheduler.start()

    @app.on_event("shutdown")
    async def shutdown_event() -> None:  # pylint: disable=unused-variable
        scheduler.stop()

    return app

