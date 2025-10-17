#!/bin/bash
set -e

export PYTHONPATH="/app/backend:$PYTHONPATH"

echo "🚀 BIID Terminal Backend Starting..."
python manage.py migrate --settings=terminal_settings --noinput
echo "✅ Terminal Backend ready!"
exec "$@"