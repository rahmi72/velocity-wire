import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Cek apakah user mau masuk ke /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    // Cek apakah sudah ada cookie 'auth_token'
    const authToken = request.cookies.get('auth_token');

    // Jika belum ada cookie, tendang ke halaman login
    if (!authToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Tentukan path mana yang dilindungi middleware ini
export const config = {
  matcher: '/admin/:path*',
};