"""
Main application entry point for TraceTrail AI Module.
FastAPI application with ML models exposed as REST API.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging

from api.routes import router
from config.settings import get_settings
from utils.logger import get_logger

# Initialize settings and logger
settings = get_settings()
logger = get_logger(__name__, level=settings.log_level)

# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="AI/ML module for privacy risk scoring and recommendations",
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(router)

@app.on_event("startup")
async def startup_event():
    """Run on application startup."""
    logger.info(f"Starting {settings.app_name} v{settings.app_version}")
    logger.info(f"Environment: {settings.environment}")
    logger.info(f"API available at http://{settings.ai_api_host}:{settings.ai_api_port}")

@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown."""
    logger.info("Shutting down AI module")

@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "service": settings.app_name,
        "version": settings.app_version,
        "status": "running",
        "docs": f"http://{settings.ai_api_host}:{settings.ai_api_port}/docs"
    }

if __name__ == "__main__":
    # Run the application
    uvicorn.run(
        "main:app",
        host=settings.ai_api_host,
        port=settings.ai_api_port,
        reload=settings.ai_api_reload,
        log_level=settings.log_level.lower()
    )
