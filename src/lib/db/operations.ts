import {
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
  QueryCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import type { ScanCommandInput } from "@aws-sdk/client-dynamodb";
import {
  docClient,
  PRODUCTS_TABLE,
  CATEGORIES_TABLE,
  CART_TABLE,
  WISHLIST_TABLE,
  USERS_TABLE,
} from "./client";
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
    const params: ScanCommandInput = { TableName: PRODUCTS_TABLE };
    const expressionNames: Record<string, string> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const expressionValues: Record<string, any> = {};
    const filterExpressions: string[] = [];

    if (filters) {
      if (filters.query) {
        filterExpressions.push(
          "(contains(#name, :query) OR contains(#description, :query))"
        );
        expressionNames["#name"] = "name";
        expressionNames["#description"] = "description";
        expressionValues[":query"] = filters.query;
      }
      if (filters.category) {
        filterExpressions.push("#categoryId = :categoryId");
        expressionNames["#categoryId"] = "categoryId";
        expressionValues[":categoryId"] = filters.category;
      }
      if (filters.minPrice !== undefined) {
        filterExpressions.push("#price >= :minPrice");
        expressionNames["#price"] = "price";
        expressionValues[":minPrice"] = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        filterExpressions.push("#price <= :maxPrice");
        expressionNames["#price"] = expressionNames["#price"] || "price";
        expressionValues[":maxPrice"] = filters.maxPrice;
      }
    }

    if (filterExpressions.length > 0) {
      params.FilterExpression = filterExpressions.join(" AND ");
    }
    if (Object.keys(expressionNames).length > 0) {
      params.ExpressionAttributeNames = expressionNames;
    }
    if (Object.keys(expressionValues).length > 0) {
      params.ExpressionAttributeValues = expressionValues;
    }

    const result = await docClient.send(new ScanCommand(params));
    const items = [...((result.Items || []) as Product[])];

    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case "newest":
          items.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        case "price-asc":
          items.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          items.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          items.sort((a, b) => b.rating - a.rating);
          break;
      }
    }

    const total = items.length;
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const start = (page - 1) * limit;
    const paginatedItems = items.slice(start, start + limit);

    return {
      data: paginatedItems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const result = await docClient.send(
      new GetCommand({
        TableName: PRODUCTS_TABLE,
        Key: { id },
      })
    );
    return (result.Item as Product) || null;
  } catch (error) {
    console.error("Error fetching product by id:", error);
    throw new Error("Failed to fetch product");
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const result = await docClient.send(
      new ScanCommand({
        TableName: PRODUCTS_TABLE,
        FilterExpression: "#slug = :slug",
        ExpressionAttributeNames: { "#slug": "slug" },
        ExpressionAttributeValues: { ":slug": slug },
        Limit: 1,
      })
    );
    return (result.Items?.[0] as Product) || null;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    throw new Error("Failed to fetch product");
  }
}

export async function getProductsByCategory(
  categoryId: string,
  limit?: number
): Promise<Product[]> {
  try {
    const result = await docClient.send(
      new QueryCommand({
        TableName: PRODUCTS_TABLE,
        IndexName: "categoryId-index",
        KeyConditionExpression: "categoryId = :categoryId",
        ExpressionAttributeValues: { ":categoryId": categoryId },
        Limit: limit,
      })
    );
    return (result.Items || []) as Product[];
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw new Error("Failed to fetch products by category");
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const result = await docClient.send(
      new ScanCommand({
        TableName: PRODUCTS_TABLE,
        FilterExpression: "isFeatured = :true",
        ExpressionAttributeValues: { ":true": true },
      })
    );
    return (result.Items || []) as Product[];
  } catch (error) {
    console.error("Error fetching featured products:", error);
    throw new Error("Failed to fetch featured products");
  }
}

export async function getNewProducts(): Promise<Product[]> {
  try {
    const result = await docClient.send(
      new ScanCommand({
        TableName: PRODUCTS_TABLE,
        FilterExpression: "isNew = :true",
        ExpressionAttributeValues: { ":true": true },
      })
    );
    return (result.Items || []) as Product[];
  } catch (error) {
    console.error("Error fetching new products:", error);
    throw new Error("Failed to fetch new products");
  }
}

export async function getSaleProducts(): Promise<Product[]> {
  try {
    const result = await docClient.send(
      new ScanCommand({
        TableName: PRODUCTS_TABLE,
        FilterExpression: "isOnSale = :true",
        ExpressionAttributeValues: { ":true": true },
      })
    );
    return (result.Items || []) as Product[];
  } catch (error) {
    console.error("Error fetching sale products:", error);
    throw new Error("Failed to fetch sale products");
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const result = await docClient.send(
      new ScanCommand({
        TableName: PRODUCTS_TABLE,
        FilterExpression:
          "(contains(#name, :query) OR contains(#description, :query))",
        ExpressionAttributeNames: {
          "#name": "name",
          "#description": "description",
        },
        ExpressionAttributeValues: { ":query": query },
      })
    );
    return (result.Items || []) as Product[];
  } catch (error) {
    console.error("Error searching products:", error);
    throw new Error("Failed to search products");
  }
}

