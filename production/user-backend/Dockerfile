# BIID Point App - ユーザーバックエンド用 Dockerfile
FROM python:3.9-slim

WORKDIR /app
RUN apt-get update && apt-get install -y postgresql-client gettext && rm -rf /var/lib/apt/lists/*
ENV PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1

COPY backend/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY backend /app/backend
COPY production/user-backend /app/user-backend

# 静的HTMLファイルを確実にコピー（既にstatic/に存在するものを保持）
RUN mkdir -p /app/user-backend/media /var/log/biid

WORKDIR /app/user-backend
ENV DJANGO_SETTINGS_MODULE=user_settings

EXPOSE 8003
COPY production/user-backend/docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["gunicorn", "--bind", "0.0.0.0:8003", "--workers", "2", "--timeout", "120", "--chdir", "/app/backend", "--env", "DJANGO_SETTINGS_MODULE=user_settings", "pointapp.wsgi:application"]