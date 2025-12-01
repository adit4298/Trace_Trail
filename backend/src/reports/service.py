from sqlalchemy.orm import Session
from datetime import datetime
from typing import List

from .schemas import PrivacyReport, ReportSection
from src.analysis.repository import AnalysisRepository
from src.dashboard.repository import DashboardRepository


class ReportService:
    """Service to generate privacy reports for users"""

    def __init__(self, db: Session):
        self.analysis_repo = AnalysisRepository(db)
        self.dashboard_repo = DashboardRepository(db)

    async def generate_privacy_report(self, user_id: int) -> PrivacyReport:
        """Generate a privacy report for a given user"""
        analysis = await self.analysis_repo.get_latest_analysis(user_id)
        latest_score = await self.dashboard_repo.get_latest_score(user_id)

        if not analysis or not latest_score:
            return PrivacyReport(
                overall_score=0,
                risk_category="Unknown",
                sections=[],
                recommendations_count=0,
            )

        sections = self._build_report_sections(analysis)

        return PrivacyReport(
            overall_score=analysis.overall_score,
            risk_category=latest_score.risk_category,
            sections=sections,
            recommendations_count=len(analysis.recommendations),
        )

    def _build_report_sections(self, analysis) -> List[ReportSection]:
        """Build structured report sections based on analysis"""
        sections = [
            ReportSection(
                title="Executive Summary",
                content=f"Your overall privacy risk score is {analysis.overall_score:.1f}"
            ),
            ReportSection(
                title="Social Media Risk",
                content=f"Social media risk: {analysis.social_media_risk:.1f}/100"
            ),
            ReportSection(
                title="Data Exposure",
                content=f"Data exposure risk: {analysis.data_exposure_risk:.1f}/100"
            ),
            ReportSection(
                title="Privacy Settings",
                content=f"Privacy settings risk: {analysis.privacy_settings_risk:.1f}/100"
            ),
        ]
        return sections
