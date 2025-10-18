/** @type {import('next').NextConfig} */
// ビルドターゲットの判定
const isCloudflare = process.env.BUILD_TARGET === 'cloudflare';
const isDocker = process.env.BUILD_TARGET === 'docker';
const isProduction = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  poweredByHeader: false,
  
  // 画像最適化設定
  images: {
    unoptimized: true, // Cloudflare PagesとDocker両方で画像最適化を無効化
  },
  
  // 静的エクスポート時はtrailingSlashを有効化
  ...(isCloudflare ? { trailingSlash: true } : {}),
  
  // 環境に応じた出力設定
  // Cloudflare Pages: 静的エクスポート
  // Docker: スタンドアロン (Node.jsサーバー)
  // ローカル開発: デフォルト
  ...(isCloudflare ? { output: 'export' } : {}),
  ...(isDocker && isProduction ? { output: 'standalone' } : {}),
  
  // 環境変数の公開設定（クライアントサイドで使用）
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003',
    NEXT_PUBLIC_ADMIN_URL: process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:8001',
    NEXT_PUBLIC_STORE_URL: process.env.NEXT_PUBLIC_STORE_URL || 'http://localhost:8002',
    NEXT_PUBLIC_TERMINAL_URL: process.env.NEXT_PUBLIC_TERMINAL_URL || 'http://localhost:8004',
  },
}

module.exports = nextConfig