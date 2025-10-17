#!/bin/bash
set -e

export PYTHONPATH="/app/backend:$PYTHONPATH"

echo "🚀 BIID User Backend Starting..."
python manage.py migrate --settings=user_settings --noinput
echo "✅ User Backend ready!"
exec "$@"