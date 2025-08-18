# 📊 biid Terminal - アナリティクス統合ガイド

## 🎯 概要

biid Terminal システムのアナリティクス統合実装について説明します。このガイドでは、使用状況追跡、ユーザー行動分析、ビジネスメトリクス監視、パフォーマンス分析などの技術的詳細を記載しています。

## 📈 アナリティクス機能

### 1. 自動データ収集

```typescript
import { analyticsService } from '@/lib/analytics/analyticsService';

// 自動初期化
const analytics = new AnalyticsService({
  enabled: process.env.NODE_ENV === 'production',
  trackPageViews: true,
  trackUserInteractions: true,
  trackPerformance: true,
  trackErrors: true
});
```

### 2. イベント追跡システム

#### 基本イベント追跡
```typescript
import { useAnalytics } from '@/lib/analytics/analyticsService';

const { trackEvent } = useAnalytics();

// ユーザーインタラクション
trackEvent('user_interaction', 'button_click', 'payment_start');

// ナビゲーション
trackEvent('navigation', 'page_view', '/terminal/payment');

// ビジネスイベント
trackEvent('business', 'payment', 'nfc', 1500);
```

#### 特化されたビジネス追跡
```typescript
import { useBusinessAnalytics } from '@/hooks/useAnalyticsTracking';

const { trackPayment, trackPointGrant, trackNfcScan } = useBusinessAnalytics();

// 決済イベント
trackPayment({
  amount: 1500,
  method: 'nfc',
  success: true,
  duration: 2300
});

// ポイント付与
trackPointGrant({
  points: 150,
  method: 'qr',
  success: true,
  userId: 'user_123'
});

// NFC スキャン
trackNfcScan({
  success: true,
  duration: 1200,
  cardType: 'felica'
});
```

### 3. セッション管理

```typescript
// セッション情報の自動収集
interface UserSession {
  id: string;
  userId?: string;
  startTime: Date;
  duration: number;
  pageViews: string[];
  events: AnalyticsEvent[];
  deviceInfo: {
    platform: string;
    screenResolution: string;
    isOnline: boolean;
  };
}
```

## 🛠️ 実装された機能

### 1. リアルタイムダッシュボード

```typescript
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

// ダッシュボードの表示
<AnalyticsDashboard 
  isOpen={showDashboard} 
  onClose={() => setShowDashboard(false)} 
/>
```

#### ダッシュボード機能:
- **KPI メトリクス**: 総イベント数、アクティブセッション、平均セッション時間
- **ビジネス指標**: 決済件数、ポイント付与、NFC/QRスキャン数
- **視覚化**: チャート、グラフ、円グラフでのデータ表示
- **リアルタイム更新**: 30秒ごとの自動更新
- **データエクスポート**: JSON形式でのレポートダウンロード

### 2. Core Web Vitals 監視

```typescript
// パフォーマンス指標の自動追跡
const performanceObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'largest-contentful-paint') {
      trackEvent('performance', 'lcp', 'core_web_vitals', entry.startTime);
    }
  }
});
```

### 3. エラー追跡統合

```typescript
import { useErrorAnalytics } from '@/hooks/useAnalyticsTracking';

const { trackError, trackApiError } = useErrorAnalytics();

// JavaScript エラー
try {
  riskyOperation();
} catch (error) {
  trackError(error, { context: 'payment_processing' });
}

// API エラー
trackApiError('/api/payment', 500, 'Internal server error');
```

## 📊 収集データの種類

### 1. ユーザーインタラクション
```typescript
// クリックイベント
{
  category: 'user_interaction',
  action: 'click',
  label: 'button#payment-start',
  metadata: {
    x: 150, y: 200,
    text: 'お支払い開始',
    timestamp: '2025-01-15T10:30:00Z'
  }
}

// フォーム送信
{
  category: 'user_interaction',
  action: 'form_submit',
  label: 'payment_form',
  value: 1,
  metadata: {
    success: true,
    fields: ['amount', 'method']
  }
}
```

