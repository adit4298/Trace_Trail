FROM python:3.11-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    POETRY_VIRTUALENVS_CREATE=false

# Work directory inside the container
WORKDIR /app

# System deps (optional but useful)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python deps
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt
RUN pip install email-validator && \
    pip install pydantic[email]


# Copy app code
COPY . ./ai_module
ENV PYTHONPATH=/app/

# The app listens on 8100, so expose 8100 (not mandatory but nice)
EXPOSE 8100

# Start the FastAPI application
CMD ["python", "-m", "uvicorn", "ai_module.main:app", "--host", "0.0.0.0", "--port", "8100"]