export async function createProduct(product: Product): Promise<Product> {
  try {
    await docClient.send(
      new PutCommand({
        TableName: PRODUCTS_TABLE,
        Item: product,
      })
    );
    return product;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product> {
  try {
    const existing = await getProductById(id);
    if (!existing) {
      throw new Error("Product not found");
    }

    const expressionParts: string[] = [];
    const expressionNames: Record<string, string> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const expressionValues: Record<string, any> = {};

    Object.entries(updates).forEach(([key, value]) => {
      if (key === "id") return;
      expressionParts.push(`#${key} = :${key}`);
      expressionNames[`#${key}`] = key;
      expressionValues[`:${key}`] = value;
    });

    expressionParts.push("#updatedAt = :updatedAt");
    expressionNames["#updatedAt"] = "updatedAt";
    expressionValues[":updatedAt"] = new Date().toISOString();

    const result = await docClient.send(
      new UpdateCommand({
        TableName: PRODUCTS_TABLE,
        Key: { id },
        UpdateExpression: `SET ${expressionParts.join(", ")}`,
        ExpressionAttributeNames: expressionNames,
        ExpressionAttributeValues: expressionValues,
        ReturnValues: "ALL_NEW",
      })
    );

    return result.Attributes as Product;
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await docClient.send(
      new DeleteCommand({
        TableName: PRODUCTS_TABLE,
        Key: { id },
      })
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  try {
    const result = await docClient.send(
      new ScanCommand({ TableName: CATEGORIES_TABLE })
    );
    return (result.Items || []) as Category[];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const result = await docClient.send(
      new GetCommand({
        TableName: CATEGORIES_TABLE,
        Key: { id },
      })
    );
    return (result.Item as Category) || null;
  } catch (error) {
    console.error("Error fetching category by id:", error);
    throw new Error("Failed to fetch category");
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const result = await docClient.send(
      new ScanCommand({
        TableName: CATEGORIES_TABLE,
        FilterExpression: "#slug = :slug",
        ExpressionAttributeNames: { "#slug": "slug" },
        ExpressionAttributeValues: { ":slug": slug },
        Limit: 1,
      })
    );
    return (result.Items?.[0] as Category) || null;
  } catch (error) {
    console.error("Error fetching category by slug:", error);
    throw new Error("Failed to fetch category");
  }
}

export async function createCategory(category: Category): Promise<Category> {
  try {
    await docClient.send(
      new PutCommand({
        TableName: CATEGORIES_TABLE,
        Item: category,
      })
    );
    return category;
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error("Failed to create category");
  }
}

// ─── Cart ────────────────────────────────────────────────────────────────────

export async function getCartItems(userId: string): Promise<CartItem[]> {
  try {
    const result = await docClient.send(
      new QueryCommand({
        TableName: CART_TABLE,
        IndexName: "userId-index",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: { ":userId": userId },
      })
    );
    return (result.Items || []) as CartItem[];
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw new Error("Failed to fetch cart items");
  }
}

export async function addToCart(item: CartItem): Promise<CartItem> {
  try {
    const existing = await docClient.send(
      new QueryCommand({
        TableName: CART_TABLE,
        IndexName: "userId-index",
        KeyConditionExpression:
          "userId = :userId AND productId = :productId",
        ExpressionAttributeValues: {
          ":userId": item.userId,
          ":productId": item.productId,
        },
      })
    );

    const existingItem = existing.Items?.[0] as CartItem | undefined;

    if (existingItem) {
      const result = await docClient.send(
        new UpdateCommand({
          TableName: CART_TABLE,
          Key: { id: existingItem.id },
          UpdateExpression: "SET #quantity = :quantity",
          ExpressionAttributeNames: { "#quantity": "quantity" },
          ExpressionAttributeValues: {
            ":quantity": existingItem.quantity + item.quantity,
          },
          ReturnValues: "ALL_NEW",
        })
      );
      return result.Attributes as CartItem;
    }

    await docClient.send(
      new PutCommand({
        TableName: CART_TABLE,
        Item: item,
      })
    );
    return item;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw new Error("Failed to add item to cart");
  }
}

export async function updateCartItem(
  userId: string,
  productId: string,
  quantity: number
): Promise<CartItem> {
  try {
    const result = await docClient.send(
      new QueryCommand({
        TableName: CART_TABLE,
        IndexName: "userId-index",
        KeyConditionExpression:
          "userId = :userId AND productId = :productId",
        ExpressionAttributeValues: { ":userId": userId, ":productId": productId },
      })
    );

    const item = result.Items?.[0] as CartItem | undefined;
    if (!item) {
      throw new Error("Cart item not found");
    }

    const updated = await docClient.send(
      new UpdateCommand({
        TableName: CART_TABLE,
        Key: { id: item.id },
        UpdateExpression: "SET #quantity = :quantity",
        ExpressionAttributeNames: { "#quantity": "quantity" },
        ExpressionAttributeValues: { ":quantity": quantity },
        ReturnValues: "ALL_NEW",
      })
    );

    return updated.Attributes as CartItem;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw new Error("Failed to update cart item");
  }
}

export async function removeFromCart(
  userId: string,
  productId: string
): Promise<void> {
  try {
    const result = await docClient.send(
      new QueryCommand({
        TableName: CART_TABLE,
        IndexName: "userId-index",
        KeyConditionExpression:
          "userId = :userId AND productId = :productId",
        ExpressionAttributeValues: { ":userId": userId, ":productId": productId },
      })
    );

    const item = result.Items?.[0] as CartItem | undefined;
    if (!item) return;

    await docClient.send(
      new DeleteCommand({
        TableName: CART_TABLE,
        Key: { id: item.id },
      })
    );
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw new Error("Failed to remove item from cart");
  }
}

export async function clearCart(userId: string): Promise<void> {
  try {
    const items = await getCartItems(userId);
    if (items.length === 0) return;

    const deleteRequests = items.map((item) => ({
      DeleteRequest: { Key: { id: item.id } },
    }));

    for (let i = 0; i < deleteRequests.length; i += 25) {
      const batch = deleteRequests.slice(i, i + 25);
      await docClient.send(
        new BatchWriteCommand({
          RequestItems: { [CART_TABLE]: batch },
        })
      );
    }
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw new Error("Failed to clear cart");
  }
}

// ─── Wishlist ────────────────────────────────────────────────────────────────

export async function getWishlistItems(userId: string): Promise<WishlistItem[]> {
  try {
    const result = await docClient.send(
      new QueryCommand({
        TableName: WISHLIST_TABLE,
        IndexName: "userId-index",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: { ":userId": userId },
      })
    );
    return (result.Items || []) as WishlistItem[];
  } catch (error) {
    console.error("Error fetching wishlist items:", error);
    throw new Error("Failed to fetch wishlist items");
  }
}

export async function addToWishlist(item: WishlistItem): Promise<WishlistItem> {
  try {
    const existing = await docClient.send(
      new QueryCommand({
        TableName: WISHLIST_TABLE,
        IndexName: "userId-index",
        KeyConditionExpression:
          "userId = :userId AND productId = :productId",
        ExpressionAttributeValues: {
          ":userId": item.userId,
          ":productId": item.productId,
        },
      })
    );

    if (existing.Items && existing.Items.length > 0) {
      return existing.Items[0] as WishlistItem;
    }

    await docClient.send(
      new PutCommand({
        TableName: WISHLIST_TABLE,
        Item: item,
      })
    );
    return item;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw new Error("Failed to add item to wishlist");
  }
}

export async function removeFromWishlist(
  userId: string,
  productId: string
): Promise<void> {
  try {
    const result = await docClient.send(
      new QueryCommand({
        TableName: WISHLIST_TABLE,
        IndexName: "userId-index",
        KeyConditionExpression:
          "userId = :userId AND productId = :productId",
        ExpressionAttributeValues: { ":userId": userId, ":productId": productId },
      })
    );

    const item = result.Items?.[0] as WishlistItem | undefined;
    if (!item) return;

    await docClient.send(
      new DeleteCommand({
        TableName: WISHLIST_TABLE,
        Key: { id: item.id },
      })
    );
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw new Error("Failed to remove item from wishlist");
  }
}

// ─── Users ───────────────────────────────────────────────────────────────────

export async function getUserById(id: string): Promise<User | null> {
  try {
    const result = await docClient.send(
      new GetCommand({
        TableName: USERS_TABLE,
        Key: { id },
      })
    );
    return (result.Item as User) || null;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
}

export async function createUser(user: User): Promise<User> {
  try {
    await docClient.send(
      new PutCommand({
        TableName: USERS_TABLE,
        Item: user,
      })
    );
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
}

export async function getUserByEmail(email: string): Promise<UserWithPassword | null> {
  try {
    const result = await docClient.send(
      new ScanCommand({
        TableName: USERS_TABLE,
        FilterExpression: "#email = :email",
        ExpressionAttributeNames: { "#email": "email" },
        ExpressionAttributeValues: { ":email": email.toLowerCase() },
        Limit: 1,
      })
    );
    return (result.Items?.[0] as UserWithPassword) || null;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw new Error("Failed to fetch user");
  }
}
