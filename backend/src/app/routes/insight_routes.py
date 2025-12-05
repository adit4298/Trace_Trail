"""Insight endpoints."""

from __future__ import annotations

from fastapi import APIRouter, Depends

from ..core.dependencies import get_current_user, get_insight_service
from ..models import User
from ..schemas import InsightSchema
from ..services.insight_service import InsightService

router = APIRouter()


@router.get("/insights", response_model=InsightSchema)
def latest_insight(
    current_user: User = Depends(get_current_user),
    service: InsightService = Depends(get_insight_service),
) -> InsightSchema:
    insight = service.latest(current_user.id) or service.generate(current_user.id)
    return insight


@router.post("/insights/regenerate", response_model=InsightSchema)
def regenerate_insight(
    current_user: User = Depends(get_current_user),
    service: InsightService = Depends(get_insight_service),
) -> InsightSchema:
    return service.generate(current_user.id)

