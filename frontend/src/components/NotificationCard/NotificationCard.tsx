import "./NotificationCard.css";

import VMLogo from "../../assets/icons/Frame 740 (3).svg";

import type { Notification } from "../../types/Notification";

interface NotificationCardProps {
  notification: Notification;
  onRead?: (id: number) => void;
}

export default function NotificationCard({
  notification,
  onRead,
}: NotificationCardProps) {
  const notificationDate = new Date(notification.createdAt);
  const today = new Date();
  const isToday =
    notificationDate.toDateString() === today.toDateString();
  const formattedTime = isToday
    ? notificationDate.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })
    : notificationDate.toLocaleDateString([], {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });

  return (
    <button
      type="button"
      className={`notification-card ${notification.isRead ? "read" : "unread"}`}
      onClick={() => onRead?.(notification.id)}
    >

      <div className="notification-icon">
        <img
          src={VMLogo}
          alt="Vast Meeting Manager"
        />
      </div>

      <div className="notification-content">

        <div className="notification-top">

          <h3 className="notification-title">
            {notification.title}
          </h3>

          <span className="notification-time">
            {formattedTime}
          </span>

        </div>

        <p className="notification-message">
          {notification.message}
        </p>

      </div>

    </button>
  );
}