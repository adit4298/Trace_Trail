from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.core.config import settings
from src.core.database import Base, engine
from src.auth.router import router as auth_router
from src.users.router import router as users_router
from src.dashboard.router import router as dashboard_router
from src.analysis.router import router as analysis_router
from src.social_connections.router import router as connections_router
from src.challenges.router import router as challenges_router
from src.visualizations.router import router as visualizations_router
from src.reports.router import router as reports_router
from src.extension.router import router as extension_router

# Create tables
Base.metadata.create_all(bind=engine)

# Initialize app
app = FastAPI(title=settings.APP_NAME, version=settings.APP_VERSION)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(users_router, prefix="/users", tags=["users"])
app.include_router(dashboard_router, prefix="/dashboard", tags=["dashboard"])
app.include_router(analysis_router, prefix="/analysis", tags=["analysis"])
app.include_router(connections_router, prefix="/connections", tags=["connections"])
app.include_router(challenges_router, prefix="/challenges", tags=["challenges"])
app.include_router(visualizations_router, prefix="/visualizations", tags=["visualizations"])
app.include_router(reports_router, prefix="/reports", tags=["reports"])
app.include_router(extension_router, prefix="/extension", tags=["extension"])

# WebSocket endpoint
if settings.EXTENSION_WEBSOCKET_ENABLED:
    from src.extension.websocket import websocket_endpoint
    app.add_api_websocket_route("/ws/extension", websocket_endpoint)
