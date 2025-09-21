# BIID Point App - 管理者バックエンド用 Dockerfile
FROM python:3.9-slim

# 作業ディレクトリ設定
WORKDIR /app

# システムパッケージ更新
RUN apt-get update && apt-get install -y \
    postgresql-client \
    gettext \
    && rm -rf /var/lib/apt/lists/*

# Pythonバッファリング無効化
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# プロジェクトのPython依存関係をコピー・インストール
COPY ../backend/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# プロジェクト全体をコピー
COPY ../backend /app/backend
COPY . /app/admin-backend

# 静的ファイルディレクトリ作成
RUN mkdir -p /app/admin-backend/static /app/admin-backend/media

# ログディレクトリ作成
RUN mkdir -p /var/log/biid

# 作業ディレクトリを管理者バックエンドに変更
WORKDIR /app/admin-backend

# 本番用設定で使用
ENV DJANGO_SETTINGS_MODULE=admin_settings

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8001/health/', timeout=10)"

# ポート公開
EXPOSE 8001

# エントリーポイントスクリプト
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# 起動コマンド
ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["gunicorn", "--bind", "0.0.0.0:8001", "--workers", "3", "--timeout", "120", "admin_settings.wsgi:application"]