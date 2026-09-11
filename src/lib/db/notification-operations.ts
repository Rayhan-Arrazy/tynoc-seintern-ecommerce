import { v4 as uuidv4 } from 'uuid';
import type { Notification } from '@/types';

let notifications: Notification[] = [
  {
    id: uuidv4(),
    userId: 'user-1',
    type: 'system',
    title: 'Welcome to Tynoc!',
    message: 'Thanks for joining. Explore our latest products and exclusive deals.',
    read: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: uuidv4(),
    userId: 'user-1',
    type: 'order',
    title: 'Your order has been shipped',
    message: 'Order #ORD-001 is on its way. Track your shipment for updates.',
    read: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: uuidv4(),
    userId: 'user-1',
    type: 'promotion',
    title: '50% off summer sale',
    message: 'Enjoy half off on selected summer items. Limited time offer!',
    read: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
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
