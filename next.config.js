/** @type {import('next').NextConfig} */
const isDocker = process.env.BUILD_TARGET === 'docker';
const isProduction = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  poweredByHeader: false,
  
  // 画像最適化設定
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  
  // 静的エクスポート設定
  output: isDocker && isProduction ? 'standalone' : 'export',
  
  // 環境変数の公開設定（クライアントサイドで使用）
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003',
    NEXT_PUBLIC_ADMIN_URL: process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:8001',
    NEXT_PUBLIC_STORE_URL: process.env.NEXT_PUBLIC_STORE_URL || 'http://localhost:8002',
    NEXT_PUBLIC_TERMINAL_URL: process.env.NEXT_PUBLIC_TERMINAL_URL || 'http://localhost:8004',
  },
}

module.exports = nextConfig