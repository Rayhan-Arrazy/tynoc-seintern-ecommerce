import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Admin user IDs from seed data
const ADMIN_USER_IDS = ['660e8400-e29b-41d4-a716-446655440099'];
const ADMIN_EMAILS = ['admin@example.com'];

interface SessionData {
  userId: string;
  email: string;
  isAdmin: boolean;
  expiresAt: number;
}

function getSessionFromCookie(request: NextRequest): SessionData | null {
  const cookie = request.cookies.get('tynoc_session');
  if (!cookie?.value) return null;
  
  try {
    const session = JSON.parse(cookie.value) as SessionData;
    if (session.expiresAt < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  const session = getSessionFromCookie(request);

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isAdminApi = request.nextUrl.pathname.startsWith('/api/admin');

  if (isAdminRoute || isAdminApi) {
    if (!session?.userId) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user is admin
    const isAdmin = ADMIN_USER_IDS.includes(session.userId) || 
                    ADMIN_EMAILS.includes(session.email);

    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};