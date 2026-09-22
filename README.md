# Tynoc E-Commerce Platform

> A full-stack e-commerce platform built as a software engineering internship project, demonstrating modern web architecture, business logic implementation, API design, and comprehensive error handling.

**Live Demo:** [https://tynoc-seintern-ecommerce.vercel.app](https://tynoc-seintern-ecommerce.vercel.app)

---

## Quick Start (Demo Accounts)

### Admin Account (Full Admin Dashboard Access)

| Field    | Value                |
| -------- | -------------------- |
| **Email**    | `admin@example.com`       |
| **Password** | `password123`            |
| **Role**     | Admin                    |
| **URL**      | [Login Page](https://tynoc-seintern-ecommerce.vercel.app/auth/login) |

### Regular User Account (Storefront Only)

| Field    | Value                |
| -------- | -------------------- |
| **Email**    | `user@example.com`       |
| **Password** | `password123`            |
| **Role**     | User                     |
| **URL**      | [Login Page](https://tynoc-seintern-ecommerce.vercel.app/auth/login) |

> **Note:** The admin dashboard (`/admin`) is protected by middleware and client-side checks. Only users with `is_admin = true` in the database can access it.

---

## Table of Contents

- [Quick Start](#quick-start-demo-account)
- [Project Overview](#1-project-overview)
- [Features](#2-features)
- [Tech Stack](#3-tech-stack)
- [Project Structure](#4-project-structure)
- [Architecture](#5-architecture)
- [Database Setup (Supabase)](#6-database-setup-supabase)
- [Environment Variables](#7-environment-variables)
- [Installation](#8-installation)
- [API Routes](#9-api-routes)
- [Database Schema](#10-database-schema)
- [Screenshots](#11-screenshots)
- [License](#12-license)

---

## 1. Project Overview

**Tynoc** is a full-stack e-commerce web application built with Next.js 16, React 19, and TypeScript. It was developed as a software engineering intern project, with a focus on:

- **Architecture** — A layered architecture with a data layer facade pattern that supports multiple database backends (Supabase PostgreSQL, AWS DynamoDB, and an in-memory store) with automatic fallback.
- **Business Logic** — Product catalog management, shopping cart operations, wishlist, order processing with lifecycle simulation, user authentication, real-time notifications, and an admin dashboard.
- **API Design** — RESTful API routes built with Next.js Route Handlers, following consistent response schemas and input validation.
- **Error Handling** — Graceful fallback between database backends, input validation on all API endpoints, and meaningful error responses.

The application features a responsive storefront with search and filtering, a complete checkout flow, real-time notifications, order lifecycle simulation, and a full admin dashboard for product and category management.

---

## 2. Features

### Storefront

- **Homepage** — Hero banner, flash sale section, best sellers, new arrivals, current deals, and product categories
- **Product Listing** — Paginated product grid with category filtering, price range filters, and sorting (newest, price ascending, price descending, rating)
- **Product Detail** — Image gallery, product specifications, key features, stock status, star ratings, and related product recommendations
- **Search** — Full-text search across product names and descriptions with filter combinations

### User Management

- **Registration** — Create new accounts with name, email, and password (stored as bcrypt hash)
- **Login** — Authenticate existing users with email/password
- **Session Persistence** — User sessions persisted via localStorage, with automatic login on page reload
- **Profile Settings** — View and manage account information

### Shopping Cart

- Add products to cart from product listing or detail pages
- Update item quantities with subtotal recalculation
- Remove individual items or clear the entire cart
- Cart clears automatically when order payment is confirmed
- Persistent cart per user stored in Supabase

### Wishlist

- Add or remove products from wishlist
- Duplicate prevention (cannot add the same product twice)
- Persistent wishlist per user stored in Supabase

### Checkout

- Multi-field shipping address form with validation
- Mock payment processing (card number, expiry, CVV, cardholder name)
- Order placement with real-time notifications

### Order Management

- **Order History** — List of all past orders with status indicators
- **Order Detail** — Full breakdown of order items, quantities, prices, subtotals, shipping, tax, and total
- **Order Lifecycle Simulation** — Automatic status progression: pending → confirmed (5s) → shipped (5s) → delivered (5s)
- **Status Tracking** — Visual banners indicating current status with color-coded indicators

### Notifications

- Real-time bell icon in the navbar with unread count badge (polls every 10 seconds)
- Notifications created automatically on: registration (welcome), order placement, payment confirmed, order shipped, order delivered
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

| Layer              | Technology                                       |
| ------------------ | ------------------------------------------------ |
| **Frontend**       | Next.js 16 (App Router), React 19, TypeScript 5  |
| **Backend**        | Next.js Route Handlers (API Routes)              |
| **Database**       | Supabase PostgreSQL (primary), DynamoDB, In-Memory |
| **ORM/Client**     | @supabase/supabase-js v2                        |
| **Styling**        | Tailwind CSS v4                                  |
| **State Mgmt**     | React Context API (Cart, Wishlist, Auth)          |
| **Icons**          | Lucide React                                     |
| **Date Utilities** | date-fns                                         |
| **IDs**            | UUID (uuid package + crypto.randomUUID)          |
| **Password Hash**  | bcrypt                                           |
| **Version Control**| Git & GitHub                                     |
| **Deployment**     | Vercel                                           |

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
│   │   └── [id]/page.tsx       # Order detail with lifecycle simulation
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
│       ├── orders/             # Order management (GET, POST, PATCH)
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
│   │   ├── client.ts           # DynamoDB client setup
│   │   ├── operations.ts       # DynamoDB CRUD operations
│   │   ├── store.ts            # In-memory data store (with seed data)
│   │   ├── supabase.ts         # Supabase client initialization
│   │   ├── supabase-schema.ts  # Supabase Database TypeScript types
│   │   ├── supabase-operations.ts  # Supabase CRUD operations
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

supabase/
├── schema.sql                  # Complete database schema (all 7 tables)
└── seed.sql                    # Seed data (25 products, 6 categories, 1 user)
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

> **Note:** Order and cart API routes (`/api/orders`, `/api/cart`) query Supabase directly to ensure permanent data storage. The facade layer is used for products, categories, and user operations.

### Client-Side State Management

- **CartContext** — Provides `addToCart`, `updateQuantity`, `removeFromCart`, `clearCart`, and `getCartTotal` throughout the app
- **WishlistContext** — Provides `addToWishlist`, `removeFromWishlist`, `isInWishlist`, and `getWishlistCount`
- **AuthContext** — Provides `login`, `register`, `logout`, `user`, and `isAuthenticated` with localStorage persistence

All three contexts are wrapped in the root layout (`src/app/layout.tsx`), making them available to every page.

---

## 6. Database Setup (Supabase)

> **Supabase is the primary database.** All data (products, users, cart, wishlist, orders, notifications) is stored permanently in PostgreSQL.

### Step 1: Create Supabase Project

1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Project Settings → API**
4. Copy the **Project URL** and **Publishable (anon) key**

### Step 2: Run Schema

1. Go to **Supabase Dashboard → SQL Editor**
2. Paste the contents of `supabase/schema.sql`
3. Click **Run**

This creates all 7 tables: `categories`, `products`, `users`, `cart`, `wishlist`, `orders`, `notifications` with indexes, triggers, and RLS policies.

### Step 3: Seed Data

1. In the same SQL Editor
2. Paste the contents of `supabase/seed.sql`
3. Click **Run**

This populates:
- **6 categories** (Electronics, Clothing, Home & Kitchen, Sports & Outdoors, Books, Beauty)
- **25 products** with full details (descriptions, specs, images, ratings)
- **1 demo user** (`demo@example.com` / `password123`)

### Step 4: Configure Environment

Set these in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

---

## 7. Environment Variables

Create a `.env.local` file in the project root:

```bash
# ─── Supabase (Primary Database) ──────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key

# ─── AWS DynamoDB (Alternative — optional) ────────────────────────────────────
# Only used if Supabase env vars are NOT set
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

| Variable                        | Required | Description                                              |
| ------------------------------- | -------- | -------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Yes      | Supabase project URL                                     |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes  | Supabase anonymous/publishable key                       |
| `AWS_REGION`                    | No       | AWS region for DynamoDB (default: `us-east-1`)           |
| `AWS_ACCESS_KEY_ID`             | No       | AWS IAM access key ID                                    |
| `AWS_SECRET_ACCESS_KEY`         | No       | AWS IAM secret access key                                |

> **No database required to run locally.** If no database environment variables are set, the app uses an in-memory store pre-loaded with seed data.

---

## 8. Installation

### Prerequisites

- **Node.js** 18.17 or later
- **npm**, **yarn**, or **pnpm**

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/Rayhan-Arrazy/tynoc-seintern-ecommerce.git
   cd tynoc-seintern-ecommerce
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Supabase credentials (see [Environment Variables](#7-environment-variables)).

4. **Set up database** (recommended)

   Follow the [Supabase Setup](#6-database-setup-supabase) instructions to create tables and seed data.

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

## 9. API Routes

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

| Method | Endpoint              | Description               |
| ------ | --------------------- | ------------------------- |
| `POST` | `/api/auth/login`     | Authenticate user         |
| `POST` | `/api/auth/register`  | Register new user (creates welcome notification) |

### Orders

| Method | Endpoint                      | Description                                |
| ------ | ----------------------------- | ------------------------------------------ |
| `GET`  | `/api/orders?userId=...`      | Get user's order history                   |
| `GET`  | `/api/orders/[id]`            | Get order details                          |
| `POST` | `/api/orders`                 | Place a new order (creates notification)   |
| `PATCH`| `/api/orders/[id]`            | Update order status (creates notification) |

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

## 10. Database Schema

### Tables

| Table          | Description                                      | Key Columns                                                    |
| -------------- | ------------------------------------------------ | -------------------------------------------------------------- |
| `categories`   | Product categories                               | id, name, slug (unique), description, image, productcount     |
| `products`     | Product catalog (25 items)                       | id, name, slug (unique), price, images, categoryid (FK), stock, rating |
| `users`        | Registered users                                 | id, name, email (unique), password (bcrypt), avatar            |
| `cart`         | Shopping cart items per user                     | id, productid, product (JSONB), quantity, userid               |
| `wishlist`     | Wishlist items per user                          | id, productid, product (JSONB), userid                         |
| `orders`       | Customer orders                                  | id, userid, items (JSONB), subtotal, shipping, tax, total, status, shipping_address, payment_method |
| `notifications`| User notifications                               | id, userid, title, message, type, is_read                      |

### Order Status Flow

```
pending → confirmed → shipped → delivered
   ↓
cancelled
```

Each status transition automatically creates a notification for the user.

### Indexes

- `products`: categoryid, isfeatured, isnew, isonsale
- `cart`: userid, unique (userid + productid)
- `wishlist`: userid, unique (userid + productid)
- `orders`: userid
- `notifications`: userid

### Row Level Security

All tables have RLS enabled with permissive "Allow all" policies (suitable for this project's auth model).

---

## 11. Screenshots

### Homepage

The homepage features a hero banner with a call-to-action, a flash sale countdown section highlighting discounted products, a curated best sellers carousel, new arrivals grid, current deals section, and a category browsing section. The layout is fully responsive with a sticky navigation bar containing the logo, search bar, and user/cart/wishlist icons.

### Product Listing

A paginated grid of product cards, each displaying the product image, name, price (with original price struck through for sale items), rating stars, and quick-add-to-cart buttons. The left sidebar contains filter controls for category selection, price range sliders, and sort dropdown.

### Product Detail

A full-width product page with an image gallery on the left (thumbnail navigation) and product information on the right. Includes product name, star rating with review count, pricing with discount percentage badge, stock indicator, quantity selector, add-to-cart and add-to-wishlist buttons, tabbed content for description/specifications/features, and a related products section at the bottom.

### Shopping Cart

A clean table layout showing each cart item with product image, name, individual price, quantity controls (increment/decrement buttons), line total, and a remove button. The right sidebar shows an order summary with subtotal, estimated shipping, estimated tax, and total.

### Checkout

A multi-section form with shipping address fields (full name, address, city, state, zip code, country, phone), payment information (card number, expiry, CVV, cardholder name), and an order summary sidebar. Form validation provides inline error messages.

### Order Detail with Lifecycle Simulation

After placing an order, the detail page shows real-time status progression with visual banners:
- Blue banner: "Processing Payment..."
- Purple banner: "Confirming Order..."
- Amber banner: "Shipping Order..."
- Green banner: "Order Delivered!"

### Login / Register

Clean, centered authentication forms with the Tynoc branding. The login form has email and password fields with a "Sign In" button and a link to register. Both include form validation and error message display.

### Admin Dashboard

A sidebar navigation layout with a stats overview showing cards for total products, categories, orders, users, and revenue. The product management page displays a table of all products with edit and delete actions.

### Account Page

A tabbed interface with sections for Profile (name, email, avatar display), Orders (order history list), Wishlist (grid of wishlisted products), and Settings (account preferences).

---

## 12. License

This project was developed as a software engineering internship submission. All rights reserved.

---

*Built with Next.js 16, React 19, TypeScript, Tailwind CSS, and Supabase PostgreSQL.*
