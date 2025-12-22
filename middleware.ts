import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl;
  const { pathname } = url;

  // 開発環境かつlocalhostの場合は、サブドメインのシミュレーションが必要な場合があるが、
  // ここでは本番環境のサブドメイン構成を主として実装する

  // 静的ファイルやAPIはスキップ
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // --- サブドメインルーティング ---

  // 店舗管理画面 (store.*)
  if (hostname.startsWith('store.') || hostname.startsWith('biid-store.')) {
    // 既に /store で始まっている場合はそのまま
    if (pathname.startsWith('/store')) {
      return NextResponse.next();
    }
    // それ以外は /store プレフィックスを付けてリライト
    // ただし、トップページへのアクセスの場合は /store/login へ
    if (pathname === '/') {
      return NextResponse.rewrite(new URL('/store/login', request.url));
    }
    return NextResponse.rewrite(new URL(`/store${pathname}`, request.url));
  }

  // 運営管理画面 (admin.*)
  if (hostname.startsWith('admin.') || hostname.startsWith('biid-admin.')) {
    if (pathname.startsWith('/admin')) {
      return NextResponse.next();
    }
    if (pathname === '/') {
      return NextResponse.rewrite(new URL('/admin/login', request.url));
    }
    return NextResponse.rewrite(new URL(`/admin${pathname}`, request.url));
  }

  // 端末画面 (terminal.*)
  if (hostname.startsWith('terminal.') || hostname.startsWith('biid-terminal.')) {
    if (pathname.startsWith('/terminal')) {
      return NextResponse.next();
    }
    if (pathname === '/') {
      return NextResponse.rewrite(new URL('/terminal/login', request.url));
    }
    return NextResponse.rewrite(new URL(`/terminal${pathname}`, request.url));
  }

  // ユーザー画面 (user.* またはその他)
  // 基本的に /user プレフィックスを付けるが、Next.jsのpagesディレクトリ構造に依存
  // ここではトップページは /user/login に飛ばす
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/user/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};