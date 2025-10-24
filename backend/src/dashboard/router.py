from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .schemas import DashboardOverview, DashboardStats
from .service import DashboardService
from src.auth.models import User
from src.core.database import get_db
from src.core.security import get_current_user
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get(
    "/overview",
    response_model=DashboardOverview,
    summary="Get dashboard overview",
    description="Get complete dashboard data for current user",
)
async def get_dashboard_overview(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get complete dashboard overview including:
    - Current privacy risk score
    - Recent score history
    - Social media connections
    - Platform-wise exposure data
    """
    service = DashboardService(db)
    return await service.get_dashboard_overview(current_user.id)


@router.get(
    "/stats",
    response_model=DashboardStats,
    summary="Get dashboard statistics",
    description="Get overall system statistics",
)
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get overall dashboard statistics"""
    service = DashboardService(db)
    return await service.get_stats()
