import { supabase } from '@/lib/db/supabase';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { createNotification } from '@/lib/db/notification-operations';
import type { ApiResponse, User } from '@/types';

// Admin user IDs from seed data
const ADMIN_USER_IDS = ['660e8400-e29b-41d4-a716-446655440099'];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(
  request: NextRequest
): Promise<Response> {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ success: false, error: 'Valid email is required' }, { status: 400 });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Check if email already exists
    const { data: existing } = await (supabase as any)
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (existing) {
      return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newId = uuidv4();

    const userData = {
      id: newId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      avatar: `https://picsum.photos/seed/${uuidv4().slice(0, 8)}/100/100`,
      created_at: new Date().toISOString(),
      password: hashedPassword,
    };

    const { error } = await (supabase as any)
      .from('users')
      .insert(userData);

    if (error) throw error;

    const user: User = {
      id: newId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      avatar: userData.avatar,
      createdAt: userData.created_at,
    };

    // Create welcome notification
    await createNotification({
      userId: newId,
      type: 'system',
      title: 'Welcome to Tynoc!',
      message: 'Thanks for joining. Explore our latest products and exclusive deals.',
    });

    // Create response with session cookie
    const response = NextResponse.json({ success: true, data: user, message: 'Account created successfully' }, { status: 201 });
    
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
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Failed to create account' }, { status: 500 });
  }
}