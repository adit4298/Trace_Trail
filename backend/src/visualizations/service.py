from sqlalchemy.orm import Session
from typing import List

from .schemas import PrivacyTrendChart, RiskBreakdownChart, DataPoint
from src.dashboard.repository import DashboardRepository
from src.analysis.repository import AnalysisRepository


class VisualizationService:
    """Service for generating visualization chart data"""

    def __init__(self, db: Session):
        self.dashboard_repo = DashboardRepository(db)
        self.analysis_repo = AnalysisRepository(db)

    async def get_privacy_trend(
        self, user_id: int, days: int = 30
    ) -> PrivacyTrendChart:
        """Generate privacy trend chart for a user over a given number of days"""
        scores = await self.dashboard_repo.get_score_trend(user_id, days)

        data_points = [
            DataPoint(date=score.scan_date, value=score.overall_score)
            for score in scores
        ]

        if len(scores) >= 2:
            recent = sum(s.overall_score for s in scores[:3]) / min(3, len(scores))
            older = sum(s.overall_score for s in scores[-3:]) / min(3, len(scores))
            if recent < older - 5:
                trend = "improving"
            elif recent > older + 5:
                trend = "declining"
            else:
                trend = "stable"
        else:
            trend = "stable"

        return PrivacyTrendChart(data_points=data_points, trend=trend)

    async def get_risk_breakdown(self, user_id: int) -> RiskBreakdownChart:
        """Get latest risk breakdown for a user"""
        analysis = await self.analysis_repo.get_latest_analysis(user_id)

        if not analysis:
            return RiskBreakdownChart(
                social_media=0,
                data_exposure=0,
                privacy_settings=0,
            )

        return RiskBreakdownChart(
            social_media=analysis.social_media_risk,
            data_exposure=analysis.data_exposure_risk,
            privacy_settings=analysis.privacy_settings_risk,
        )
