/** @type {import('next').NextConfig} */
const nextConfig = {
  // Docker本番用: standalone出力（サーバーサイド機能を保持）
  output: process.env.DOCKER_BUILD === 'true' ? 'standalone' : 'export',
  
  reactStrictMode: false,
  swcMinify: true,
  poweredByHeader: false,
  
  // 画像最適化設定
  images: {
    unoptimized: process.env.DOCKER_BUILD !== 'true',
  },
  
  // 環境変数の公開
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001',
    NEXT_PUBLIC_ADMIN_API_URL: process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:8001',
    NEXT_PUBLIC_STORE_API_URL: process.env.NEXT_PUBLIC_STORE_API_URL || 'http://localhost:8002',
    NEXT_PUBLIC_USER_API_URL: process.env.NEXT_PUBLIC_USER_API_URL || 'http://localhost:8003',
    NEXT_PUBLIC_TERMINAL_API_URL: process.env.NEXT_PUBLIC_TERMINAL_API_URL || 'http://localhost:8004',
  },
  
  // 基本的なリダイレクト
  async redirects() {
    return [
      {
        source: '/',
        destination: '/terminal-simple',
        permanent: false,
      },
    ];
  },

  // APIリライト（開発時のCORS回避）
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/admin/:path*',
          destination: 'http://localhost:8001/admin/:path*',
        },
        {
          source: '/api/store/:path*',
          destination: 'http://localhost:8002/store/:path*',
        },
        {
          source: '/api/user/:path*',
          destination: 'http://localhost:8003/user/:path*',
        },
        {
          source: '/api/terminal/:path*',
          destination: 'http://localhost:8004/terminal/:path*',
        },
      ];
    }
    return [];
  },
  
  // Webpack設定のカスタマイズ
  webpack: (config, { isServer }) => {
    // サーバーサイドでのfsモジュール問題の回避
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
