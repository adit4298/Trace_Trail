from sqlalchemy.orm import Session
from .schemas import PrivacyReport, ReportSection
from src.analysis.repository import AnalysisRepository
from src.dashboard.repository import DashboardRepository
from src.users.repository import UserRepository
from datetime import datetime, timedelta
from typing import List
import logging

logger = logging.getLogger(__name__)


class ReportGenerator:
    """Generate privacy reports with detailed analysis"""
    
    def __init__(self, db: Session):
        self.analysis_repo = AnalysisRepository(db)
        self.dashboard_repo = DashboardRepository(db)
        self.user_repo = UserRepository(db)
    
    async def generate_full_report(self, user_id: int) -> PrivacyReport:
        """Generate comprehensive privacy report"""
        analysis = await self.analysis_repo.get_latest_analysis(user_id)
        latest_score = await self.dashboard_repo.get_latest_score(user_id)
        user_stats = await self.user_repo.get_user_stats(user_id)
        
        if not analysis or not latest_score:
            return self._empty_report()
        
        sections = self._generate_all_sections(
            analysis=analysis,
            latest_score=latest_score,
            user_stats=user_stats
        )
        
        return PrivacyReport(
            generated_at=datetime.utcnow(),
            overall_score=analysis.overall_score,
            risk_category=latest_score.risk_category,
            sections=sections,
            recommendations_count=len(analysis.recommendations)
        )
    
    def _generate_all_sections(self, analysis, latest_score, user_stats) -> List[ReportSection]:
        """Generate all report sections"""
        sections = [
            self._executive_summary(analysis),
            self._social_media_analysis(analysis),
            self._data_exposure_analysis(analysis),
            self._privacy_settings_analysis(analysis),
            self._recommendations_section(analysis),
            self._improvement_actions(latest_score)
        ]
        return [s for s in sections if s]
    
    def _executive_summary(self, analysis) -> ReportSection:
        """Executive summary section"""
        if analysis.overall_score >= 80:
            status = "Excellent - Your privacy is well protected"
        elif analysis.overall_score >= 60:
            status = "Good - Minor improvements recommended"
        elif analysis.overall_score >= 40:
            status = "Fair - Significant improvements needed"
        else:
            status = "Poor - Urgent action required"
        
        return ReportSection(
            title="Executive Summary",
            content=f"Your overall privacy risk score is {analysis.overall_score:.1f}/100. {status}. "
                   f"Review the sections below for detailed analysis and recommendations."
        )
    
    def _social_media_analysis(self, analysis) -> ReportSection:
        """Social media risk analysis"""
        score = analysis.social_media_risk
        if score >= 70:
            level = "High Risk"
        elif score >= 40:
            level = "Medium Risk"
        else:
            level = "Low Risk"
        
        return ReportSection(
            title="Social Media Risk Analysis",
            content=f"Social media risk score: {score:.1f}/100 ({level}). "
                   f"Your social media accounts may have privacy settings that expose personal information. "
                   f"Review and tighten privacy settings on all connected platforms."
        )
    
    def _data_exposure_analysis(self, analysis) -> ReportSection:
        """Data exposure analysis"""
        score = analysis.data_exposure_risk
        return ReportSection(
            title="Data Exposure Risk",
            content=f"Data exposure risk score: {score:.1f}/100. "
                   f"This measures how much of your personal data is publicly available. "
                   f"Consider using privacy tools and limiting data sharing."
        )
    
    def _privacy_settings_analysis(self, analysis) -> ReportSection:
        """Privacy settings analysis"""
        score = analysis.privacy_settings_risk
        return ReportSection(
            title="Privacy Settings Assessment",
            content=f"Privacy settings score: {score:.1f}/100. "
                   f"Review your privacy settings on all platforms and services. "
                   f"Enable two-factor authentication where available."
        )
    
    def _recommendations_section(self, analysis) -> ReportSection:
        """Recommendations section"""
        recommendations = analysis.recommendations[:5]
        recommendations_text = "\n".join([f"• {rec}" for rec in recommendations])
        
        return ReportSection(
            title="Recommended Actions",
            content=f"Take the following steps to improve your privacy:\n{recommendations_text}"
        )
    
    def _improvement_actions(self, latest_score) -> ReportSection:
        """Improvement actions section"""
        return ReportSection(
            title="Next Steps",
            content="1. Review recommendations above\n"
                   "2. Update your privacy settings\n"
                   "3. Enable security features\n"
                   "4. Monitor your accounts regularly"
        )
    
    def _empty_report(self) -> PrivacyReport:
        """Return empty report for new users"""
        return PrivacyReport(
            generated_at=datetime.utcnow(),
            overall_score=0,
            risk_category="Not Analyzed",
            sections=[],
            recommendations_count=0
        )