### 2. ビジネスメトリクス
```typescript
// 決済イベント
{
  category: 'business',
  action: 'payment',
  label: 'nfc',
  value: 1500,
  metadata: {
    success: true,
    duration: 2300,
    method: 'nfc',
    timestamp: '2025-01-15T10:30:00Z'
  }
}
```

### 3. パフォーマンスデータ
```typescript
// ページ読み込み時間
{
  category: 'performance',
  action: 'page_load',
  label: '/terminal/payment',
  value: 1200,
  metadata: {
    domContentLoaded: 800,
    firstPaint: 600,
    firstContentfulPaint: 900
  }
}
```

## 🔧 カスタムフック活用

### 1. ページレベル追跡
```typescript
import { useAnalyticsTracking } from '@/hooks/useAnalyticsTracking';

const PaymentPage = () => {
  // 自動ページビュー追跡
  const { trackEvent } = useAnalyticsTracking('payment_page', {
    feature: 'terminal_payment'
  });

  return <div>...</div>;
};
```

### 2. パフォーマンス測定
```typescript
import { usePerformanceAnalytics } from '@/hooks/useAnalyticsTracking';

const { measureAsync } = usePerformanceAnalytics();

// 非同期処理の時間測定
const processPayment = async () => {
  return await measureAsync('payment_processing', async () => {
    return await paymentAPI.process(data);
  });
};
```

## 📡 データ送信・保存

### 1. API エンドポイント

#### イベントデータ (`/api/analytics/events`)
```typescript
// POST リクエスト例
{
  events: [
    {
      id: 'event_1234567890_abc123',
      name: 'user_interaction_button_click',
      category: 'user_interaction',
      action: 'button_click',
      timestamp: '2025-01-15T10:30:00Z',
      sessionId: 'session_1234567890_def456'
    }
  ]
}
```

#### セッションデータ (`/api/analytics/sessions`)
```typescript
// POST リクエスト例
{
  session: {
    id: 'session_1234567890_def456',
    userId: 'user_123',
    startTime: '2025-01-15T10:00:00Z',
    endTime: '2025-01-15T10:30:00Z',
    duration: 1800000,
    pageViews: ['/terminal', '/terminal/payment'],
    events: [...],
    deviceInfo: {...}
  }
}
```

### 2. バッチ処理

```typescript
// 自動バッチ送信（30秒間隔）
const config = {
  batchSize: 50,      // 50イベントまで蓄積
  flushInterval: 30000 // 30秒ごとに送信
};
```

## 🎨 ダッシュボードUI

### 1. メトリクスカード
- 総イベント数
- アクティブセッション数
- 平均セッション時間
- エラー率

### 2. ビジネス指標カード
- 決済件数
- ポイント付与数
- NFC スキャン数
- QR スキャン数

### 3. 視覚化チャート
- **棒グラフ**: 人気ページ、機能使用状況
- **円グラフ**: 業務活動内訳
- **折れ線グラフ**: 時系列トレンド（将来実装）

## ⚙️ 設定とカスタマイズ

### 1. 環境変数設定
```bash
# .env.local
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token
```

### 2. アナリティクス設定
```typescript
const analyticsConfig = {
  enabled: process.env.NODE_ENV === 'production',
  trackPageViews: true,
  trackUserInteractions: true,
  trackPerformance: true,
  trackErrors: true,
  batchSize: 50,
  flushInterval: 30000,
  sampleRate: 0.8, // 本番環境では80%をサンプリング
  googleAnalytics: {
    measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    enabled: true
  }
};
```

## 📈 外部サービス統合

### 1. Google Analytics 4
```typescript
// 自動初期化と連携
gtag('config', GA_MEASUREMENT_ID, {
  page_path: window.location.pathname,
  page_title: document.title
});

// カスタムイベント送信
gtag('event', 'payment_completed', {
  event_category: 'business',
  event_label: 'nfc',
  value: 1500
});
```

### 2. Mixpanel（オプション）
```typescript
// ユーザー識別
mixpanel.identify('user_123');

// カスタムイベント
mixpanel.track('Payment Completed', {
  amount: 1500,
  method: 'nfc',
  success: true
});
```

