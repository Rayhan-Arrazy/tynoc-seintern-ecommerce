import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(_request: NextRequest): Promise<Response> {
  const response = NextResponse.json({ success: true, message: 'Logged out' });
  
  // Clear session cookie
  response.cookies.set('tynoc_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  return response;
}