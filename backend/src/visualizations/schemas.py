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
