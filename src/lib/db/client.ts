import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
  ...(process.env.AWS_DYNAMODB_ENDPOINT && {
    endpoint: process.env.AWS_DYNAMODB_ENDPOINT,
  }),
});

export const docClient = DynamoDBDocumentClient.from(client);

export const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE || "products";
export const CATEGORIES_TABLE = process.env.CATEGORIES_TABLE || "categories";
export const CART_TABLE = process.env.CART_TABLE || "cart";
export const WISHLIST_TABLE = process.env.WISHLIST_TABLE || "wishlist";
export const USERS_TABLE = process.env.USERS_TABLE || "users";
