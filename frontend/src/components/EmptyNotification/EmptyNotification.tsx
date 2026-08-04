import "./EmptyNotification.css";

import EmptyNotificationImage from "../../assets/images/Frame 4572.svg";

interface EmptyNotificationProps {
  tab?: "today" | "previous";
}

export default function EmptyNotification({
  tab = "today",
}: EmptyNotificationProps) {
  return (
    <div className="empty-notification">

      <p className="empty-notification-description">
        {tab === "today"
          ? "You have no notifications today."
          : "You have no previous notifications."}
      </p>

      <img
        src={EmptyNotificationImage}
        alt="No Notifications"
        className="empty-notification-image"
      />

    </div>
  );
}