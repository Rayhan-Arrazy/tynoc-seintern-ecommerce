'use client';

import { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  userid: string;
  productid: string;
  quantity: number;
  added_at: string;
}

interface WishlistItem {
  id: string;
  userid: string;
  productid: string;
  added_at: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  brand: string;
}

export default function AdminCartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'cart' | 'wishlist'>('cart');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [cartRes, wishRes, prodRes] = await Promise.all([
        fetch('/api/admin/cart'),
        fetch('/api/admin/wishlist'),
        fetch('/api/products'),
      ]);
      const cartJson = await cartRes.json();
      const wishJson = await wishRes.json();
      const prodJson = await prodRes.json();

      if (cartJson.success) setCartItems(cartJson.data);
      if (wishJson.success) setWishlistItems(wishJson.data);
      if (prodJson.success) {
        const map: Record<string, Product> = {};
        prodJson.data.forEach((p: Product) => { map[p.id] = p; });
        setProducts(map);
      }
    } catch { /* empty */ }
    setLoading(false);
  }

  function getProduct(pid: string) {
    return products[pid] || null;
  }

  const currentItems = tab === 'cart' ? cartItems : wishlistItems;

  const grouped = currentItems.reduce<Record<string, Array<CartItem | WishlistItem>>>((acc, item) => {
    if (!acc[item.userid]) acc[item.userid] = [];
    acc[item.userid].push(item);
    return acc;
  }, {});

  const filteredUserIds = search
    ? Object.keys(grouped).filter((uid) => uid.toLowerCase().includes(search.toLowerCase()))
    : Object.keys(grouped);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Cart &amp; Wishlist</h2>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setTab('cart')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === 'cart' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
        >
          🛍️ Cart ({cartItems.length})
        </button>
        <button
          onClick={() => setTab('wishlist')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === 'wishlist' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
        >
          💝 Wishlist ({wishlistItems.length})
        </button>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Filter by user ID..."
        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {loading ? (
        <div className="p-8 text-center text-sm text-gray-500 bg-white rounded-xl border border-gray-200">Loading...</div>
      ) : filteredUserIds.length === 0 ? (
        <div className="p-8 text-center text-sm text-gray-500 bg-white rounded-xl border border-gray-200">
          {tab === 'cart' ? 'Cart is empty.' : 'Wishlist is empty.'}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUserIds.map((userId) => (
            <div key={userId} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                <span className="text-xs font-mono text-gray-600">User: {userId.slice(0, 12)}...</span>
                <span className="ml-3 text-xs text-gray-500">({grouped[userId].length} item{grouped[userId].length > 1 ? 's' : ''})</span>
              </div>
              <div className="divide-y divide-gray-100">
                {grouped[userId].map((item) => {
                  const prod = getProduct(item.productid);
                  return (
                    <div key={item.id} className="px-5 py-3 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                        {prod?.image ? (
                          <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">📦</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{prod?.name || item.productid.slice(0, 8)}</p>
                        <p className="text-xs text-gray-500">{prod?.brand || '—'}</p>
                      </div>
                      {tab === 'cart' && (
                        <span className="text-sm text-gray-600">Qty: {(item as CartItem).quantity}</span>
                      )}
                      {prod?.price && (
                        <span className="text-sm font-semibold text-gray-900">${prod.price}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
