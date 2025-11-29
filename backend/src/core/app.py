from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware

from src.analysis.router import router as analysis_router
from src.auth.router import router as auth_router
from src.challenges.router import router as challenges_router
from src.core.config import Settings, get_settings
from src.core.database import create_tables
from src.core.errors import add_exception_handlers
from src.core.logging import configure_logging
from src.core.middleware import (
    LoggingMiddleware,
    RateLimitMiddleware,
    RequestIDMiddleware,
    SecurityHeadersMiddleware,
)
from src.dashboard.router import router as dashboard_router
from src.extension.router import router as extension_router
from src.health.router import router as health_router
from src.reports.router import router as reports_router
from src.social_connections.router import router as connections_router
from src.users.router import router as users_router
from src.visualizations.router import router as visualizations_router


def create_app(custom_settings: Settings | None = None) -> FastAPI:
    """
    Application factory that configures settings, middleware, and routes.
    """

    settings = custom_settings or get_settings()
    configure_logging("DEBUG" if settings.DEBUG else "INFO")

    docs_url = "/docs" if settings.SHOW_DOCS else None
    redoc_url = "/redoc" if settings.SHOW_DOCS else None

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        if settings.DEBUG:
            create_tables()
        yield

    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        docs_url=docs_url,
        redoc_url=redoc_url,
        lifespan=lifespan,
    )
    app.state.settings = settings

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=settings.TRUSTED_HOSTS)
    app.add_middleware(GZipMiddleware)
    app.add_middleware(RequestIDMiddleware, header_name=settings.REQUEST_ID_HEADER)

    if settings.ENABLE_SECURE_HEADERS:
        app.add_middleware(SecurityHeadersMiddleware)

    app.add_middleware(LoggingMiddleware)

    if settings.ENABLE_RATE_LIMITS:
        app.add_middleware(RateLimitMiddleware, max_requests=settings.RATE_LIMIT_MAX_REQUESTS)

    include_routers(app, settings=settings)
    add_exception_handlers(app)
    return app


def include_routers(app: FastAPI, *, settings: Settings) -> None:
    """Register routers with consistent prefixes."""

    app.include_router(health_router, tags=["health"])
    app.include_router(auth_router, prefix="/auth", tags=["auth"])
    app.include_router(users_router, prefix="/users", tags=["users"])
    app.include_router(dashboard_router, prefix="/dashboard", tags=["dashboard"])
    app.include_router(analysis_router, prefix="/analysis", tags=["analysis"])
    app.include_router(connections_router, prefix="/connections", tags=["connections"])
    app.include_router(challenges_router, prefix="/challenges", tags=["challenges"])
    app.include_router(visualizations_router, prefix="/visualizations", tags=["visualizations"])
    app.include_router(reports_router, prefix="/reports", tags=["reports"])

    if settings.EXTENSION_ENABLED:
        app.include_router(extension_router, prefix="/extension", tags=["extension"])
        if settings.EXTENSION_WEBSOCKET_ENABLED:
            from src.extension.websocket import websocket_endpoint

            app.add_api_websocket_route("/ws/extension", websocket_endpoint)

