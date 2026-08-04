import "./NotificationSkeleton.css";

export default function NotificationSkeleton() {
  return (
    <>
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="notification-skeleton-card"
        >
          <div className="notification-skeleton-icon" />

          <div className="notification-skeleton-info">
            <div className="line line-1" />
            <div className="line line-2" />
            <div className="line line-3" />
            <div className="line line-4" />
          </div>
        </div>
      ))}
    </>
  );
}