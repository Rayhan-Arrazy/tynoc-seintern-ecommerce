export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || typeof email !== "string") {
    return { valid: false, error: "Email is required" };
  }

  const trimmed = email.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: "Email is required" };
  }

  if (trimmed.length > 254) {
    return { valid: false, error: "Email is too long" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: "Invalid email format" };
  }

  return { valid: true };
}

export function validateProduct(product: Record<string, unknown>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!product.name || typeof product.name !== "string" || (product.name as string).trim().length === 0) {
    errors.push("Product name is required");
  }

  if (product.price === undefined || product.price === null || typeof product.price !== "number" || (product.price as number) < 0) {
    errors.push("Valid price is required");
  }

  if (product.description !== undefined && product.description !== null && typeof product.description !== "string") {
    errors.push("Description must be a string");
  }

  if (product.category !== undefined && product.category !== null && typeof product.category !== "string") {
    errors.push("Category must be a string");
  }

  if (product.stock !== undefined && product.stock !== null && (typeof product.stock !== "number" || (product.stock as number) < 0)) {
    errors.push("Stock must be a non-negative number");
  }

  return { valid: errors.length === 0, errors };
}

export function validateCartItem(item: Record<string, unknown>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!item.productId || typeof item.productId !== "string" || (item.productId as string).trim().length === 0) {
    errors.push("Product ID is required");
  }

  if (!item.quantity || typeof item.quantity !== "number" || (item.quantity as number) < 1 || !Number.isInteger(item.quantity)) {
    errors.push("Quantity must be a positive integer");
  }

  if (item.price === undefined || item.price === null || typeof item.price !== "number" || (item.price as number) < 0) {
    errors.push("Valid price is required");
  }

  return { valid: errors.length === 0, errors };
}
