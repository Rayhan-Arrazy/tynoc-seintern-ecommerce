import { v4 as uuidv4 } from 'uuid';
import type { Order, OrderStatus } from '@/types';

let orders: Order[] = [];

export async function getOrders(userId: string): Promise<Order[]> {
  return orders
    .filter((o) => o.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getOrderById(id: string): Promise<Order | null> {
  return orders.find((o) => o.id === id) || null;
}

export async function createOrder(
  order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>
): Promise<Order> {
  const newOrder: Order = {
    ...order,
    id: uuidv4(),
    status: 'pending' as OrderStatus,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  orders.push(newOrder);
  return newOrder;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order | null> {
  const order = orders.find((o) => o.id === id);
  if (!order) return null;
  order.status = status;
  order.updatedAt = new Date().toISOString();
  return order;
}
