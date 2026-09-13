import { seedCategories, seedProducts, seedUsers } from "@/lib/db/seed";
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

let categories: Category[] | null = null;
let products: Product[] | null = null;
let users: UserWithPassword[] | null = null;
let cartItems: CartItem[] = [];
const wishlistItems: WishlistItem[] = [];

function ensureCategories(): Category[] {
  if (!categories) categories = [...seedCategories];
  return categories;
}

function ensureProducts(): Product[] {
  if (!products) products = [...seedProducts];
  return products;
}

function ensureUsers(): UserWithPassword[] {
  if (!users) users = [...seedUsers];
  return users;
}

// ─── Products ────────────────────────────────────────────────────────────────

export async function getAllProducts(
  filters?: SearchFilters
): Promise<PaginatedResponse<Product>> {
  const items = ensureProducts();
  let filtered = [...items];

  if (filters) {
    if (filters.query) {
      const q = filters.query.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    if (filters.category) {
      filtered = filtered.filter((p) => p.categoryId === filters.category);
    }
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice);
    }
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "newest":
          filtered.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        case "price-asc":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          filtered.sort((a, b) => b.rating - a.rating);
          break;
      }
    }
  }

  const total = filtered.length;
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const start = (page - 1) * limit;
  const paginatedItems = filtered.slice(start, start + limit);

  return {
    data: paginatedItems,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProductById(id: string): Promise<Product | null> {
  const items = ensureProducts();
  return items.find((p) => p.id === id) || null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const items = ensureProducts();
  return items.find((p) => p.slug === slug) || null;
}

export async function getProductsByCategory(
  categoryId: string,
  limit?: number
): Promise<Product[]> {
  const items = ensureProducts();
  const filtered = items.filter((p) => p.categoryId === categoryId);
  return limit ? filtered.slice(0, limit) : filtered;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const items = ensureProducts();
  return items.filter((p) => p.isFeatured);
}

export async function getNewProducts(): Promise<Product[]> {
  const items = ensureProducts();
  return items.filter((p) => p.isNew);
}

export async function getSaleProducts(): Promise<Product[]> {
  const items = ensureProducts();
  return items.filter((p) => p.isOnSale);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const items = ensureProducts();
  const q = query.toLowerCase();
  return items.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
}

export async function createProduct(product: Product): Promise<Product> {
  const items = ensureProducts();
  items.push(product);
  return product;
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product> {
  const items = ensureProducts();
  const index = items.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error("Product not found");
  }
  items[index] = {
    ...items[index],
    ...updates,
    id: items[index].id,
    updatedAt: new Date().toISOString(),
  };
  return items[index];
}

export async function deleteProduct(id: string): Promise<void> {
  const items = ensureProducts();
  const index = items.findIndex((p) => p.id === id);
  if (index !== -1) {
    items.splice(index, 1);
  }
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  return ensureCategories();
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const items = ensureCategories();
  return items.find((c) => c.id === id) || null;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const items = ensureCategories();
  return items.find((c) => c.slug === slug) || null;
}

export async function createCategory(category: Category): Promise<Category> {
  const items = ensureCategories();
  items.push(category);
  return category;
}

export async function updateCategory(
  id: string,
  updates: Partial<Category>
): Promise<Category> {
  const items = ensureCategories();
  const index = items.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error("Category not found");
  }
  items[index] = { ...items[index], ...updates, id: items[index].id };
  return items[index];
}

export async function deleteCategory(id: string): Promise<void> {
  const items = ensureCategories();
  const index = items.findIndex((c) => c.id === id);
  if (index !== -1) {
    items.splice(index, 1);
  }
}

// ─── Cart ────────────────────────────────────────────────────────────────────

export async function getCartItems(userId: string): Promise<CartItem[]> {
  return cartItems.filter((item) => item.userId === userId);
}

export async function addToCart(item: CartItem): Promise<CartItem> {
  const existing = cartItems.find(
    (ci) => ci.userId === item.userId && ci.productId === item.productId
  );

  if (existing) {
    existing.quantity += item.quantity;
    return existing;
  }

  cartItems.push(item);
  return item;
}

export async function updateCartItem(
  userId: string,
  productId: string,
  quantity: number
): Promise<CartItem> {
  const item = cartItems.find(
    (ci) => ci.userId === userId && ci.productId === productId
  );
  if (!item) {
    throw new Error("Cart item not found");
  }
  item.quantity = quantity;
  return item;
}

export async function removeFromCart(
  userId: string,
  productId: string
): Promise<void> {
  const index = cartItems.findIndex(
    (ci) => ci.userId === userId && ci.productId === productId
  );
  if (index !== -1) {
    cartItems.splice(index, 1);
  }
}

export async function clearCart(userId: string): Promise<void> {
  cartItems = cartItems.filter((item) => item.userId !== userId);
}

// ─── Wishlist ────────────────────────────────────────────────────────────────

export async function getWishlistItems(userId: string): Promise<WishlistItem[]> {
  return wishlistItems.filter((item) => item.userId === userId);
}

export async function addToWishlist(item: WishlistItem): Promise<WishlistItem> {
  const existing = wishlistItems.find(
    (wi) => wi.userId === item.userId && wi.productId === item.productId
  );

  if (existing) {
    return existing;
  }

  wishlistItems.push(item);
  return item;
}

export async function removeFromWishlist(
  userId: string,
  productId: string
): Promise<void> {
  const index = wishlistItems.findIndex(
    (wi) => wi.userId === userId && wi.productId === productId
  );
  if (index !== -1) {
    wishlistItems.splice(index, 1);
  }
}

// ─── Users ───────────────────────────────────────────────────────────────────

export async function getUserById(id: string): Promise<User | null> {
  const items = ensureUsers();
  return items.find((u) => u.id === id) || null;
}

export async function getUserByEmail(email: string): Promise<UserWithPassword | null> {
  const items = ensureUsers();
  return items.find((u) => u.email === email.toLowerCase()) || null;
}

export async function createUser(user: UserWithPassword): Promise<User> {
  const items = ensureUsers();
  items.push(user);
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
