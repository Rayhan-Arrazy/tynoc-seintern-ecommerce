import { supabase } from '@/lib/db/supabase';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import type { ApiResponse, User } from '@/types';

// Admin user IDs from seed data
const ADMIN_USER_IDS = ['660e8400-e29b-41d4-a716-446655440099'];

export async function POST(
  request: NextRequest
): Promise<Response> {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }
    if (!password || typeof password !== 'string') {
      return NextResponse.json({ success: false, error: 'Password is required' }, { status: 400 });
    }

    // Query Supabase directly
    const { data: userData, error } = await (supabase as any)
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error || !userData) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, userData.password);
    if (!isValid) {
      if (userData.password !== password) {
        return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
      }
    }

    const user: User = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar || '',
      createdAt: userData.created_at || userData.createdAt,
    };

    // Create response with session cookie
    const response = NextResponse.json({ success: true, data: user, message: 'Login successful' }, { status: 200 });
    
    // Set custom session cookie for middleware (7 days)
    const sessionData = {
      userId: user.id,
      email: user.email,
      isAdmin: ADMIN_USER_IDS.includes(user.id),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    
    response.cookies.set('tynoc_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Failed to login' }, { status: 500 });
  }
}