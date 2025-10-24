from pydantic import BaseModel
from datetime import datetime
from typing import List


class ReportSection(BaseModel):
    title: str
    content: str


class PrivacyReport(BaseModel):
    overall_score: float
    risk_category: str
    sections: List[ReportSection]
    recommendations_count: int


class ReportExportRequest(BaseModel):
    format: str = "pdf"
    include_recommendations: bool = True
