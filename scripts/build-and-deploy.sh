#!/bin/bash

# BIID Point App - ビルド・デプロイ自動化スクリプト
# 使用方法: ./scripts/build-and-deploy.sh [service-name]
# 例: ./scripts/build-and-deploy.sh admin

set -e  # エラーで停止

# 色付きログ
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}ℹ ${1}${NC}"
}

log_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠ ${1}${NC}"
}

log_error() {
    echo -e "${RED}✗ ${1}${NC}"
}

# サービス名を引数から取得
SERVICE="${1:-admin}"
log_info "Building service: ${SERVICE}"

# プロジェクトルートに移動
cd "$(dirname "$0")/.."
PROJECT_ROOT=$(pwd)

# 1. クリーンビルド
log_info "Step 1/6: Cleaning previous build..."
rm -rf .next out
log_success "Clean completed"

# 2. Next.jsビルド
log_info "Step 2/6: Building Next.js application..."
npm run build
log_success "Build completed"

# 3. すべてのHTMLファイルのパス修正
log_info "Step 3/6: Fixing asset paths in HTML files..."
cd out
find . -name "*.html" -exec sed -i '' 's|"/_next/|"/static/_next/|g' {} \;
log_success "Paths fixed (/_next/ → /static/_next/)"

# 4. index.htmlファイルの作成
log_info "Step 4/6: Creating index.html files..."
for dir in admin store terminal user; do
  if [ -f "${dir}.html" ]; then
    cp "${dir}.html" "${dir}/index.html"
    log_success "Created ${dir}/index.html"
  fi
done

cd "$PROJECT_ROOT"

# 5. production環境にコピー
log_info "Step 5/6: Copying files to production/${SERVICE}-backend/static/..."
mkdir -p "production/${SERVICE}-backend/static"
cp -r out/* "production/${SERVICE}-backend/static/"
log_success "Files copied successfully"

# 6. ファイル数とサイズを表示
log_info "Build summary:"
HTML_COUNT=$(find "production/${SERVICE}-backend/static" -name "*.html" | wc -l | tr -d ' ')
TOTAL_SIZE=$(du -sh "production/${SERVICE}-backend/static" | cut -f1)
echo "  - HTML files: ${HTML_COUNT}"
echo "  - Total size: ${TOTAL_SIZE}"

log_success "Build process completed! ✨"
echo ""
log_warning "Next steps:"
echo "  1. Review changes: git status"
echo "  2. Commit changes: git add . && git commit -m \"build: Update ${SERVICE} static files\""
echo "  3. Deploy to Fly.io: flyctl deploy --config fly-${SERVICE}.toml"
echo "  4. Verify deployment: curl -I https://biid-${SERVICE}.fly.dev/"
echo ""

# デプロイオプション
read -p "Do you want to deploy to Fly.io now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "Starting deployment to Fly.io..."
    flyctl deploy --config "fly-${SERVICE}.toml"
    
    log_info "Checking deployment status..."
    sleep 3
    flyctl status --config "fly-${SERVICE}.toml"
    
    log_success "Deployment completed!"
    log_info "Verifying endpoints..."
    
    echo ""
    echo "Testing URLs:"
    curl -I "https://biid-${SERVICE}.fly.dev/" 2>&1 | grep -E "(HTTP|location)"
    curl -I "https://biid-${SERVICE}.fly.dev/static/${SERVICE}/" 2>&1 | grep "HTTP"
    
    log_success "All done! Visit https://biid-${SERVICE}.fly.dev/ to see your application."
else
    log_info "Skipping deployment. Run manually when ready:"
    echo "  flyctl deploy --config fly-${SERVICE}.toml"
fi
