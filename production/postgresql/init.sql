-- BIID Point App PostgreSQL 初期化スクリプト
-- このスクリプトはコンテナ初回起動時に自動実行されます

-- データベース設定
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET track_activity_query_size = 2048;
ALTER SYSTEM SET pg_stat_statements.track = 'all';

-- パフォーマンス最適化設定
ALTER SYSTEM SET max_connections = 100;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.7;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
ALTER SYSTEM SET random_page_cost = 1.1;
ALTER SYSTEM SET effective_io_concurrency = 200;

-- ログ設定
ALTER SYSTEM SET log_destination = 'stderr';
ALTER SYSTEM SET logging_collector = on;
ALTER SYSTEM SET log_directory = 'pg_log';
ALTER SYSTEM SET log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log';
ALTER SYSTEM SET log_rotation_age = '1d';
ALTER SYSTEM SET log_rotation_size = '100MB';
ALTER SYSTEM SET log_min_duration_statement = 1000;  -- 1秒以上のクエリをログ
ALTER SYSTEM SET log_line_prefix = '%t [%p-%l] %q%u@%d ';

-- セキュリティ設定
ALTER SYSTEM SET ssl = off;  -- 開発環境用、本番では on
ALTER SYSTEM SET password_encryption = 'md5';

-- 設定を反映
SELECT pg_reload_conf();

-- 拡張機能の有効化
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- BIID専用データベースに接続
\c biid_production;

-- インデックス最適化のための設定
-- 本番環境では運用開始後に必要に応じて追加
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_member_id ON core_user(member_id);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pointtransaction_user_created ON core_pointtransaction(user_id, created_at DESC);

-- データベース統計の更新
ANALYZE;