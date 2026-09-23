import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Admin user IDs from seed data
const ADMIN_USER_IDS = ['660e8400-e29b-41d4-a716-446655440099'];

export async function GET(request: NextRequest) {
  const response = NextResponse.next();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  }

  // Query without is_admin column (may not exist yet)
  const { data: user } = await (supabase as any)
    .from('users')
    .select('id, name, email, avatar, created_at')
    .eq('id', session.user.id)
    .single();

  if (!user) {
    return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
  }

  // Add is_admin flag based on hardcoded list
  const userWithAdmin = {
    ...user,
    is_admin: ADMIN_USER_IDS.includes(user.id),
  };

  return NextResponse.json({ success: true, data: userWithAdmin });
}