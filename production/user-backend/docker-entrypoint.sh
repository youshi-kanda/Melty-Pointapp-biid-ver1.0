#!/bin/bash
set -e
echo "🚀 BIID User Backend Starting..."
python manage.py migrate --settings=user_settings --noinput
echo "✅ User Backend ready!"
exec "$@"