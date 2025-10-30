// プロフィールAPI関連の関数

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://biid-user.fly.dev'
  : 'http://localhost:8000';

// 認証トークンを取得
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

// 業種マスターデータの型定義
export interface Industry {
  id: number;
  code: string;
  name: string;
  category: string;
  display_order: number;
}

// ユーザープロフィールの型定義
export interface UserProfile {
  username: string;
  email: string;
  phone: string | null;
  phone_verified: boolean;
  work_region: string;
  industry: string;
  employment_type: string;
  melty_sync_enabled: boolean;
  melty_linked_at: string | null;
}

// プロフィール更新リクエストの型定義
export interface UpdateProfileRequest {
  phone?: string;
  work_region?: string;
  industry?: string;
  employment_type?: string;
}

// 業種一覧を取得
export async function getIndustries(): Promise<Industry[]> {
  const response = await fetch(`${API_BASE_URL}/api/industries/`);
  
  if (!response.ok) {
    throw new Error('業種データの取得に失敗しました');
  }
  
  return await response.json();
}

// ユーザープロフィールを取得
export async function getUserProfile(): Promise<UserProfile> {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('認証が必要です');
  }
  
  const response = await fetch(`${API_BASE_URL}/api/user/profile/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('プロフィールの取得に失敗しました');
  }
  
  const result = await response.json();
  return result.data;
}

// ユーザープロフィールを更新
export async function updateUserProfile(data: UpdateProfileRequest): Promise<UserProfile> {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('認証が必要です');
  }
  
  const response = await fetch(`${API_BASE_URL}/api/user/profile/`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'プロフィールの更新に失敗しました');
  }
  
  const result = await response.json();
  return result.data;
}
