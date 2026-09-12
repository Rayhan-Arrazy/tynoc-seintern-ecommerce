'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import NotificationBell from '@/components/notifications/NotificationBell';
import CategoriesDropdown from './CategoriesDropdown';

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);

  const { state: cartState } = useCart();
  const { state: wishlistState } = useWishlist();
  const { state: authState } = useAuth();

  const cartCount = cartState.items?.length ?? 0;
  const wishlistCount = wishlistState.items?.length ?? 0;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target as Node)) {
        setCategoriesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600 shrink-0">
            Tynoc
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 ml-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Products
            </Link>
            <div className="relative" ref={categoriesRef}>
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>
              {categoriesOpen && <CategoriesDropdown onClose={() => setCategoriesOpen(false)} />}
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <Link href="/wishlist" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <NotificationBell />

            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link href="/account" className="hidden sm:flex items-center gap-2 p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <User className="w-5 h-5" />
              {authState.user ? (
                <span className="text-sm font-medium">{authState.user.name.split(' ')[0]}</span>
              ) : (
                <span className="text-sm font-medium">Login</span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            <form onSubmit={handleSearch} className="sm:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>

            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
            >
              Products
            </Link>
            <Link
              href="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
            >
              Categories
            </Link>
            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
            >
              {authState.user ? authState.user.name : 'Account'}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
