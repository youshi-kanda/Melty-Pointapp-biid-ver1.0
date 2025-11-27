#!/bin/bash
# PWAアイコン生成スクリプト
# ImageMagickが必要: brew install imagemagick

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ICONS_DIR="$PROJECT_ROOT/public/icons"

echo "🎨 PWAアイコン生成を開始します..."
echo "作業ディレクトリ: $ICONS_DIR"

# ImageMagickがインストールされているか確認
if ! command -v convert &> /dev/null; then
    echo "❌ エラー: ImageMagickがインストールされていません"
    echo "次のコマンドでインストールしてください:"
    echo "  brew install imagemagick"
    exit 1
fi

# アイコンディレクトリが存在しない場合は作成
mkdir -p "$ICONS_DIR"

# ============================================
# ユーザーアプリ用アイコン (ピンク系)
# ============================================
echo ""
echo "📱 ユーザーアプリ用アイコンを生成中..."

# ベースとなる512x512アイコンを作成（ピンク系グラデーション）
convert -size 512x512 \
    -define gradient:angle=135 \
    gradient:'#ec4899-#f472b6' \
    -gravity center \
    -pointsize 240 \
    -font "Arial-Bold" \
    -fill white \
    -annotate +0+0 "M+" \
    "$ICONS_DIR/user-512x512.png"

# 各サイズのユーザーアプリアイコンを生成
for size in 72 96 128 144 152 192 384 512; do
    if [ $size -ne 512 ]; then
        convert "$ICONS_DIR/user-512x512.png" \
            -resize ${size}x${size} \
            "$ICONS_DIR/user-${size}x${size}.png"
        echo "  ✓ user-${size}x${size}.png"
    else
        echo "  ✓ user-512x512.png (ベース)"
    fi
done

# ============================================
# 決済端末用アイコン (青系)
# ============================================
echo ""
echo "💳 決済端末用アイコンを生成中..."

# ベースとなる512x512アイコンを作成（青系グラデーション）
convert -size 512x512 \
    -define gradient:angle=135 \
    gradient:'#667eea-#818cf8' \
    -gravity center \
    -pointsize 240 \
    -font "Arial-Bold" \
    -fill white \
    -annotate +0+0 "T+" \
    "$ICONS_DIR/terminal-512x512.png"

# 各サイズの決済端末アイコンを生成
for size in 192 512; do
    if [ $size -ne 512 ]; then
        convert "$ICONS_DIR/terminal-512x512.png" \
            -resize ${size}x${size} \
            "$ICONS_DIR/terminal-${size}x${size}.png"
        echo "  ✓ terminal-${size}x${size}.png"
    else
        echo "  ✓ terminal-512x512.png (ベース)"
    fi
done

# ============================================
# ショートカットアイコン (96x96)
# ============================================
echo ""
echo "🔗 ショートカットアイコンを生成中..."

# ポイントアイコン（コイン）
convert -size 96x96 \
    -define gradient:angle=135 \
    gradient:'#fbbf24-#f59e0b' \
    -gravity center \
    -pointsize 48 \
    -font "Arial-Bold" \
    -fill white \
    -annotate +0+0 "P" \
    "$ICONS_DIR/shortcut-points.png"
echo "  ✓ shortcut-points.png"

# ギフトアイコン（プレゼント）
convert -size 96x96 \
    -define gradient:angle=135 \
    gradient:'#ec4899-#f472b6' \
    -gravity center \
    -pointsize 48 \
    -font "Arial-Bold" \
    -fill white \
    -annotate +0+0 "G" \
    "$ICONS_DIR/shortcut-gift.png"
echo "  ✓ shortcut-gift.png"

# マップアイコン（地図）
convert -size 96x96 \
    -define gradient:angle=135 \
    gradient:'#10b981-#34d399' \
    -gravity center \
    -pointsize 48 \
    -font "Arial-Bold" \
    -fill white \
    -annotate +0+0 "M" \
    "$ICONS_DIR/shortcut-map.png"
echo "  ✓ shortcut-map.png"

# QRスキャンアイコン（カメラ）
convert -size 96x96 \
    -define gradient:angle=135 \
    gradient:'#667eea-#818cf8' \
    -gravity center \
    -pointsize 48 \
    -font "Arial-Bold" \
    -fill white \
    -annotate +0+0 "Q" \
    "$ICONS_DIR/shortcut-scan.png"
echo "  ✓ shortcut-scan.png"

# ============================================
# 完了
# ============================================
echo ""
echo "✅ PWAアイコン生成が完了しました！"
echo ""
echo "生成されたファイル:"
ls -lh "$ICONS_DIR"/*.png | awk '{print "  " $9 " (" $5 ")"}'
echo ""
echo "次のステップ:"
echo "1. デザイナーに依頼して正式なアイコンを作成"
echo "2. public/icons/配下のファイルを正式版に置き換え"
echo "3. PWAインストール動作をテスト"
