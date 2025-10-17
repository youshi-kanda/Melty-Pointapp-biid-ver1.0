/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production' && process.env.BUILD_TARGET === 'docker';

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  poweredByHeader: false,
  
  // 画像最適化設定
  images: {
    unoptimized: true,
  },
  
  // Docker本番環境ではstandalone出力
  ...(isProduction ? { output: 'standalone' } : {}),
}

module.exports = nextConfig