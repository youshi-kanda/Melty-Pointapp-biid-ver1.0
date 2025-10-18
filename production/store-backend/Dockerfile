# BIID Point App - 店舗バックエンド用 Dockerfile
FROM python:3.9-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    postgresql-client \
    gettext \
    && rm -rf /var/lib/apt/lists/*

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

COPY backend/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY backend /app/backend
COPY production/store-backend /app/store-backend

# 静的HTMLファイルを確実にコピー（既にstatic/に存在するものを保持）
RUN mkdir -p /app/store-backend/media /var/log/biid

WORKDIR /app/store-backend

ENV DJANGO_SETTINGS_MODULE=store_settings

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8002/health/', timeout=10)"

EXPOSE 8002

COPY production/store-backend/docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["gunicorn", "--bind", "0.0.0.0:8002", "--workers", "3", "--timeout", "120", "--chdir", "/app/backend", "--env", "DJANGO_SETTINGS_MODULE=store_settings", "pointapp.wsgi:application"]