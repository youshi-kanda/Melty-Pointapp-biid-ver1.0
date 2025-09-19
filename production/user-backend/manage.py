#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from pathlib import Path

if __name__ == '__main__':
    # ユーザー画面専用の設定を使用
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'user_settings')
    
    # backend ディレクトリをパスに追加
    backend_path = Path(__file__).resolve().parent.parent.parent / 'backend'
    sys.path.insert(0, str(backend_path))
    
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)