"""
Helper utility functions.
"""

import json
from typing import Any, Dict
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

def load_json(filepath: str) -> Dict[str, Any]:
    """
    Load JSON file.

    Args:
        filepath: Path to JSON file

    Returns:
        Loaded JSON data
    """
    try:
        with open(filepath, 'r') as f:
            data = json.load(f)
        logger.info(f"Loaded JSON from {filepath}")
        return data
    except Exception as e:
        logger.error(f"Error loading JSON from {filepath}: {e}")
        raise

def save_json(data: Any, filepath: str):
    """
    Save data to JSON file.

    Args:
        data: Data to save
        filepath: Output file path
    """
    try:
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
        logger.info(f"Saved JSON to {filepath}")
    except Exception as e:
        logger.error(f"Error saving JSON to {filepath}: {e}")
        raise

def timestamp_to_string(timestamp: datetime) -> str:
    """Convert datetime to ISO format string."""
    return timestamp.isoformat()

def string_to_timestamp(date_string: str) -> datetime:
    """Convert ISO format string to datetime."""
    return datetime.fromisoformat(date_string)

def clip_score(score: float, min_val: float = 0.0, max_val: float = 100.0) -> float:
    """
    Clip score to valid range.

    Args:
        score: Score to clip
        min_val: Minimum value
        max_val: Maximum value

    Returns:
        Clipped score
    """
    return max(min_val, min(max_val, score))