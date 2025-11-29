"""
Main application entry point for TraceTrail AI Module.
FastAPI application with ML models exposed as REST API.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging

from ai_module.api.routes import router
from ai_module.config.settings import get_settings
from ai_module.observability import metrics_endpoint, metrics_middleware
from ai_module.utils.logger import get_logger

# Initialize settings and logger
settings = get_settings()
logger = get_logger(__name__, level=settings.log_level, log_dir=settings.log_dir)

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
app.add_api_route("/metrics", metrics_endpoint, methods=["GET"], tags=["Observability"])
app.middleware("http")(metrics_middleware)

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
