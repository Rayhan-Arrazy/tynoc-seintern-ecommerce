import { supabase } from '@/lib/db/supabase';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Admin user IDs from seed data
const ADMIN_USER_IDS = ['660e8400-e29b-41d4-a716-446655440099'];

interface SessionData {
  userId: string;
  email: string;
  isAdmin: boolean;
  expiresAt: number;
}

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get('tynoc_session');
  if (!cookie?.value) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  }

  let session: SessionData;
  try {
    session = JSON.parse(cookie.value) as SessionData;
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 });
  }

  if (session.expiresAt < Date.now()) {
    return NextResponse.json({ success: false, error: 'Session expired' }, { status: 401 });
  }

  const { data: user, error } = await (supabase as any)
    .from('users')
    .select('id, name, email, avatar, created_at')
    .eq('id', session.userId)
    .single();

  if (error || !user) {
    return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: {
      ...user,
      isAdmin: ADMIN_USER_IDS.includes(user.id),
    },
  });
}
