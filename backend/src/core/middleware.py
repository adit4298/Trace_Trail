from __future__ import annotations

import time
import uuid
from collections import defaultdict
from typing import Dict, Tuple

import logging
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger(__name__)


class LoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware to log all incoming requests and responses.
    Logs request method, path, processing time, and status code.
    """

    async def dispatch(self, request: Request, call_next):
        start_time = time.time()

        request_id = getattr(request.state, "request_id", "unknown")
        logger.info(
            "Incoming request",
            extra={
                "method": request.method,
                "path": request.url.path,
                "request_id": request_id,
            },
        )

        response = await call_next(request)

        process_time = time.time() - start_time
        logger.info(
            "Request completed",
            extra={
                "method": request.method,
                "path": request.url.path,
                "status": response.status_code,
                "elapsed": round(process_time, 3),
                "request_id": request_id,
            },
        )

        response.headers["X-Process-Time"] = f"{process_time:.3f}"
        return response


class RequestIDMiddleware(BaseHTTPMiddleware):
    """Attach a request id to every incoming request and response."""

    def __init__(self, app, header_name: str = "X-Request-ID"):
        super().__init__(app)
        self.header_name = header_name

    async def dispatch(self, request: Request, call_next):
        request_id = request.headers.get(self.header_name) or str(uuid.uuid4())
        request.state.request_id = request_id

        response = await call_next(request)
        response.headers[self.header_name] = request_id
        return response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Adds a minimal set of secure headers to every response."""

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("X-Frame-Options", "DENY")
        response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
        response.headers.setdefault("Strict-Transport-Security", "max-age=63072000; includeSubDomains")
        return response


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Simple sliding-window rate limiting middleware (in-memory).
    In production, replace with Redis-based rate limiting.
    """

    def __init__(self, app, max_requests: int = 100, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.counter: Dict[str, Tuple[int, float]] = defaultdict(lambda: (0, time.time()))

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host if request.client else "anonymous"
        count, window_start = self.counter[client_ip]
        now = time.time()

        if now - window_start > self.window_seconds:
            # reset window
            self.counter[client_ip] = (1, now)
        else:
            if count >= self.max_requests:
                logger.warning("Rate limit exceeded", extra={"client_ip": client_ip})
                return Response(
                    content="Rate limit exceeded",
                    status_code=429,
                )
            self.counter[client_ip] = (count + 1, window_start)

        response = await call_next(request)
        return response
