# BIID Point App - 決済端末バックエンド用 Dockerfile
FROM python:3.9-slim

WORKDIR /app
RUN apt-get update && apt-get install -y postgresql-client gettext && rm -rf /var/lib/apt/lists/*
ENV PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1

COPY backend/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY backend /app/backend
COPY production/terminal-backend /app/terminal-backend
RUN mkdir -p /app/terminal-backend/static /app/terminal-backend/media /var/log/biid

WORKDIR /app/terminal-backend
ENV DJANGO_SETTINGS_MODULE=terminal_settings

EXPOSE 8004
COPY production/terminal-backend/docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["gunicorn", "--bind", "0.0.0.0:8004", "--workers", "3", "--timeout", "120", "--chdir", "/app/backend", "--env", "DJANGO_SETTINGS_MODULE=terminal_settings", "pointapp.wsgi:application"]