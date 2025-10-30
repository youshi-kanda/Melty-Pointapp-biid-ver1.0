import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import UserLayout from '@/components/user/Layout';
import { Heart, Search, MapPin, Star, Phone, Globe, Filter, Navigation, Zap, Cigarette, AlertCircle } from 'lucide-react';

// Google Maps APIキー（環境変数から取得、なければデモ用のキー）
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8';

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    // Google Maps APIスクリプトをロード
    const loadGoogleMapsScript = () => {
      if (typeof window.google !== 'undefined') {
        initMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      script.onerror = () => {
        setMapError('Google Mapsの読み込みに失敗しました。APIキーの設定を確認してください。');
      };
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current) return;

      try {
        // 大阪ミナミ（心斎橋）の座標
        const center = { lat: 34.6718, lng: 135.5023 };

        const map = new google.maps.Map(mapRef.current, {
          center: center,
          zoom: 15,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ],
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });

        mapInstanceRef.current = map;

        // サンプル店舗マーカー
        const stores = [
          { name: 'オーガニック カフェ リーフ', position: { lat: 34.6728, lng: 135.5033 } },
          { name: 'ナチュラル ビューティー ガーデン', position: { lat: 34.6708, lng: 135.5013 } },
          { name: 'エコ フレンドリー ストア', position: { lat: 34.6738, lng: 135.5043 } },
          { name: 'アロマテラピー ライフ', position: { lat: 34.6698, lng: 135.5003 } },
          { name: 'ヘルシー ライフスタイル カフェ', position: { lat: 34.6748, lng: 135.5053 } },
        ];

        stores.forEach(store => {
          const marker = new google.maps.Marker({
            position: store.position,
            map: map,
            title: store.name,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
                  <path fill="#EC4899" d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24c0-8.837-7.163-16-16-16z"/>
                  <circle cx="16" cy="16" r="6" fill="white"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(32, 40),
              anchor: new google.maps.Point(16, 40),
            }
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `<div style="padding: 8px; font-weight: bold; color: #1f2937;">${store.name}</div>`
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
        });
      } catch (error) {
        console.error('Map initialization error:', error);
        setMapError('マップの初期化に失敗しました。Google Maps APIの請求設定を確認してください。');
      }
    };

    loadGoogleMapsScript();
  }, []);

  return (
    <>
      <Head>
        <title>店舗マップ - Melty+</title>
      </Head>
      <UserLayout title="店舗マップ - Melty+">
      <div className="px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
            {/* Left Sidebar - Search Filters (Desktop only) */}
            <div className="hidden md:block md:col-span-1 lg:col-span-1 space-y-4 md:order-1">
              <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200">
                <h3 className="font-bold text-xl text-gray-800 mb-6 flex items-center space-x-2">
                  <Filter className="w-6 h-6 text-pink-600" />
                  <span>検索条件</span>
                </h3>

                {/* Get Location Button */}
                <div className="mb-6">
                  <button className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105">
                    <Navigation className="w-5 h-5" />
                    <span>現在地を取得</span>
                  </button>
                </div>

                {/* Search Input */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="店舗名で検索"
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-gray-50 transition-all duration-200 text-gray-800 placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Search Range */}
                <div className="mb-6">
                  <label className="block text-base font-bold text-gray-800 mb-3">検索範囲</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="px-4 py-3 text-sm rounded-2xl border transition-all duration-200 font-bold shadow-sm bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:shadow-md">500m</button>
                    <button className="px-4 py-3 text-sm rounded-2xl border transition-all duration-200 font-bold shadow-sm bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:shadow-md">1km</button>
                    <button className="px-4 py-3 text-sm rounded-2xl border transition-all duration-200 font-bold shadow-lg bg-pink-500 text-white border-pink-500 transform scale-105">3km</button>
                    <button className="px-4 py-3 text-sm rounded-2xl border transition-all duration-200 font-bold shadow-sm bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:shadow-md">5km</button>
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <label className="block text-base font-bold text-gray-800 mb-3">カテゴリー</label>
                  <div className="space-y-1">
                    {['レストラン・飲食店', '小売・ショッピング', 'サービス・美容', 'エンターテイメント', '医療・健康', '教育・学習'].map((category) => (
                      <label key={category} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200">
                        <input type="checkbox" className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500 focus:ring-offset-0 bg-white" />
                        <span className="text-sm text-gray-700 font-medium">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Additional Filters */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-base font-bold text-gray-800 mb-3">評価</label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-gray-50 transition-all duration-200 text-gray-800 font-medium">
                      <option>指定なし</option>
                      <option>★4.0以上</option>
                      <option>★3.0以上</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-base font-bold text-gray-800 mb-3">営業状況</label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-gray-50 transition-all duration-200 text-gray-800 font-medium">
                      <option>指定なし</option>
                      <option>営業中</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-base font-bold text-gray-800 mb-3">価格帯</label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-gray-50 transition-all duration-200 text-gray-800 font-medium">
                      <option>指定なし</option>
                      <option>~1000円</option>
                      <option>1000~3000円</option>
                      <option>3000円~</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-base font-bold text-gray-800 mb-3">アクセシビリティ</label>
                    <div className="space-y-1">
                      {['車椅子対応', '駐車場あり', 'Wi-Fi完備', '喫煙可', '充電ポートあり'].map((feature) => (
                        <label key={feature} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200">
                          <input type="checkbox" className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500 focus:ring-offset-0 bg-white" />
                          <span className="text-sm text-gray-700 font-medium">{feature}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Map and Store List */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-6 md:order-2 order-1">
              {/* Map Container */}
              <div className="bg-gradient-to-br from-white via-pink-50 to-rose-50 rounded-3xl shadow-xl border border-pink-200">
                <div className="p-4 border-b border-pink-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-pink-800 flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-pink-600" />
                      <span>近くの加盟店</span>
                    </h3>
                    <span className="text-xs text-pink-600 bg-pink-100 px-3 py-1.5 rounded-full font-medium shadow-sm">5件</span>
                  </div>
                </div>
                <div className="h-64 sm:h-72 md:h-80 lg:h-96 p-2 relative">
                  {mapError ? (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                      <div className="text-center p-6">
                        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                        <p className="text-gray-700 font-bold mb-2">マップ機能準備中</p>
                        <p className="text-sm text-gray-600 mb-3">{mapError}</p>
                        <p className="text-xs text-gray-500">
                          Google Maps API の請求設定を有効にしてください
                          <br />
                          <a 
                            href="https://console.cloud.google.com/google/maps-apis/start" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-pink-600 hover:text-pink-700 underline mt-2 inline-block"
                          >
                            Google Cloud Console →
                          </a>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: '12px', overflow: 'hidden', position: 'relative' }} />
                  )}
                </div>
              </div>

              {/* Store List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xl text-gray-800">店舗一覧</h3>
                  <span className="text-sm text-pink-600 bg-pink-100 px-4 py-2 rounded-full font-medium shadow-sm">5件</span>
                </div>

                <div className="space-y-4">
                  {/* Store Card 1 */}
                  <StoreCard
                    name="オーガニック カフェ リーフ"
                    category="レストラン・飲食店"
                    rating={4.8}
                    reviews={203}
                    distance="0.4km"
                    address="東京都世田谷区三軒茶屋1-2-3"
                    points="450pt (9%還元)"
                    status="営業中"
                    features={['充電可']}
                    imageId="2001"
                  />

                  {/* Store Card 2 */}
                  <StoreCard
                    name="ナチュラル ビューティー ガーデン"
                    category="サービス・美容"
                    rating={4.9}
                    reviews={156}
                    distance="0.6km"
                    address="東京都世田谷区下北沢2-4-5"
                    points="680pt (12%還元)"
                    status="営業中"
                    features={['充電可']}
                    imageId="202"
                  />

                  {/* Store Card 3 */}
                  <StoreCard
                    name="エコ フレンドリー ストア"
                    category="小売・ショッピング"
                    rating={4.7}
                    reviews={89}
                    distance="0.9km"
                    address="東京都世田谷区代沢1-6-7"
                    points="320pt (7%還元)"
                    status="営業中"
                    features={[]}
                    imageId="303"
                  />

                  {/* Store Card 4 */}
                  <StoreCard
                    name="アロマテラピー ライフ"
                    category="サービス・美容"
                    rating={4.6}
                    reviews={124}
                    distance="1.1km"
                    address="東京都世田谷区太子堂3-4-5"
                    points="410pt (8%還元)"
                    status="間もなく閉店"
                    features={['喫煙可', '充電可']}
                    imageId="204"
                  />

                  {/* Store Card 5 */}
                  <StoreCard
                    name="ヘルシー ライフスタイル カフェ"
                    category="レストラン・飲食店"
                    rating={4.5}
                    reviews={98}
                    distance="1.3km"
                    address="東京都世田谷区池尻2-6-8"
                    points="290pt (6%還元)"
                    status="営業中"
                    features={[]}
                    imageId="3005"
                  />
                </div>
              </div>
            </div>
          </div>
      </div>
      </UserLayout>
    </>
  );
}interface StoreCardProps {
  name: string;
  category: string;
  rating: number;
  reviews: number;
  distance: string;
  address: string;
  points: string;
  status: string;
  features: string[];
  imageId: string;
}

function StoreCard({ name, category, rating, reviews, distance, address, points, status, features, imageId }: StoreCardProps) {
  const isOpen = status === '営業中';
  const isClosingSoon = status === '間もなく閉店';

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-all duration-200 cursor-pointer">
      <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1 min-w-0 w-full sm:w-auto">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-bold text-gray-900 text-base mb-1">{name}</h4>
              <p className="text-sm text-gray-600">{category}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-800">{rating}</span>
                <span className="text-sm text-gray-600">({reviews})</span>
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{distance}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center space-x-2 sm:space-x-3 flex-wrap">
            <span className={`text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 sm:py-2 rounded-full shadow-sm ${
              isOpen ? 'bg-gradient-to-r from-pink-100 to-rose-200 text-pink-800' :
              isClosingSoon ? 'bg-gradient-to-r from-rose-100 to-pink-200 text-rose-800' :
              'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800'
            }`}>
              {status}
            </span>
            {features.map((feature) => {
              const Icon = feature === '充電可' ? Zap : Cigarette;
              const colorClass = feature === '充電可' ? 
                'bg-gradient-to-r from-pink-100 to-rose-200 text-pink-700' : 
                'bg-gradient-to-r from-rose-100 to-pink-200 text-rose-700';
              return (
                <div key={feature} className={`flex items-center space-x-1 px-2 sm:px-3 py-1 sm:py-2 rounded-full shadow-sm ${colorClass}`}>
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs font-bold">{feature}</span>
                </div>
              );
            })}
          </div>

          <p className="text-sm text-gray-600 mt-2">{address}</p>

          <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <span className="text-xs sm:text-sm font-bold text-pink-700 bg-pink-100 px-2 sm:px-3 py-1 rounded-full">
              獲得ポイント: {points}
            </span>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors" title="お気に入りに追加">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-32 md:w-40 h-32 sm:h-32 md:h-40 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0 relative">
          <Image 
            src={`https://picsum.photos/160/160?random=${imageId}`}
            alt={name}
            width={160}
            height={160}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-white text-lg font-bold opacity-30 select-none transform rotate-12">SAMPLE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
