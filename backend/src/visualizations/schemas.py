from pydantic import BaseModel
from typing import List
from datetime import datetime


class DataPoint(BaseModel):
    date: datetime
    value: float


class ChartData(BaseModel):
    labels: List[str]
    values: List[float]


class PrivacyTrendChart(BaseModel):
    data_points: List[DataPoint]
    trend: str


class RiskBreakdownChart(BaseModel):
    social_media: float
    data_exposure: float
    privacy_settings: float


class PlatformDistribution(BaseModel):
    platform: str
    connection_count: int
    risk_score: float