## 🔍 データ分析・レポート

### 1. 自動レポート生成
```typescript
const report = analyticsService.generateAnalyticsReport();

// レポート内容
console.log(report.summary); // 基本統計
console.log(report.userBehavior); // ユーザー行動
console.log(report.performance); // パフォーマンス指標
console.log(report.business); // ビジネスメトリクス
```

### 2. CSV/JSON エクスポート
```typescript
// JSON形式でダウンロード
const exportData = () => {
  const dataStr = JSON.stringify(report, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
};
```

## 🚨 アラート・通知

### 1. 重要イベントの監視
```typescript
// 重大エラーの即座通知
if (event.category === 'error' && event.severity === 'critical') {
  // Slack, メール, PagerDuty等に通知
  notificationService.notifySystem('ERROR', 'Critical Error', event.message);
}

// ビジネス指標の監視
if (event.category === 'business' && event.action === 'payment' && !event.customData.success) {
  // 決済失敗アラート
  notificationService.notifyBusiness('WARNING', 'Payment Failed', event);
}
```

### 2. パフォーマンス劣化検出
```typescript
// パフォーマンススコアが閾値を下回った場合
if (performanceScore < 50) {
  notificationService.notifySystem('WARNING', 'Performance Degradation', 
    `Score dropped to ${performanceScore}`
  );
}
```

## 📚 ベストプラクティス

### 1. プライバシー配慮
```typescript
// 個人情報の除外
const sanitizedData = {
  ...eventData,
  userId: hashUserId(eventData.userId), // ハッシュ化
  // 機密情報は除外
};
```

### 2. パフォーマンス最適化
```typescript
// サンプリングでデータ量を制御
if (Math.random() > sampleRate) {
  return; // 一部のイベントをスキップ
}

// バッチ処理で通信回数を削減
const batchEvents = events.slice(0, batchSize);
await sendToServer('/api/analytics/events', { events: batchEvents });
```

### 3. エラーハンドリング
```typescript
try {
  await sendAnalyticsData(data);
} catch (error) {
  // 送信失敗時も元の機能に影響しない
  console.warn('Analytics send failed:', error);
  // 一部のデータを保持して後で再試行
}
```

## 🔧 トラブルシューティング

### よくある問題と解決方法

#### 1. データが送信されない
```javascript
// デバッグモードで確認
localStorage.setItem('debug_analytics', 'true');

// コンソールでイベント確認
analyticsService.events.forEach(event => console.log(event));
```

#### 2. ダッシュボードにデータが表示されない
```javascript
// データの更新確認
const report = analyticsService.generateAnalyticsReport();
console.log('Total events:', report.summary.totalEvents);
```

#### 3. パフォーマンスへの影響
```javascript
// サンプリングレートを下げる
analyticsService.updateConfig({
  sampleRate: 0.1 // 10%に削減
});
```

## 📊 継続的な改善

### 1. A/B テスト統合
```typescript
const variant = getABTestVariant('payment_flow');
trackEvent('system', 'ab_test_assignment', 'payment_flow', variant);
```

### 2. 機械学習準備
```typescript
// MLモデル用のデータ形式で出力
const mlData = events.map(event => ({
  timestamp: event.timestamp,
  action: event.action,
  value: event.value,
  success: event.customData?.success,
  duration: event.customData?.duration
}));
```

---

## ✅ 実装チェックリスト

### 開発時
- [ ] アナリティクスサービスの初期化
- [ ] 重要なユーザーアクションの追跡設定
- [ ] ビジネスイベントの追跡実装
- [ ] エラーハンドリングの実装

### テスト時
- [ ] イベントデータの送信確認
- [ ] ダッシュボードの表示確認
- [ ] パフォーマンスへの影響測定
- [ ] プライバシー要件の確認

### 本番運用
- [ ] 外部サービス連携の設定
- [ ] アラート機能の有効化
- [ ] 定期レポートの設定
- [ ] データ保持ポリシーの設定

---

**このガイドに従って実装することで、biid Terminal システムの使用状況を包括的に分析し、データドリブンな改善を継続的に行うことができます。**