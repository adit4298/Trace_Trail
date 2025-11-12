"""
API module for TraceTrail AI.
FastAPI routes and endpoints.
"""

from .routes import router
from .schemas import *
from .dependencies import *

__all__ = ["router"]