from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .schemas import PrivacyTrendChart, RiskBreakdownChart
from .service import VisualizationService
from src.auth.models import User
from src.core.database import get_db
from src.core.security import get_current_user

router = APIRouter(prefix="/api/visualizations", tags=["Visualizations"])


@router.get("/privacy-trend", response_model=PrivacyTrendChart)
async def get_privacy_trend(
    days: int = 30,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get privacy trend chart for current user"""
    service = VisualizationService(db)
    return await service.get_privacy_trend(current_user.id, days)


@router.get("/risk-breakdown", response_model=RiskBreakdownChart)
async def get_risk_breakdown(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get latest risk breakdown for current user"""
    service = VisualizationService(db)
    return await service.get_risk_breakdown(current_user.id)
