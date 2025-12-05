"""Expose routers for application factory imports."""

from . import (
    accounts_routes,
    anomalies_routes,
    auth_routes,
    health_routes,
    insight_routes,
    oauth_routes,
    signals_routes,
    sync_routes,
)

__all__ = [
    "accounts_routes",
    "anomalies_routes",
    "auth_routes",
    "health_routes",
    "insight_routes",
    "oauth_routes",
    "signals_routes",
    "sync_routes",
]

