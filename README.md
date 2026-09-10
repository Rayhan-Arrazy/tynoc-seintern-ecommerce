# Tynoc - Full-Stack E-Commerce Platform

A production-style full-stack e-commerce application built with Next.js, TypeScript, AWS DynamoDB, and Tailwind CSS. Features a complete storefront with product browsing, search, filtering, shopping cart, and wishlist functionality.

## Features

### Storefront
- Modern responsive homepage with hero section
- Featured products, new arrivals, and sale sections
- Product categories with dedicated listing pages
- Product detail pages with image gallery, specifications, and related products
- Search functionality with filtering and sorting
- Responsive design across mobile, tablet, and desktop

### Shopping Experience
- Add products to cart with quantity controls
- Update cart item quantities
- Remove items from cart
- Real-time subtotal calculation
- Add/remove products from wishlist
- Duplicate prevention in cart and wishlist
- Empty state handling

### Application Experience
- Loading states for all async operations
- Empty states with call-to-action buttons
- Global error boundary with retry functionality
- 404 not-found handling
- Form validation for user inputs
- Responsive navigation with mobile hamburger menu

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **Backend:** Next.js Route Handlers (API Routes)
- **Database:** AWS DynamoDB (with in-memory fallback for development)
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **State Management:** React Context API
- **Package Manager:** npm

## Project Structure

```
e-commerce/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── api/                      # API Route Handlers
│   │   │   ├── products/             # Products CRUD API
│   │   │   │   ├── route.ts          # GET (list), POST (create)
│   │   │   │   └── [id]/route.ts     # GET, PUT, DELETE by ID
│   │   │   ├── categories/           # Categories API
│   │   │   ├── cart/                 # Shopping Cart API
│   │   │   └── wishlist/            # Wishlist API
│   │   ├── products/                 # Product pages
│   │   │   ├── page.tsx              # Product listing with filters
│   │   │   └── [id]/page.tsx         # Product detail page
│   │   ├── categories/               # Category pages
│   │   │   ├── page.tsx              # All categories
│   │   │   └── [slug]/page.tsx       # Category products
│   │   ├── cart/page.tsx             # Shopping cart page
│   │   ├── wishlist/page.tsx         # Wishlist page
│   │   ├── search/page.tsx           # Search results
│   │   ├── account/page.tsx          # User account page
│   │   ├── layout.tsx                # Root layout with providers
│   │   ├── page.tsx                  # Homepage
│   │   ├── not-found.tsx             # 404 page
│   │   ├── error.tsx                 # Global error boundary
│   │   └── loading.tsx               # Root loading state
│   ├── components/
│   │   ├── layout/                   # Layout components
│   │   │   ├── Navbar.tsx            # Navigation bar
│   │   │   ├── Footer.tsx            # Footer
│   │   │   └── CategoriesDropdown.tsx # Category dropdown
│   │   ├── product/                  # Product components
│   │   │   ├── ProductGrid.tsx       # Product grid display
│   │   │   ├── ProductDetails.tsx    # Product detail view
│   │   │   ├── SearchFilters.tsx     # Search and filter controls
│   │   │   ├── RelatedProducts.tsx   # Related products section
│   │   │   └── HeroSection.tsx       # Homepage hero banner
│   │   ├── cart/                     # Cart components
│   │   │   ├── CartPage.tsx          # Cart page layout
│   │   │   ├── CartItem.tsx          # Individual cart item
│   │   │   ├── CartSummary.tsx       # Order summary
│   │   │   └── WishlistPage.tsx      # Wishlist page
│   │   └── ui/                       # Reusable UI components
│   │       ├── Button.tsx            # Button with variants
│   │       ├── ProductCard.tsx       # Product card
│   │       ├── Rating.tsx            # Star rating display
│   │       ├── PriceTag.tsx          # Price display
│   │       ├── LoadingSpinner.tsx    # Loading indicator
│   │       └── EmptyState.tsx        # Empty state component
│   ├── context/                      # React Context providers
│   │   ├── CartContext.tsx           # Cart state management
│   │   └── WishlistContext.tsx       # Wishlist state management
│   ├── lib/
│   │   ├── db/                       # Database layer
│   │   │   ├── client.ts             # DynamoDB client setup
│   │   │   ├── operations.ts         # DynamoDB CRUD operations
│   │   │   ├── store.ts             # In-memory data store
│   │   │   └── seed.ts              # Seed data
│   │   └── utils/                    # Utility functions
│   │       ├── index.ts              # General utilities
│   │       └── validation.ts         # Input validation
│   └── types/                        # TypeScript type definitions
│       └── index.ts                  # All interfaces and types
├── scripts/                          # Build/utility scripts
│   └── seed.ts                       # Seed data re-export
├── .env.example                      # Environment variable template
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Project dependencies
```

