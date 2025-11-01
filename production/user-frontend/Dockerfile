# Fly.io用 Next.js Dockerfile - ユーザーアプリ
FROM node:20-alpine AS base

# 依存関係インストール用
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./
RUN npm ci

# ビルド用
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ユーザーアプリに不要なページを削除
RUN rm -rf pages/terminal pages/admin pages/store pages/payment-test.tsx

# ビルド時の環境変数を受け取る
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

# 環境変数を設定
ENV NODE_ENV=production
ENV BUILD_TARGET=docker
ENV NEXT_TELEMETRY_DISABLED=1

# Next.jsアプリをビルド
RUN npm run build

# 本番用
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# ビルド成果物をコピー
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
