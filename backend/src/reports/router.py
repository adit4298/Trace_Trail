from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .schemas import PrivacyReport
from .service import ReportService
from src.auth.models import User
from src.core.database import get_db
from src.core.security import get_current_user

router = APIRouter(prefix="/api/reports", tags=["Reports"])


@router.get("/privacy", response_model=PrivacyReport)
async def generate_privacy_report(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Generate a privacy report for the current user"""
    service = ReportService(db)
    return await service.generate_privacy_report(current_user.id)
