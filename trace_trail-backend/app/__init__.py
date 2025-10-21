"""
TraceTrail Backend Application Package
"""
__version__ = "1.0.0"
__author__ = "TraceTrail Backend Team"

# Import main components for easier access
from .main import app
from .database import Base, engine, get_db