import { v4 as uuidv4 } from 'uuid';
import type { Notification } from '@/types';

const notifications: Notification[] = [
  {
    id: uuidv4(),
    userId: 'user-1',
    type: 'system',
    title: 'Welcome to Tynoc!',
    message: 'Thanks for joining Tynoc. Explore our latest products and exclusive deals.',
    read: false,
    createdAt: '2026-09-10T08:00:00.000Z',
  },
  {
    id: uuidv4(),
    userId: 'user-1',
    type: 'order',
    title: 'Order Shipped',
    message: 'Your order #ORD-8A3F has been shipped via FedEx. Track: FX123456789',
    read: false,
    createdAt: '2026-09-11T14:30:00.000Z',
  },
  {
    id: uuidv4(),
    userId: 'user-1',
    type: 'promotion',
    title: 'Flash Sale: Up to 50% Off',
    message: "Don't miss our biggest sale of the season. Ends Sunday!",
    read: true,
    createdAt: '2026-09-08T10:00:00.000Z',
  },
];

export async function getNotifications(userId: string): Promise<Notification[]> {
  return notifications
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createNotification(
  notification: Omit<Notification, 'id' | 'createdAt' | 'read'>
): Promise<Notification> {
  const newNotification: Notification = {
    ...notification,
    id: uuidv4(),
    read: false,
    createdAt: new Date().toISOString(),
  };
  notifications.push(newNotification);
  return newNotification;
}

export async function markAsRead(id: string): Promise<void> {
  const notification = notifications.find((n) => n.id === id);
  if (notification) {
    notification.read = true;
  }
}

export async function getUnreadCount(userId: string): Promise<number> {
  return notifications.filter((n) => n.userId === userId && !n.read).length;
}
