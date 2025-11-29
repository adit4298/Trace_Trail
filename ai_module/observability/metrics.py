"""
Prometheus metrics instrumentation for the TraceTrail AI module.
"""

from __future__ import annotations

import time
from typing import Callable, Awaitable, Any

from fastapi import Request, Response
from prometheus_client import (
    CONTENT_TYPE_LATEST,
    Counter,
    Gauge,
    Histogram,
    generate_latest
)

REQUEST_DURATION = Histogram(
    "ai_module_request_duration_seconds",
    "Latency for FastAPI requests served by the AI module",
    ["endpoint", "method"]
)
REQUEST_COUNT = Counter(
    "ai_module_request_total",
    "Total FastAPI requests served by the AI module",
    ["endpoint", "method", "status"]
)
INFERENCE_COUNT = Counter(
    "ai_module_inference_total",
    "Number of model inference calls executed",
    ["model"]
)
ANOMALY_COUNT = Gauge(
    "ai_module_latest_anomaly_count",
    "Most recent anomaly count returned to clients"
)


async def metrics_middleware(request: Request, call_next: Callable[[Request], Awaitable[Response]]) -> Response:
    """HTTP middleware that records request counts and latency."""
    start_time = time.perf_counter()
    response = await call_next(request)
    duration = time.perf_counter() - start_time

    endpoint = request.url.path
    method = request.method.upper()

    REQUEST_DURATION.labels(endpoint=endpoint, method=method).observe(duration)
    REQUEST_COUNT.labels(
        endpoint=endpoint,
        method=method,
        status=str(response.status_code)
    ).inc()

    return response


async def metrics_endpoint() -> Response:
    """Expose Prometheus metrics via /metrics."""
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)


def record_inference(model_name: str) -> None:
    """Increment inference counter for the given model."""
    INFERENCE_COUNT.labels(model=model_name).inc()


def record_anomaly_count(count: int) -> None:
    """Store the latest anomaly count."""
    ANOMALY_COUNT.set(count)

