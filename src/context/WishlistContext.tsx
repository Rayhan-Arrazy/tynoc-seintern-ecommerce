'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { WishlistItem, Product } from '@/types';

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
}

interface WishlistContextType {
  state: WishlistState;
  addItem: (product: Product) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WishlistState>({
    items: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const res = await fetch('/api/wishlist');
      if (!res.ok) throw new Error('Failed to fetch wishlist');
      const data = await res.json();
      setState((prev) => ({ ...prev, items: data.data ?? [], loading: false }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'An error occurred',
      }));
    }
  };

  const addItem = useCallback(async (product: Product) => {
    try {
      setState((prev) => ({ ...prev, error: null }));
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      });
      if (!res.ok) throw new Error('Failed to add item to wishlist');
      const data = await res.json();
      setState((prev) => {
        if (prev.items.some((item) => item.productId === product.id)) {
          return prev;
        }
        return { ...prev, items: [...prev.items, data.data] };
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'An error occurred',
      }));
    }
  }, []);

  const removeItem = useCallback(async (productId: string) => {
    try {
      setState((prev) => ({ ...prev, error: null }));
      const res = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to remove item from wishlist');
      setState((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.productId !== productId),
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'An error occurred',
      }));
    }
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => {
      return state.items.some((item) => item.productId === productId);
    },
    [state.items]
  );

  return (
    <WishlistContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
