import { useEffect, useState } from "react";

import "./Notification.css";

import NotificationHeader from "../../components/NotificationHeader/NotificationHeader";
import NotificationTabs, {
  type NotificationTab,
} from "../../components/NotificationTabs/NotificationTabs";
import EmptyNotification from "../../components/EmptyNotification/EmptyNotification";
import NotificationSkeleton from "../../components/NotificationSkeleton/NotificationSkeleton";
import NotificationCard from "../../components/NotificationCard/NotificationCard";

import type { Notification as NotificationType } from "../../types/Notification";

import {
  getNotifications,
  markAsRead,
} from "../../services/NotificationService";
import { subscribeToNotifications } from "../../services/NotificationRealtime";

export default function Notification() {
  const [activeTab, setActiveTab] =
    useState<NotificationTab>("today");

  const [loading, setLoading] =
    useState(true);

  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await getNotifications();

        setNotifications(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();

    const unsubscribe = subscribeToNotifications((notification) => {
      setNotifications((current) => {
        const withoutDuplicate = current.filter(
          (item) => item.id !== notification.id,
        );
        return [notification, ...withoutDuplicate];
      });
    });

    return unsubscribe;
  }, []);

  const isToday = (createdAt: string) => {
    const notificationDate = new Date(createdAt);
    const today = new Date();

    return (
      notificationDate.getFullYear() === today.getFullYear() &&
      notificationDate.getMonth() === today.getMonth() &&
      notificationDate.getDate() === today.getDate()
    );
  };

  const filteredNotifications = notifications.filter((notification) =>
    activeTab === "today"
      ? isToday(notification.createdAt)
      : !isToday(notification.createdAt)
  );

  const handleRead = async (id: string | number) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );

    await markAsRead(id);
  };

  return (
    <div className="notification-page">

      <NotificationHeader />

      <NotificationTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {loading ? (
        <>
          <NotificationSkeleton />
          <NotificationSkeleton />
          <NotificationSkeleton />
          <NotificationSkeleton />
        </>
      ) : filteredNotifications.length === 0 ? (
        <EmptyNotification tab={activeTab} />
      ) : (
        filteredNotifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onRead={handleRead}
          />
        ))
      )}

    </div>
  );
}