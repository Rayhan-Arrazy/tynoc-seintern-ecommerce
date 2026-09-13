# Tynoc E-Commerce Platform

> A full-stack e-commerce platform built as a software engineering internship project, demonstrating modern web architecture, business logic implementation, API design, and comprehensive error handling.

---

## Table of Contents

- [Project Overview](#1-project-overview)
- [Features](#2-features)
- [Tech Stack](#3-tech-stack)
- [Project Structure](#4-project-structure)
- [Architecture](#5-architecture)
- [DynamoDB Setup](#6-dynamodb-setup)
- [Supabase Setup](#7-supabase-setup)
- [Environment Variables](#8-environment-variables)
- [Installation](#9-installation)
- [API Routes](#10-api-routes)
- [Data Models](#11-data-models)
- [Screenshots](#12-screenshots)
- [License](#13-license)

---

## 1. Project Overview

**Tynoc** is a full-stack e-commerce web application built with Next.js 16, React 19, and TypeScript. It was developed as a software engineering intern project, with a focus on:

- **Architecture** — A layered architecture with a data layer facade pattern that supports multiple database backends (Supabase PostgreSQL, AWS DynamoDB, and an in-memory store) with automatic fallback.
- **Business Logic** — Product catalog management, shopping cart operations, wishlist, order processing, user authentication, and an admin dashboard.
- **API Design** — RESTful API routes built with Next.js Route Handlers, following consistent response schemas and input validation.
- **Error Handling** — Graceful fallback between database backends, input validation on all API endpoints, and meaningful error responses.

The application features a responsive storefront with search and filtering, a complete checkout flow, real-time notifications, and a full admin dashboard for product and category management.

---

## 2. Features

### Storefront

- **Homepage** — Hero banner, flash sale section, best sellers, new arrivals, current deals, and product categories
- **Product Listing** — Paginated product grid with category filtering, price range filters, and sorting (newest, price ascending, price descending, rating)
- **Product Detail** — Image gallery, product specifications, key features, stock status, star ratings, and related product recommendations
- **Search** — Full-text search across product names and descriptions with filter combinations

### User Management

- **Registration** — Create new accounts with name, email, and password
- **Login** — Authenticate existing users with email/password
- **Session Persistence** — User sessions persisted via localStorage, with automatic login on page reload
- **Profile Settings** — View and manage account information

### Shopping Cart

- Add products to cart from product listing or detail pages
- Update item quantities with subtotal recalculation
- Remove individual items or clear the entire cart
- Persistent cart per user with server-side storage

### Wishlist

- Add or remove products from wishlist
- Duplicate prevention (cannot add the same product twice)
- Persistent wishlist per user with server-side storage

### Checkout

- Multi-field shipping address form with validation
- Mock payment processing (card number, expiry, CVV, cardholder name)
- Order placement with automatic cart clearing and notification creation

### Order Management

- **Order History** — List of all past orders with status indicators
- **Order Detail** — Full breakdown of order items, quantities, prices, subtotals, shipping, tax, and total
- **Order Status** — Status tracking (pending, confirmed, shipped, delivered, cancelled)

### Notifications

- Real-time bell icon in the navbar with unread count badge
- Notifications created automatically on order placement
- Mark individual notifications as read
- Notification types: system, order, promotion

### Admin Dashboard

- **Stats Overview** — Total products, categories, orders, users, and revenue
- **Product Management** — Add, edit, and delete products with full form validation
- **Category Management** — Browse product categories

### Responsive Design

- Fully responsive layout across mobile, tablet, and desktop
- Collapsible mobile navigation
- Adaptive grid layouts for product cards

---

## 3. Tech Stack

| Layer              | Technology                                      |
| ------------------ | ----------------------------------------------- |
| **Frontend**       | Next.js 16 (App Router), React 19, TypeScript 5 |
| **Backend**        | Next.js Route Handlers (API Routes)             |
| **Database**       | AWS DynamoDB, Supabase PostgreSQL, In-Memory    |
| **Styling**        | Tailwind CSS v4                                 |
| **State Mgmt**     | React Context API (Cart, Wishlist, Auth)         |
| **Icons**          | Lucide React                                    |
| **Date Utilities** | date-fns                                        |
| **IDs**            | UUID (uuid package)                             |
| **Version Control**| Git & GitHub                                    |
| **Deployment**     | Vercel                                          |

---

## 4. Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Homepage
│   ├── layout.tsx              # Root layout (Navbar, Footer, Context Providers)
│   ├── globals.css             # Global styles
│   ├── products/               # Product listing & detail pages
│   │   ├── page.tsx            # All products with filters
│   │   └── [slug]/page.tsx     # Product detail by slug
│   ├── categories/             # Category listing & detail pages
│   │   ├── page.tsx            # All categories
│   │   └── [slug]/page.tsx     # Products by category
│   ├── cart/                   # Shopping cart page
│   ├── wishlist/               # Wishlist page
│   ├── checkout/               # Checkout flow page
│   ├── orders/                 # Order history & detail pages
│   │   ├── page.tsx            # Order list
│   │   └── [id]/page.tsx       # Order detail
│   ├── auth/                   # Authentication pages
│   │   ├── login/page.tsx      # Login page
│   │   └── register/page.tsx   # Registration page
│   ├── admin/                  # Admin dashboard
│   │   ├── page.tsx            # Admin stats overview
│   │   └── products/           # Product management
│   │       └── page.tsx        # Add/edit/delete products
│   ├── account/                # User account & settings
│   ├── search/                 # Search results page
│   └── api/                    # API Route Handlers
│       ├── products/           # Product CRUD endpoints
│       ├── categories/         # Category endpoints
│       ├── cart/               # Cart operations
│       ├── wishlist/           # Wishlist operations
│       ├── auth/               # Authentication endpoints
│       ├── orders/             # Order management
│       ├── notifications/      # Notification endpoints
│       └── admin/              # Admin statistics
├── components/                 # Reusable UI components
│   ├── ui/                     # Base components (Button, Rating, PriceTag, etc.)
│   ├── product/                # Product-related components (ProductCard, ProductGrid)
│   ├── cart/                   # Cart components (CartItem, CartSummary)
│   ├── checkout/               # Checkout form components
│   ├── layout/                 # Navbar, Footer
│   └── notifications/          # NotificationBell component
├── context/                    # React Context providers
│   ├── CartContext.tsx          # Cart state management
│   ├── WishlistContext.tsx      # Wishlist state management
│   └── AuthContext.tsx          # Authentication state management
├── lib/
│   ├── db/                     # Database abstraction layer
│   │   ├── index.ts            # Data layer facade (auto-selects backend)
│   │   ├── client.ts           # DynamoDB client setup & table name constants
│   │   ├── operations.ts       # DynamoDB CRUD operations
│   │   ├── store.ts            # In-memory data store (with seed data)
│   │   ├── supabase-operations.ts  # Supabase PostgreSQL operations
│   │   ├── seed.ts             # Seed data (categories, products, users)
│   │   ├── order-operations.ts # Order-specific database operations
│   │   ├── notification-operations.ts # Notification operations
│   │   └── admin-operations.ts # Admin dashboard statistics
│   └── utils/                  # Utility functions
│       ├── index.ts            # formatPrice, formatDate, getImageUrl, slugify, etc.
│       └── validation.ts       # Input validation (email, product, cart item)
├── types/                      # TypeScript type definitions
│   └── index.ts                # All interfaces and type aliases
└── public/                     # Static assets (images, icons)
```

---

## 5. Architecture

### High-Level Overview

```
┌──────────────────────────────────────────────────────┐
│                      User (Browser)                   │
└──────────────────────┬───────────────────────────────┘
                       │ HTTP / HTTPS
                       ▼
┌──────────────────────────────────────────────────────┐
│               Next.js Application                     │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │  React Pages │  │  API Routes  │  │  Middleware │ │
│  │  (SSR/CSR)  │  │  (Handlers)  │  │            │ │
│  └──────┬──────┘  └──────┬───────┘  └────────────┘ │
│         │                │                           │
│         ▼                ▼                           │
│  ┌──────────────────────────────────────────────┐   │
│  │           Data Layer Facade                   │   │
│  │        (src/lib/db/index.ts)                  │   │
│  │                                               │   │
│  │   Auto-selects backend based on env vars:     │   │
│  │   1. Supabase PostgreSQL (if configured)      │   │
│  │   2. In-Memory Store (fallback)               │   │
│  └───────┬──────────────┬───────────────┬───────┘   │
│          │              │               │            │
│          ▼              ▼               ▼            │
│  ┌─────────────┐ ┌──────────┐ ┌─────────────────┐ │
│  │   Supabase   │ │ DynamoDB │ │   In-Memory     │ │
│  │  PostgreSQL  │ │          │ │   (seed data)   │ │
│  └─────────────┘ └──────────┘ └─────────────────┘ │
└──────────────────────────────────────────────────────┘
```

### Data Layer Facade Pattern

The application uses a **facade pattern** for database access (`src/lib/db/index.ts`). This module exposes a uniform API (`getAllProducts`, `getProductById`, `addToCart`, etc.) and automatically delegates to the appropriate backend:

1. **Supabase** is checked first — if `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are set, Supabase is used
2. **In-Memory Store** is used as the fallback — pre-seeded with categories, products, and demo users

Each backend implements the same function signatures, so the rest of the application remains backend-agnostic.

### Client-Side State Management

- **CartContext** — Provides `addToCart`, `updateQuantity`, `removeFromCart`, `clearCart`, and `getCartTotal` throughout the app
- **WishlistContext** — Provides `addToWishlist`, `removeFromWishlist`, `isInWishlist`, and `getWishlistCount`
- **AuthContext** — Provides `login`, `register`, `logout`, `user`, and `isAuthenticated` with localStorage persistence

All three contexts are wrapped in the root layout (`src/app/layout.tsx`), making them available to every page.

---

## 6. DynamoDB Setup

> **Note:** DynamoDB is an alternative backend. Supabase is the primary database; configure Supabase instead if preferred. If neither is configured, the app uses an in-memory store with seed data.

### Create AWS Account

1. Sign in to [AWS Management Console](https://console.aws.amazon.com/)
2. Navigate to **DynamoDB** service

### Create Tables

Create the following DynamoDB tables in the `us-east-1` region:

| Table Name    | Partition Key | Sort Key | Global Secondary Indexes                                  |
| ------------- | ------------- | -------- | --------------------------------------------------------- |
| `products`    | `id` (String) | —        | —                                                         |
| `categories`  | `id` (String) | —        | —                                                         |
| `cart`        | `id` (String) | —        | `userId-index` (PK: `userId`), `userId-productId-index` (PK: `userId`, SK: `productId`) |
| `wishlist`    | `id` (String) | —        | `userId-index` (PK: `userId`)                             |
| `users`       | `id` (String) | —        | `email-index` (PK: `email`)                               |

### Configure Access

1. Create an IAM user with `AmazonDynamoDBFullAccess` permission
2. Generate access keys
3. Set environment variables in `.env.local` (see [Environment Variables](#8-environment-variables))

### Local Development (Optional)

For local development, use [DynamoDB Local](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html) or [LocalStack](https://localstack.cloud/):

```bash
# Set in .env.local
AWS_DYNAMODB_ENDPOINT=http://localhost:8000
```

---

## 7. Supabase Setup

> **Note:** Supabase is the primary database. If configured, it takes precedence over DynamoDB.

### Create Supabase Project

1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Project Settings → API**
4. Copy the **Project URL** and **Publishable (anon) key**

### Configure Environment

Set these in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

When Supabase is configured, the data layer facade automatically uses Supabase PostgreSQL as the database backend.

---

## 8. Environment Variables

Create a `.env.local` file in the project root with the following variables:

```bash
# ─── Supabase (Primary Database) ──────────────────────────────────────────────
# Get these from your Supabase project settings: https://supabase.com/dashboard
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key

# ─── AWS DynamoDB (Fallback / Alternative) ────────────────────────────────────
# Only used if Supabase env vars are NOT set
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key

# Optional: For local DynamoDB (e.g., DynamoDB Local or LocalStack)
# AWS_DYNAMODB_ENDPOINT=http://localhost:8000

# DynamoDB Table Names
PRODUCTS_TABLE=products
CATEGORIES_TABLE=categories
CART_TABLE=cart
WISHLIST_TABLE=wishlist
USERS_TABLE=users
```

### Variable Reference

| Variable                        | Required | Description                                              |
| ------------------------------- | -------- | -------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | No       | Supabase project URL (enables Supabase backend)          |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | No  | Supabase anonymous/publishable key                       |
| `AWS_REGION`                    | No       | AWS region for DynamoDB (default: `us-east-1`)           |
| `AWS_ACCESS_KEY_ID`             | No       | AWS IAM access key ID                                    |
| `AWS_SECRET_ACCESS_KEY`         | No       | AWS IAM secret access key                                |
| `AWS_DYNAMODB_ENDPOINT`         | No       | Custom endpoint for DynamoDB Local / LocalStack          |
| `PRODUCTS_TABLE`                | No       | DynamoDB table name for products (default: `products`)   |
| `CATEGORIES_TABLE`              | No       | DynamoDB table name for categories (default: `categories`) |
| `CART_TABLE`                    | No       | DynamoDB table name for cart items (default: `cart`)     |
| `WISHLIST_TABLE`                | No       | DynamoDB table name for wishlist items (default: `wishlist`) |
| `USERS_TABLE`                   | No       | DynamoDB table name for users (default: `users`)         |

> **No database required to run locally.** If no database environment variables are set, the app automatically uses an in-memory store pre-loaded with seed data (16+ products across 4 categories and 2 demo users).

---

## 9. Installation

### Prerequisites

- **Node.js** 18.17 or later
- **npm**, **yarn**, or **pnpm**

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/e-commerce.git
   cd e-commerce
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your database credentials (see [Environment Variables](#8-environment-variables)). The app works out of the box with no database configuration.

4. **(Optional) Set up a database backend**

   - **Supabase** — Follow the [Supabase Setup](#7-supabase-setup) instructions
   - **DynamoDB** — Follow the [DynamoDB Setup](#6-dynamodb-setup) instructions
   - **Neither** — The in-memory store will be used automatically

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open the application**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

| Command         | Description                              |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Start the Next.js development server     |
| `npm run build` | Build the application for production     |
| `npm start`     | Start the production server              |
| `npm run lint`  | Run ESLint to check for code issues      |

---

## 10. API Routes

All API routes are located under `src/app/api/` and follow RESTful conventions.

### Products

| Method   | Endpoint                      | Description                         |
| -------- | ----------------------------- | ----------------------------------- |
| `GET`    | `/api/products`               | Get all products (with filters)     |
| `GET`    | `/api/products/[id]`          | Get product by ID                   |
| `POST`   | `/api/products`               | Create a new product (admin)        |
| `PUT`    | `/api/products/[id]`          | Update a product (admin)            |
| `DELETE` | `/api/products/[id]`          | Delete a product (admin)            |

### Categories

| Method | Endpoint                      | Description                    |
| ------ | ----------------------------- | ------------------------------ |
| `GET`  | `/api/categories`             | Get all categories             |
| `GET`  | `/api/categories/[id]`        | Get category by ID             |

### Cart

| Method   | Endpoint                 | Description                          |
| -------- | ------------------------ | ------------------------------------ |
| `GET`    | `/api/cart?userId=...`   | Get cart items for a user            |
| `POST`   | `/api/cart`              | Add item to cart                     |
| `PUT`    | `/api/cart`              | Update cart item quantity            |
| `DELETE` | `/api/cart`              | Remove item from cart                |

### Wishlist

| Method   | Endpoint                      | Description                       |
| -------- | ----------------------------- | --------------------------------- |
| `GET`    | `/api/wishlist?userId=...`    | Get wishlist items for a user     |
| `POST`   | `/api/wishlist`               | Add item to wishlist              |
| `DELETE` | `/api/wishlist`               | Remove item from wishlist         |

### Authentication

| Method | Endpoint         | Description                    |
| ------ | ---------------- | ------------------------------ |
| `POST` | `/api/auth/login`    | Authenticate user          |
| `POST` | `/api/auth/register` | Register new user          |

### Orders

| Method | Endpoint                      | Description                    |
| ------ | ----------------------------- | ------------------------------ |
| `GET`  | `/api/orders?userId=...`      | Get user's order history       |
| `GET`  | `/api/orders/[id]`            | Get order details              |
| `POST` | `/api/orders`                 | Place a new order              |

### Notifications

| Method | Endpoint                           | Description                   |
| ------ | ---------------------------------- | ----------------------------- |
| `GET`  | `/api/notifications?userId=...`    | Get user's notifications      |
| `PUT`  | `/api/notifications/[id]`          | Mark notification as read     |

### Admin

| Method | Endpoint           | Description                     |
| ------ | ------------------ | ------------------------------- |
| `GET`  | `/api/admin/stats` | Get dashboard statistics        |

### Response Format

All API responses follow a consistent schema:

```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "message": "Operation completed successfully"
}
```

Error responses:

```json
{
  "success": false,
  "data": null,
  "error": "Invalid input",
  "message": "Product name is required"
}
```

---

## 11. Data Models

### Product

```typescript
interface Product {
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
```

### Category

```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}
```

### CartItem

```typescript
interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  userId: string;
  addedAt: string;
}
```

### WishlistItem

```typescript
interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  userId: string;
  addedAt: string;
}
```

### User

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
}
```

### Order

```typescript
interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: { cardNumber: string; expiry: string; cardholderName: string };
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}
```

### Notification

```typescript
interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'system' | 'order' | 'promotion';
  read: boolean;
  createdAt: string;
}
```

### Search Filters

```typescript
interface SearchFilters {
  query: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  sortBy: "newest" | "price-asc" | "price-desc" | "rating";
  page: number;
  limit: number;
}
```

---

## 12. Screenshots

### Homepage

The homepage features a hero banner with a call-to-action, a flash sale countdown section highlighting discounted products, a curated best sellers carousel, new arrivals grid, current deals section, and a category browsing section. The layout is fully responsive with a sticky navigation bar containing the logo, search bar, and user/cart/wishlist icons.

### Product Listing

A paginated grid of product cards, each displaying the product image, name, price (with original price struck through for sale items), rating stars, and quick-add-to-cart buttons. The left sidebar contains filter controls for category selection, price range sliders, and sort dropdown. Active filters are displayed as removable chips above the grid.

### Product Detail

A full-width product page with an image gallery on the left (thumbnail navigation) and product information on the right. Includes product name, star rating with review count, pricing with discount percentage badge, stock indicator, quantity selector, add-to-cart and add-to-wishlist buttons, tabbed content for description/specifications/features, and a related products section at the bottom.

### Shopping Cart

A clean table layout showing each cart item with product image, name, individual price, quantity controls (increment/decrement buttons), line total, and a remove button. The right sidebar shows an order summary with subtotal, estimated shipping, estimated tax, and total. A prominent "Proceed to Checkout" button links to the checkout flow.

### Checkout

A multi-section form with shipping address fields (full name, address, city, state, zip code, country, phone), payment information (card number, expiry, CVV, cardholder name), and an order summary sidebar. Form validation provides inline error messages. A "Place Order" button submits the order and redirects to order confirmation.

### Login / Register

Clean, centered authentication forms with the Tynoc branding. The login form has email and password fields with a "Sign In" button and a link to register. The register form adds a name field. Both include form validation and error message display. Social login placeholders are included for future expansion.

### Admin Dashboard

A sidebar navigation layout with a stats overview showing cards for total products, categories, orders, users, and revenue. The product management page displays a table of all products with edit and delete actions, and an "Add Product" button that opens a form with fields for name, description, price, stock, category, images, features, specifications, and toggle switches for featured/new/sale flags.

### Account Page

A tabbed interface with sections for Profile (name, email, avatar display), Orders (order history list), Wishlist (grid of wishlisted products), and Settings (account preferences). Each tab shows relevant data with appropriate empty states when no data exists.

---

## 13. License

This project was developed as a software engineering internship submission. All rights reserved.

---

*Built with Next.js 16, React 19, TypeScript, Tailwind CSS, and AWS DynamoDB/Supabase.*
