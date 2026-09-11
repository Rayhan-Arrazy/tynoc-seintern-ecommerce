export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  images: string[];
  categoryId: string;
  category: Category;
  stock: number;
  rating: number;
  reviewCount: number;
  features: string[];
  specifications: Record<string, string>;
  tags: string[];
  isFeatured: boolean;
  isNew: boolean;
  isOnSale: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  userId: string;
  addedAt: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  userId: string;
  addedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
}

export interface UserWithPassword extends User {
  password: string;
}

export interface SearchFilters {
  query: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  sortBy: "newest" | "price-asc" | "price-desc" | "rating";
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ProductWithCategory extends Product {
  categoryName: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: { cardNumber: string; expiry: string; cardholderName: string };
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export type NotificationType = 'system' | 'order' | 'promotion';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}

export interface PaymentInfo {
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardholderName: string;
}