## Architecture

```
User → Next.js Application → Server/API Layer → AWS DynamoDB
                                ↓
                         In-Memory Store (Development)
```

### Data Flow
1. **Client Components** interact with React Context providers (Cart, Wishlist)
2. **Context providers** make API calls to Route Handlers
3. **Route Handlers** validate input and call database operations
4. **Database operations** interact with DynamoDB (or in-memory store)
5. **Responses** flow back through the stack to update the UI

### Key Patterns
- **Server Components** for data fetching and static rendering
- **Client Components** for interactive features (cart, wishlist, filters)
- **React Context** for global state management
- **API Route Handlers** for backend logic with proper error handling
- **In-memory data store** for development without DynamoDB

## DynamoDB Setup

### Tables Required

| Table | Partition Key | Sort Key | GSIs |
|-------|--------------|----------|------|
| `products` | `id` (S) | - | `categoryId-index` |
| `categories` | `id` (S) | - | - |
| `cart` | `id` (S) | - | `userId-index` (userId, productId) |
| `wishlist` | `id` (S) | - | `userId-index` (userId, productId) |
| `users` | `id` (S) | - | - |

### Creating Tables (AWS CLI)

```bash
# Products table
aws dynamodb create-table \
  --table-name products \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=categoryId,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    IndexName=categoryId-index,KeySchema=[{AttributeName=categoryId,KeyType=HASH}],Projection={ProjectionType=ALL} \
  --billing-mode PAY_PER_REQUEST

# Categories table
aws dynamodb create-table \
  --table-name categories \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

# Cart table
aws dynamodb create-table \
  --table-name cart \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=userId,AttributeType=S \
    AttributeName=productId,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH},{AttributeName=productId,KeyType=RANGE}],Projection={ProjectionType=ALL} \
  --billing-mode PAY_PER_REQUEST

# Wishlist table (same structure as cart)
aws dynamodb create-table \
  --table-name wishlist \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=userId,AttributeType=S \
    AttributeName=productId,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH},{AttributeName=productId,KeyType=RANGE}],Projection={ProjectionType=ALL} \
  --billing-mode PAY_PER_REQUEST

# Users table
aws dynamodb create-table \
  --table-name users \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

## Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
# AWS DynamoDB Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key

# Optional: For local DynamoDB
# AWS_DYNAMODB_ENDPOINT=http://localhost:8000

# DynamoDB Table Names
PRODUCTS_TABLE=products
CATEGORIES_TABLE=categories
CART_TABLE=cart
WISHLIST_TABLE=wishlist
USERS_TABLE=users
```

> **Note:** The application includes an in-memory data store that works without AWS credentials for development purposes.

## Installation

### Prerequisites
- Node.js 18+ (recommended: 20+)
- npm or yarn

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd e-commerce

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# (Optional) Configure AWS credentials in .env.local

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Screenshots

### Homepage
- Hero section with call-to-action
- Featured products grid
- Category browsing
- New arrivals and sale sections

### Product Listing
- Search bar with filters
- Category filter dropdown
- Price range filtering
- Sort by price, rating, or date
- Responsive product grid

### Product Detail
- Large product image with thumbnails
- Product information and pricing
- Quantity selector
- Add to cart/wishlist buttons
- Features and specifications
- Related products

### Shopping Cart
- Cart items with quantity controls
- Order summary with subtotal
- Free shipping threshold indicator
- Empty cart state

### Wishlist
- Saved products grid
- Add to cart from wishlist
- Remove from wishlist
- Empty wishlist state

## API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products with filters |
| POST | `/api/products` | Create a new product |
| GET | `/api/products/[id]` | Get product by ID |
| PUT | `/api/products/[id]` | Update product |
| DELETE | `/api/products/[id]` | Delete product |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all categories |
| POST | `/api/categories` | Create a new category |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get cart items |
| POST | `/api/cart` | Add item to cart |
| PUT/PATCH | `/api/cart` | Update cart item quantity |
| DELETE | `/api/cart` | Remove item from cart |

### Wishlist
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wishlist` | Get wishlist items |
| POST | `/api/wishlist` | Add item to wishlist |
| DELETE | `/api/wishlist` | Remove item from wishlist |

## License

This project was built as part of an internship task submission.
