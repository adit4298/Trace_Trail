FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app \
    PORT=8000

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements/base.txt ./requirements/base.txt

RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements/base.txt

COPY . .

RUN adduser --disabled-password --gecos "" appuser && \
    chown -R appuser:appuser /app

USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD python -c "import os, socket; s = socket.create_connection(('127.0.0.1', int(os.environ.get('PORT', '8000'))), timeout=2); s.close()"

CMD python -c "import os; import uvicorn; port = int(os.environ.get('PORT', 8000)); uvicorn.run('src.main:app', host='0.0.0.0', port=port)"
