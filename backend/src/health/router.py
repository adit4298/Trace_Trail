from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter, Depends

from src.core.config import Settings, get_settings

router = APIRouter()


@router.get("/health")
async def health_check(settings: Settings = Depends(get_settings)):
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
    }


@router.get("/")
async def root(settings: Settings = Depends(get_settings)):
    return {
        "status": "ok",
        "message": "TraceTrail backend is running",
        "version": settings.APP_VERSION,
        "docs": "/docs" if settings.SHOW_DOCS else None,
    }

