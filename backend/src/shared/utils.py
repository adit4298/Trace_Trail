"""
Utility functions used across the application
"""

from datetime import datetime, timedelta
from typing import Any, Dict
import json
import logging

logger = logging.getLogger(__name__)


def format_datetime(dt: datetime, format_str: str = "%Y-%m-%d %H:%M:%S") -> str:
    """Format datetime object to string"""
    if not dt:
        return None
    return dt.strftime(format_str)


def get_time_ago(dt: datetime) -> str:
    """Get human-readable time difference"""
    if not dt:
        return "Unknown"
    
    diff = datetime.utcnow() - dt
    
    if diff.days > 365:
        return f"{diff.days // 365} year(s) ago"
    elif diff.days > 30:
        return f"{diff.days // 30} month(s) ago"
    elif diff.days > 0:
        return f"{diff.days} day(s) ago"
    elif diff.seconds > 3600:
        return f"{diff.seconds // 3600} hour(s) ago"
    elif diff.seconds > 60:
        return f"{diff.seconds // 60} minute(s) ago"
    else:
        return "Just now"


def safe_json_encode(obj: Any) -> str:
    """Safely encode object to JSON"""
    try:
        return json.dumps(obj, default=str)
    except Exception as e:
        logger.error(f"JSON encoding error: {e}")
        return "{}"


def truncate_string(text: str, max_length: int = 100) -> str:
    """Truncate string to max length"""
    if len(text) <= max_length:
        return text
    return text[:max_length - 3] + "..."


def calculate_percentage(current: float, total: float) -> float:
    """Calculate percentage safely"""
    if total == 0:
        return 0.0
    return round((current / total) * 100, 2)


def validate_email_format(email: str) -> bool:
    """Basic email validation"""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def get_date_range(days: int = 30) -> tuple:
    """Get date range for past N days"""
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)
    return (start_date, end_date)
