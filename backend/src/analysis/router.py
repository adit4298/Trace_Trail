from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from .schemas import AnalysisRequest, AnalysisResponse, AnalysisSummary
from .service import AnalysisService
from src.auth.models import User
from src.core.database import get_db
from src.core.security import get_current_user
from typing import List
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/analysis", tags=["Analysis"])


@router.post(
    "/run",
    response_model=AnalysisResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Run privacy analysis",
    description="Run comprehensive privacy analysis for current user"
)
async def run_analysis(
    analysis_request: AnalysisRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Run privacy analysis.
    
    Analyzes:
    - Social media risk
    - Data exposure risk
    - Privacy settings risk
    
    Returns detailed analysis and recommendations.
    """
    service = AnalysisService(db)
    return await service.run_privacy_analysis(current_user.id, analysis_request)


@router.get(
    "/summary",
    response_model=AnalysisSummary,
    summary="Get analysis summary",
    description="Get quick analysis summary for current user"
)
async def get_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get quick analysis summary.
    
    Returns:
    - Current privacy score
    - Risk category
    - Key risks
    - Urgent recommendations
    """
    service = AnalysisService(db)
    return await service.get_analysis_summary(current_user.id)


@router.get(
    "/history",
    response_model=List[AnalysisResponse],
    summary="Get analysis history",
    description="Get user's past analyses"
)
async def get_history(
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get analysis history.
    
    Returns past analyses for the user.
    """
    service = AnalysisService(db)
    return await service.get_analysis_history(current_user.id)
