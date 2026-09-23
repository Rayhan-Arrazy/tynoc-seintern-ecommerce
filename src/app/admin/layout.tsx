'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Products', icon: '📦' },
  { href: '/admin/categories', label: 'Categories', icon: '🏷️' },
  { href: '/admin/orders', label: 'Orders', icon: '🛒' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
  { href: '/admin/cart', label: 'Cart & Wishlist', icon: '💝' },
];

// Admin user IDs from seed data
const ADMIN_USER_IDS = ['660e8400-e29b-41d4-a716-446655440099'];

interface SessionData {
  userId: string;
  email: string;
  isAdmin: boolean;
  expiresAt: number;
}

function getSessionFromCookie(): SessionData | null {
  try {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('tynoc_session='));
    if (!cookie) return null;
    const value = decodeURIComponent(cookie.split('=')[1]);
    const session = JSON.parse(value) as SessionData;
    if (session.expiresAt < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  function checkAdminAccess() {
    const session = getSessionFromCookie();
    if (session?.userId && ADMIN_USER_IDS.includes(session.userId)) {
      setIsAuthorized(true);
    } else {
      router.push('/');
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-800">
          <span className="text-xl font-bold">Tynoc Admin</span>
        </div>
        <nav className="mt-4 px-3 space-y-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Store
          </Link>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
