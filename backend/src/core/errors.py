from __future__ import annotations

import logging
from typing import Any, Dict

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from starlette import status
from starlette.responses import Response
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger(__name__)


def _build_error_payload(
    *,
    request: Request,
    status_code: int,
    message: str,
    extra: Dict[str, Any] | None = None,
) -> Dict[str, Any]:
    payload: Dict[str, Any] = {
        "status": "error",
        "message": message,
        "status_code": status_code,
        "path": request.url.path,
    }
    if extra:
        payload["details"] = extra
    return payload


def add_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> Response:
        logger.warning(
            "HTTP error",
            extra={"path": request.url.path, "status_code": exc.status_code, "detail": exc.detail},
        )
        payload = _build_error_payload(
            request=request,
            status_code=exc.status_code,
            message=exc.detail if isinstance(exc.detail, str) else "HTTP error",
        )
        return JSONResponse(status_code=exc.status_code, content=payload)

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError) -> Response:
        logger.error("Validation error", extra={"errors": exc.errors(), "path": request.url.path})
        payload = _build_error_payload(
            request=request,
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            message="Validation error",
            extra={"errors": exc.errors()},
        )
        return JSONResponse(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, content=payload)

    @app.exception_handler(ValidationError)
    async def pydantic_validation_handler(request: Request, exc: ValidationError) -> Response:
        payload = _build_error_payload(
            request=request,
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            message="Validation error",
            extra={"errors": exc.errors()},
        )
        return JSONResponse(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, content=payload)

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception) -> Response:
        logger.exception("Unhandled server error")
        payload = _build_error_payload(
            request=request,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error",
        )
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=payload)

