/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/biid-user-api\.fly\.dev\/api\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60 // 24 hours
        },
        networkTimeoutSeconds: 10
      }
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
        }
      }
    },
    {
      urlPattern: /\.(?:js|css)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
        }
      }
    }
  ]
})

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
  // 開発環境では通常モード、本番環境ではexportモード
  // ...(isProduction && !isDocker ? { output: 'export' } : {}),
  // Middlewareを使用するため、本番環境でもNode.jsサーバーモードを使用する
  output: 'standalone',

  // 環境変数の公開設定（クライアントサイドで使用）
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003',
    NEXT_PUBLIC_ADMIN_URL: process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:8001',
    NEXT_PUBLIC_STORE_URL: process.env.NEXT_PUBLIC_STORE_URL || 'http://localhost:8002',
    NEXT_PUBLIC_TERMINAL_URL: process.env.NEXT_PUBLIC_TERMINAL_URL || 'http://localhost:8004',
  },
}

module.exports = withPWA(nextConfig)