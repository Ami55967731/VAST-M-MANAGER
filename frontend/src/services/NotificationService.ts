import type { Notification } from "../types/Notification";

export async function getNotifications(): Promise<Notification[]> {
  return [];
}

export async function createNotification(
  _notification: Notification
): Promise<void> {
  // Backend API will go here later
}

export async function markAsRead(
  _id: string | number
): Promise<void> {
  // Backend API will go here later
}

export async function deleteNotification(
  _id: number
): Promise<void> {
  // Backend API will go here later
}

export async function getUnreadNotificationCount(): Promise<number> {
  const notifications = await getNotifications();

  return notifications.filter(
    (notification) => !notification.isRead
  ).length;
}