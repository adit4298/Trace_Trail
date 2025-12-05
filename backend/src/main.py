from __future__ import annotations

from fastapi import FastAPI

from src.app.core.app import create_app

app: FastAPI = create_app()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
