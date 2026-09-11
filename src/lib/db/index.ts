import type {
  Product,
  Category,
  CartItem,
  WishlistItem,
  User,
  SearchFilters,
  PaginatedResponse,
} from "@/types";

const useSupabase = Boolean(
  process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY
);

async function getDb() {
  if (useSupabase) {
    return await import("./supabase-operations");
  }
  return await import("./store");
}

// ─── Products ────────────────────────────────────────────────────────────────

export async function getAllProducts(
  filters?: SearchFilters
): Promise<PaginatedResponse<Product>> {
  const db = await getDb();
  return db.getAllProducts(filters);
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await getDb();
  return db.getProductById(id);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = await getDb();
  return db.getProductBySlug(slug);
}

export async function getProductsByCategory(
  categoryId: string,
  limit?: number
): Promise<Product[]> {
  const db = await getDb();
  return db.getProductsByCategory(categoryId, limit);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const db = await getDb();
  return db.getFeaturedProducts();
}

export async function getNewProducts(): Promise<Product[]> {
  const db = await getDb();
  return db.getNewProducts();
}

export async function getSaleProducts(): Promise<Product[]> {
  const db = await getDb();
  return db.getSaleProducts();
}

export async function searchProducts(query: string): Promise<Product[]> {
  const db = await getDb();
  return db.searchProducts(query);
}

export async function createProduct(product: Product): Promise<Product> {
  const db = await getDb();
  return db.createProduct(product);
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product> {
  const db = await getDb();
  return db.updateProduct(id, updates);
}

export async function deleteProduct(id: string): Promise<void> {
  const db = await getDb();
  return db.deleteProduct(id);
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  const db = await getDb();
  return db.getAllCategories();
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const db = await getDb();
  return db.getCategoryById(id);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const db = await getDb();
  return db.getCategoryBySlug(slug);
}

export async function createCategory(category: Category): Promise<Category> {
  const db = await getDb();
  return db.createCategory(category);
}

// ─── Cart ────────────────────────────────────────────────────────────────────

export async function getCartItems(userId: string): Promise<CartItem[]> {
  const db = await getDb();
  return db.getCartItems(userId);
}

export async function addToCart(item: CartItem): Promise<CartItem> {
  const db = await getDb();
  return db.addToCart(item);
}

export async function updateCartItem(
  userId: string,
  productId: string,
  quantity: number
): Promise<CartItem> {
  const db = await getDb();
  return db.updateCartItem(userId, productId, quantity);
}

export async function removeFromCart(
  userId: string,
  productId: string
): Promise<void> {
  const db = await getDb();
  return db.removeFromCart(userId, productId);
}

export async function clearCart(userId: string): Promise<void> {
  const db = await getDb();
  return db.clearCart(userId);
}

// ─── Wishlist ────────────────────────────────────────────────────────────────

export async function getWishlistItems(userId: string): Promise<WishlistItem[]> {
  const db = await getDb();
  return db.getWishlistItems(userId);
}

export async function addToWishlist(item: WishlistItem): Promise<WishlistItem> {
  const db = await getDb();
  return db.addToWishlist(item);
}

export async function removeFromWishlist(
  userId: string,
  productId: string
): Promise<void> {
  const db = await getDb();
  return db.removeFromWishlist(userId, productId);
}

// ─── Users ───────────────────────────────────────────────────────────────────

export async function getUserById(id: string): Promise<User | null> {
  const db = await getDb();
  return db.getUserById(id);
}

export async function createUser(user: User): Promise<User> {
  const db = await getDb();
  return db.createUser(user);
}
