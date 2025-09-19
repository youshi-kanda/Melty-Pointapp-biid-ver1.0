const CACHE_NAME = 'biid-terminal-v1.0.0';
const API_CACHE_NAME = 'biid-api-cache-v1.0.0';

// キャッシュするリソース
const STATIC_CACHE_URLS = [
  '/terminal',
  '/terminal/login',
  '/terminal/nfc/lookup',
  '/terminal/points/grant',
  '/terminal/points/history',
  '/terminal/payment/qr',
  '/offline',
  '/_next/static/css/',
  '/manifest.json'
];

// API エンドポイント
const API_ENDPOINTS = [
  '/api/auth/login/terminal/',
  '/api/nfc/lookup/',
  '/api/points/grant/',
  '/api/transactions/history/',
  '/api/payment/qr/'
];

// Service Worker インストール
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static resources');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static resources:', error);
      })
  );
  
  // 新しいService Workerを即座にアクティブ化
  self.skipWaiting();
});

// Service Worker アクティベーション
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // すべてのクライアントを即座に制御
  self.clients.claim();
});

// フェッチイベント（ネットワーク戦略）
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API リクエストの処理
  if (isAPIRequest(url)) {
    event.respondWith(handleAPIRequest(request));
    return;
  }

  // 静的リソースの処理
  if (isStaticResource(url)) {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // その他のリクエスト（Network First）
  event.respondWith(handleOtherRequest(request));
});

// API リクエストかどうかを判定
function isAPIRequest(url) {
  return url.pathname.startsWith('/api/') || 
         API_ENDPOINTS.some(endpoint => url.pathname.startsWith(endpoint));
}

// 静的リソースかどうかを判定
function isStaticResource(url) {
  return url.pathname.startsWith('/_next/static/') ||
         url.pathname.startsWith('/icons/') ||
         url.pathname.endsWith('.js') ||
         url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.png') ||
         url.pathname.endsWith('.jpg') ||
         url.pathname.endsWith('.svg') ||
         STATIC_CACHE_URLS.includes(url.pathname);
}

// API リクエスト処理（Network First with Cache）
async function handleAPIRequest(request) {
  try {
    console.log('[SW] API Request:', request.url);
    
    // ネットワークを最初に試行
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // 成功時はキャッシュを更新
      const cache = await caches.open(API_CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', error);
    
    // ネットワーク失敗時はキャッシュから取得
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // キャッシュも見つからない場合はオフライン応答
    return new Response(JSON.stringify({
      success: false,
      error: 'オフラインのため利用できません',
      offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 静的リソース処理（Cache First）
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.error('[SW] Failed to fetch static resource:', error);
    // フォールバック画像やCSS
    return new Response('', { status: 404 });
  }
}

// その他のリクエスト処理（Network First）
async function handleOtherRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    // オフライン時のフォールバック
    if (request.destination === 'document') {
      const cachedResponse = await caches.match('/offline');
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // 基本的なオフラインHTML
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>オフライン - biid Terminal</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: system-ui, sans-serif; 
              text-align: center; 
              padding: 2rem; 
              background: #f9fafb;
            }
            .container {
              max-width: 400px;
              margin: 2rem auto;
              padding: 2rem;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>オフライン</h1>
            <p>インターネット接続を確認してください</p>
            <button onclick="location.reload()">再読み込み</button>
          </div>
        </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    return new Response('オフラインです', { status: 503 });
  }
}

// バックグラウンド同期
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync-transactions') {
    event.waitUntil(syncPendingTransactions());
  }
});

// 保留中の取引を同期
async function syncPendingTransactions() {
  try {
    // IndexedDBから保留中の取引を取得
    const pendingTransactions = await getPendingTransactions();
    
    for (const transaction of pendingTransactions) {
      try {
        const response = await fetch('/api/transactions/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transaction)
        });
        
        if (response.ok) {
          // 成功時は保留データを削除
          await removePendingTransaction(transaction.id);
          console.log('[SW] Transaction synced:', transaction.id);
        }
      } catch (error) {
        console.error('[SW] Failed to sync transaction:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// プッシュ通知
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    title: 'biid Terminal',
    body: 'プッシュ通知のメッセージ',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: '/terminal'
    },
    actions: [
      {
        action: 'open',
        title: '開く',
        icon: '/icons/action-open.png'
      },
      {
        action: 'close',
        title: '閉じる',
        icon: '/icons/action-close.png'
      }
    ]
  };
  
  if (event.data) {
    const data = event.data.json();
    options.body = data.message || options.body;
    options.data.url = data.url || options.data.url;
  }
  
  event.waitUntil(
    self.registration.showNotification(options.title, options)
  );
});

// 通知クリック処理
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked');
  
  event.notification.close();
  
  const urlToOpen = event.notification.data.url || '/terminal';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // 既存のウィンドウがあればフォーカス
        for (const client of windowClients) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        
        // なければ新しいウィンドウを開く
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// ユーティリティ関数（IndexedDB操作）
async function getPendingTransactions() {
  // IndexedDB実装は簡略化
  return [];
}

async function removePendingTransaction(id) {
  // IndexedDB実装は簡略化
  console.log('Removed pending transaction:', id);
}