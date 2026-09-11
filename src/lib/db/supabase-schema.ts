export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          price: number;
          originalPrice: number;
          images: Json[];
          categoryId: string;
          category: Json;
          stock: number;
          rating: number;
          reviewCount: number;
          features: Json[];
          specifications: Json;
          tags: Json[];
          isFeatured: boolean;
          isNew: boolean;
          isOnSale: boolean;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description: string;
          price: number;
          originalPrice: number;
          images?: Json[];
          categoryId: string;
          category: Json;
          stock: number;
          rating?: number;
          reviewCount?: number;
          features?: Json[];
          specifications?: Json;
          tags?: Json[];
          isFeatured?: boolean;
          isNew?: boolean;
          isOnSale?: boolean;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          price?: number;
          originalPrice?: number;
          images?: Json[];
          categoryId?: string;
          category?: Json;
          stock?: number;
          rating?: number;
          reviewCount?: number;
          features?: Json[];
          specifications?: Json;
          tags?: Json[];
          isFeatured?: boolean;
          isNew?: boolean;
          isOnSale?: boolean;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          image: string;
          productCount: number;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description: string;
          image: string;
          productCount?: number;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          image?: string;
          productCount?: number;
        };
      };
      cart: {
        Row: {
          id: string;
          productId: string;
          product: Json;
          quantity: number;
          userId: string;
          addedAt: string;
        };
        Insert: {
          id?: string;
          productId: string;
          product: Json;
          quantity: number;
          userId: string;
          addedAt?: string;
        };
        Update: {
          id?: string;
          productId?: string;
          product?: Json;
          quantity?: number;
          userId?: string;
          addedAt?: string;
        };
      };
      wishlist: {
        Row: {
          id: string;
          productId: string;
          product: Json;
          userId: string;
          addedAt: string;
        };
        Insert: {
          id?: string;
          productId: string;
          product: Json;
          userId: string;
          addedAt?: string;
        };
        Update: {
          id?: string;
          productId?: string;
          product?: Json;
          userId?: string;
          addedAt?: string;
        };
      };
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          avatar: string;
          createdAt: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          avatar: string;
          createdAt?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          avatar?: string;
          createdAt?: string;
        };
      };
    };
    Views: {};
    Functions: {};
  };
}
