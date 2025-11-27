const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const ICONS_DIR = path.join(__dirname, '../public/icons');

// アイコンディレクトリが存在しない場合は作成
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

console.log('🎨 PWAアイコン生成を開始します...');
console.log(`作業ディレクトリ: ${ICONS_DIR}\n`);

/**
 * グラデーションアイコンを生成
 */
function generateIcon(size, text, colors, filename) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // グラデーション背景
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(1, colors[1]);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // テキスト
  ctx.fillStyle = 'white';
  ctx.font = `bold ${size * 0.4}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, size / 2, size / 2);

  // ファイル保存
  const buffer = canvas.toBuffer('image/png');
  const filepath = path.join(ICONS_DIR, filename);
  fs.writeFileSync(filepath, buffer);
  
  return filepath;
}

// ============================================
// ユーザーアプリ用アイコン (ピンク系)
// ============================================
console.log('📱 ユーザーアプリ用アイコンを生成中...');

const userColors = ['#ec4899', '#f472b6'];
const userSizes = [72, 96, 128, 144, 152, 192, 384, 512];

userSizes.forEach(size => {
  const filename = `user-${size}x${size}.png`;
  generateIcon(size, 'M+', userColors, filename);
  console.log(`  ✓ ${filename}`);
});

// ============================================
// 決済端末用アイコン (青系)
// ============================================
console.log('\n💳 決済端末用アイコンを生成中...');

const terminalColors = ['#667eea', '#818cf8'];
const terminalSizes = [192, 512];

terminalSizes.forEach(size => {
  const filename = `terminal-${size}x${size}.png`;
  generateIcon(size, 'T+', terminalColors, filename);
  console.log(`  ✓ ${filename}`);
});

// ============================================
// ショートカットアイコン (96x96)
// ============================================
console.log('\n🔗 ショートカットアイコンを生成中...');

const shortcuts = [
  { text: 'P', colors: ['#fbbf24', '#f59e0b'], name: 'shortcut-points.png' },
  { text: 'G', colors: ['#ec4899', '#f472b6'], name: 'shortcut-gift.png' },
  { text: 'M', colors: ['#10b981', '#34d399'], name: 'shortcut-map.png' },
  { text: 'Q', colors: ['#667eea', '#818cf8'], name: 'shortcut-scan.png' }
];

shortcuts.forEach(shortcut => {
  generateIcon(96, shortcut.text, shortcut.colors, shortcut.name);
  console.log(`  ✓ ${shortcut.name}`);
});

// ============================================
// 完了
// ============================================
console.log('\n✅ PWAアイコン生成が完了しました！\n');
console.log('生成されたファイル:');
const files = fs.readdirSync(ICONS_DIR).filter(f => f.endsWith('.png'));
files.forEach(file => {
  const stats = fs.statSync(path.join(ICONS_DIR, file));
  const sizeKB = (stats.size / 1024).toFixed(1);
  console.log(`  ${file} (${sizeKB} KB)`);
});

console.log('\n次のステップ:');
console.log('1. デザイナーに依頼して正式なアイコンを作成');
console.log('2. public/icons/配下のファイルを正式版に置き換え');
console.log('3. PWAインストール動作をテスト');
