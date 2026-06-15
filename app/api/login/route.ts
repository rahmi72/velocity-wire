import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { password } = body;

  // 1. Ambil password dari .env.local
  const correctPassword = process.env.ADMIN_PASSWORD;

  if (password === correctPassword) {
    // 2. Buat Response sukses
    const response = NextResponse.json({ success: true });
    
    // 3. Set Cookie pada RESPONSE (Bukan pada request cookies)
    response.cookies.set('auth_token', 'verified', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 hari
      sameSite: 'lax' // Keamanan tambahan
    });

    return response;
  } else {
    return NextResponse.json({ success: false }, { status: 401 });
  }
}