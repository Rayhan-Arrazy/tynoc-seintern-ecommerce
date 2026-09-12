import { supabase } from "./supabase";
import type {
  Product,
  Category,
  CartItem,
  WishlistItem,
  User,
  UserWithPassword,
  SearchFilters,
  PaginatedResponse,
} from "@/types";

// ─── Products ────────────────────────────────────────────────────────────────

export async function getAllProducts(
  filters?: SearchFilters
): Promise<PaginatedResponse<Product>> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabase.from("products").select("*", { count: "exact" });

    if (filters?.query) {
      const q = `%${filters.query}%`;
      query = query.or(`name.ilike.${q},description.ilike.${q}`);
    }

    if (filters?.category) {
      query = query.eq("categoryid", filters.category);
    }

    if (filters?.minPrice !== undefined) {
      query = query.gte("price", filters.minPrice);
    }

    if (filters?.maxPrice !== undefined) {
      query = query.lte("price", filters.maxPrice);
    }

    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case "newest":
          query = query.order("created_at", { ascending: false });
          break;
        case "price-asc":
          query = query.order("price", { ascending: true });
          break;
        case "price-desc":
          query = query.order("price", { ascending: false });
          break;
        case "rating":
          query = query.order("rating", { ascending: false });
          break;
      }
    } else {
      query = query.order("created_at", { ascending: false });
    }

    query = query.range(start, end);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: (data as Product[]) || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return data as Product;
  } catch (error) {
    console.error("Error fetching product by id:", error);
    return null;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;

    return data as Product;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}

export async function getProductsByCategory(
  categoryId: string,
  limit?: number
): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("categoryid", categoryId)
      .limit(limit || 50);

    if (error) throw error;

    return (data as Product[]) || [];
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("isfeatured", true);

    if (error) throw error;

    return (data as Product[]) || [];
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

export async function getNewProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("isnew", true);

    if (error) throw error;

    return (data as Product[]) || [];
  } catch (error) {
    console.error("Error fetching new products:", error);
    return [];
  }
}

export async function getSaleProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("isonsale", true);

    if (error) throw error;

    return (data as Product[]) || [];
  } catch (error) {
    console.error("Error fetching sale products:", error);
    return [];
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const q = `%${query}%`;
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .or(`name.ilike.${q},description.ilike.${q}`);

    if (error) throw error;

    return (data as Product[]) || [];
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
}

export async function createProduct(product: Product): Promise<Product> {
  try {
    const { data, error } = await supabase
      .from("products")
      .insert(product as any)
      .select()
      .single();

    if (error) throw error;

    return data as Product;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product> {
  try {
    const { data, error } = await (supabase
      .from("products") as any)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data as Product;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase.from("categories").select("*");

    if (error) throw error;

    return (data as Category[]) || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return data as Category;
  } catch (error) {
    console.error("Error fetching category by id:", error);
    return null;
  }
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;

    return data as Category;
  } catch (error) {
    console.error("Error fetching category by slug:", error);
    return null;
  }
}

export async function createCategory(category: Category): Promise<Category> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .insert(category as any)
      .select()
      .single();

    if (error) throw error;

    return data as Category;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

// ─── Cart ────────────────────────────────────────────────────────────────────

export async function getCartItems(userId: string): Promise<CartItem[]> {
  try {
    const { data, error } = await supabase
      .from("cart")
      .select("*")
      .eq("userid", userId);

    if (error) throw error;

    return (data as CartItem[]) || [];
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return [];
  }
}

export async function addToCart(item: CartItem): Promise<CartItem> {
  try {
    const { data: existing } = await supabase
      .from("cart")
      .select("*")
      .eq("userid", item.userId)
      .eq("productid", item.productId)
      .single();

    if (existing) {
      const existingItem = existing as CartItem;
      const { data, error } = await (supabase
        .from("cart") as any)
        .update({ quantity: existingItem.quantity + item.quantity })
        .eq("id", existingItem.id)
        .select()
        .single();

      if (error) throw error;

      return data as CartItem;
    }

    const { data, error } = await supabase
      .from("cart")
      .insert(item as any)
      .select()
      .single();

    if (error) throw error;

    return data as CartItem;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
}

export async function updateCartItem(
  userId: string,
  productId: string,
  quantity: number
): Promise<CartItem> {
  try {
    const { data: existing, error: findError } = await supabase
      .from("cart")
      .select("*")
      .eq("userid", userId)
      .eq("productid", productId)
      .single();

    if (findError || !existing) {
      throw new Error("Cart item not found");
    }

    const existingItem = existing as CartItem;

    const { data, error } = await (supabase
      .from("cart") as any)
      .update({ quantity })
      .eq("id", existingItem.id)
      .select()
      .single();

    if (error) throw error;

    return data as CartItem;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
}

export async function removeFromCart(
  userId: string,
  productId: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from("cart")
      .delete()
      .eq("userid", userId)
      .eq("productid", productId);

    if (error) throw error;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
}

export async function clearCart(userId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from("cart")
      .delete()
      .eq("userid", userId);

    if (error) throw error;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
}

// ─── Wishlist ────────────────────────────────────────────────────────────────

export async function getWishlistItems(
  userId: string
): Promise<WishlistItem[]> {
  try {
    const { data, error } = await supabase
      .from("wishlist")
      .select("*")
      .eq("userid", userId);

    if (error) throw error;

    return (data as WishlistItem[]) || [];
  } catch (error) {
    console.error("Error fetching wishlist items:", error);
    return [];
  }
}

export async function addToWishlist(
  item: WishlistItem
): Promise<WishlistItem> {
  try {
    const { data: existing } = await supabase
      .from("wishlist")
      .select("*")
      .eq("userid", item.userId)
      .eq("productid", item.productId)
      .single();

    if (existing) {
      return existing as WishlistItem;
    }

    const { data, error } = await supabase
      .from("wishlist")
      .insert(item as any)
      .select()
      .single();

    if (error) throw error;

    return data as WishlistItem;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
}

export async function removeFromWishlist(
  userId: string,
  productId: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("userid", userId)
      .eq("productid", productId);

    if (error) throw error;
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw error;
  }
}

// ─── Users ───────────────────────────────────────────────────────────────────

export async function getUserById(id: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return data as User;
  } catch (error) {
    console.error("Error fetching user by id:", error);
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<UserWithPassword | null> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email.toLowerCase())
      .single();

    if (error) throw error;

    return data as UserWithPassword;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
}

export async function createUser(user: UserWithPassword): Promise<User> {
  try {
    const { data, error } = await supabase
      .from("users")
      .insert(user as any)
      .select()
      .single();

    if (error) throw error;

    return data as User;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}
