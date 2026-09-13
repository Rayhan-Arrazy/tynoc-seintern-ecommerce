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

function mapProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: Number(row.price),
    originalPrice: Number(row.originalprice),
    images: row.images,
    categoryId: row.categoryid,
    category: row.category,
    stock: row.stock,
    rating: Number(row.rating),
    reviewCount: row.reviewcount,
    features: row.features,
    specifications: row.specifications,
    tags: row.tags,
    isFeatured: row.isfeatured,
    isNew: row.isnew,
    isOnSale: row.isonsale,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

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
      data: (data as any[]).map(mapProduct),
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

    return mapProduct(data);
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

    return mapProduct(data);
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

    return (data as any[]).map(mapProduct);
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

    return (data as any[]).map(mapProduct);
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

    return (data as any[]).map(mapProduct);
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

    return (data as any[]).map(mapProduct);
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

    return (data as any[]).map(mapProduct);
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
}

export async function createProduct(product: Product): Promise<Product> {
  try {
    const { data, error } = await (supabase
      .from("products") as any)
      .insert({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        originalprice: product.originalPrice,
        images: product.images,
        categoryid: product.categoryId,
        category: product.category,
        stock: product.stock,
        rating: product.rating,
        reviewcount: product.reviewCount,
        features: product.features,
        specifications: product.specifications,
        tags: product.tags,
        isfeatured: product.isFeatured,
        isnew: product.isNew,
        isonsale: product.isOnSale,
      })
      .select()
      .single();

    if (error) throw error;

    return mapProduct(data);
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
    const dbUpdates: Record<string, any> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.originalPrice !== undefined) dbUpdates.originalprice = updates.originalPrice;
    if (updates.images !== undefined) dbUpdates.images = updates.images;
    if (updates.categoryId !== undefined) dbUpdates.categoryid = updates.categoryId;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.stock !== undefined) dbUpdates.stock = updates.stock;
    if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
    if (updates.reviewCount !== undefined) dbUpdates.reviewcount = updates.reviewCount;
    if (updates.features !== undefined) dbUpdates.features = updates.features;
    if (updates.specifications !== undefined) dbUpdates.specifications = updates.specifications;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
    if (updates.isFeatured !== undefined) dbUpdates.isfeatured = updates.isFeatured;
    if (updates.isNew !== undefined) dbUpdates.isnew = updates.isNew;
    if (updates.isOnSale !== undefined) dbUpdates.isonsale = updates.isOnSale;

    const { data, error } = await (supabase
      .from("products") as any)
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return mapProduct(data);
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

    return ((data || []) as any[]).map((row) => ({
      id: row.id,
      productId: row.productid,
      product: row.product,
      quantity: row.quantity,
      userId: row.userid,
      addedAt: row.added_at,
    })) as CartItem[];
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
      const existingItem = existing as any;
      const { data, error } = await (supabase
        .from("cart") as any)
        .update({ quantity: existingItem.quantity + item.quantity })
        .eq("id", existingItem.id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        productId: data.productid,
        product: data.product,
        quantity: data.quantity,
        userId: data.userid,
        addedAt: data.added_at,
      } as CartItem;
    }

    const { data, error } = await (supabase
      .from("cart") as any)
      .insert({
        id: item.id,
        productid: item.productId,
        product: item.product,
        quantity: item.quantity,
        userid: item.userId,
        added_at: item.addedAt,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      productId: data.productid,
      product: data.product,
      quantity: data.quantity,
      userId: data.userid,
      addedAt: data.added_at,
    } as CartItem;
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

    const existingItem = existing as any;

    const { data, error } = await (supabase
      .from("cart") as any)
      .update({ quantity })
      .eq("id", existingItem.id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      productId: data.productid,
      product: data.product,
      quantity: data.quantity,
      userId: data.userid,
      addedAt: data.added_at,
    } as CartItem;
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

    return ((data || []) as any[]).map((row) => ({
      id: row.id,
      productId: row.productid,
      product: row.product,
      userId: row.userid,
      addedAt: row.added_at,
    })) as WishlistItem[];
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
      const row = existing as any;
      return {
        id: row.id,
        productId: row.productid,
        product: row.product,
        userId: row.userid,
        addedAt: row.added_at,
      } as WishlistItem;
    }

    const { data, error } = await (supabase
      .from("wishlist") as any)
      .insert({
        id: item.id,
        productid: item.productId,
        product: item.product,
        userid: item.userId,
        added_at: item.addedAt,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      productId: data.productid,
      product: data.product,
      userId: data.userid,
      addedAt: data.added_at,
    } as WishlistItem;
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
    const { data, error } = await (supabase
      .from("users") as any)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      avatar: data.avatar,
      createdAt: data.created_at,
    } as User;
  } catch (error) {
    console.error("Error fetching user by id:", error);
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<UserWithPassword | null> {
  try {
    const { data, error } = await (supabase
      .from("users") as any)
      .select("*")
      .eq("email", email.toLowerCase())
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      avatar: data.avatar,
      createdAt: data.created_at,
      password: data.password,
    } as UserWithPassword;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
}

export async function createUser(user: UserWithPassword): Promise<User> {
  try {
    const { data, error } = await (supabase
      .from("users") as any)
      .insert({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        created_at: user.createdAt,
        password: user.password,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      avatar: data.avatar,
      createdAt: data.created_at,
    } as User;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function getUsers(): Promise<User[]> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, avatar, created_at");

    if (error) throw error;

    return (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      avatar: row.avatar,
      createdAt: row.created_at,
    })) as User[];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}
