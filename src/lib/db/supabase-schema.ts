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
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image: string | null;
          productcount: number;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          slug: string;
          description?: string | null;
          image?: string | null;
          productcount?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image?: string | null;
          productcount?: number;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          price: number;
          originalprice: number | null;
          images: Json;
          categoryid: string;
          category: Json;
          stock: number;
          rating: number | null;
          reviewcount: number;
          features: Json;
          specifications: Json;
          tags: Json;
          isfeatured: boolean;
          isnew: boolean;
          isonsale: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          slug: string;
          description?: string | null;
          price: number;
          originalprice?: number | null;
          images?: Json;
          categoryid: string;
          category?: Json;
          stock?: number;
          rating?: number | null;
          reviewcount?: number;
          features?: Json;
          specifications?: Json;
          tags?: Json;
          isfeatured?: boolean;
          isnew?: boolean;
          isonsale?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          price?: number;
          originalprice?: number | null;
          images?: Json;
          categoryid?: string;
          category?: Json;
          stock?: number;
          rating?: number | null;
          reviewcount?: number;
          features?: Json;
          specifications?: Json;
          tags?: Json;
          isfeatured?: boolean;
          isnew?: boolean;
          isonsale?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          password: string | null;
          avatar: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          password?: string | null;
          avatar?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          password?: string | null;
          avatar?: string | null;
          created_at?: string;
        };
      };
      cart: {
        Row: {
          id: string;
          productid: string;
          product: Json;
          quantity: number;
          userid: string;
          added_at: string;
        };
        Insert: {
          id?: string;
          productid: string;
          product: Json;
          quantity?: number;
          userid: string;
          added_at?: string;
        };
        Update: {
          id?: string;
          productid?: string;
          product?: Json;
          quantity?: number;
          userid?: string;
          added_at?: string;
        };
      };
      wishlist: {
        Row: {
          id: string;
          productid: string;
          product: Json;
          userid: string;
          added_at: string;
        };
        Insert: {
          id?: string;
          productid: string;
          product: Json;
          userid: string;
          added_at?: string;
        };
        Update: {
          id?: string;
          productid?: string;
          product?: Json;
          userid?: string;
          added_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          userid: string;
          items: Json;
          subtotal: number;
          shipping: number;
          tax: number;
          total: number;
          status: string;
          shipping_address: Json | null;
          payment_method: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          userid: string;
          items?: Json;
          subtotal?: number;
          shipping?: number;
          tax?: number;
          total?: number;
          status?: string;
          shipping_address?: Json | null;
          payment_method?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          userid?: string;
          items?: Json;
          subtotal?: number;
          shipping?: number;
          tax?: number;
          total?: number;
          status?: string;
          shipping_address?: Json | null;
          payment_method?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          userid: string;
          title: string;
          message: string | null;
          type: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          userid: string;
          title: string;
          message?: string | null;
          type?: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          userid?: string;
          title?: string;
          message?: string | null;
          type?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
  };
}
