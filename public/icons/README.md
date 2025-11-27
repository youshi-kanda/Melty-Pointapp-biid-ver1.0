# PWA Icons

このディレクトリには、PWAで使用されるアイコンファイルを配置します。

## 必要なアイコン

### ユーザーアプリ用 (ピンク系 #ec4899)
- user-72x72.png
- user-96x96.png
- user-128x128.png
- user-144x144.png
- user-152x152.png
- user-192x192.png ✨ 必須
- user-384x384.png
- user-512x512.png ✨ 必須

### 決済端末用 (インディゴ系 #667eea)
- terminal-192x192.png ✨ 必須
- terminal-512x512.png ✨ 必須

### ショートカット用 (96x96)
- shortcut-points.png (ポイント)
- shortcut-gift.png (ギフト)
- shortcut-map.png (地図)
- shortcut-scan.png (スキャン)

## アイコン生成方法

### オンラインツール
1. https://realfavicongenerator.net/
2. https://www.pwabuilder.com/imageGenerator

### コマンドライン（ImageMagick）
```bash
# ベースとなる512x512のPNG画像から各サイズを生成
convert base-512.png -resize 192x192 user-192x192.png
convert base-512.png -resize 152x152 user-152x152.png
# ... 以下同様
```

### デザイン要件
- **ユーザーアプリ**: ピンク系グラデーション、ハート型またはMロゴ
- **決済端末**: インディゴ系、QRコードモチーフ
- **maskable**: Safe area 40%考慮
