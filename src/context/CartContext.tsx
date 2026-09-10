'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

interface CartContextType {
  state: CartState;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getSubtotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>({
    items: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const res = await fetch('/api/cart');
      if (!res.ok) throw new Error('Failed to fetch cart');
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

  const addItem = useCallback(async (product: Product, quantity = 1) => {
    try {
      setState((prev) => ({ ...prev, error: null }));
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, product, quantity }),
      });
      if (!res.ok) throw new Error('Failed to add item to cart');
      const data = await res.json();
      setState((prev) => {
        const existingIndex = prev.items.findIndex(
          (item) => item.productId === product.id
        );
        if (existingIndex > -1) {
          const updated = [...prev.items];
          updated[existingIndex] = data.data;
          return { ...prev, items: updated };
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
      const res = await fetch(`/api/cart?productId=${productId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to remove item from cart');
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

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    try {
      setState((prev) => ({ ...prev, error: null }));
      const res = await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!res.ok) throw new Error('Failed to update quantity');
      const data = await res.json();
      setState((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.productId === productId ? data.data : item
        ),
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'An error occurred',
      }));
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, error: null }));
      const res = await fetch('/api/cart', { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to clear cart');
      setState((prev) => ({ ...prev, items: [] }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'An error occurred',
      }));
    }
  }, []);

  const getSubtotal = useCallback(() => {
    return state.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }, [state.items]);

  const getItemCount = useCallback(() => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  }, [state.items]);

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getSubtotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
