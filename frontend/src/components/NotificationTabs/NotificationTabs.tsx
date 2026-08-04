import "./NotificationTabs.css";

export type NotificationTab = "today" | "previous";

interface NotificationTabsProps {
  activeTab: NotificationTab;
  onTabChange: (tab: NotificationTab) => void;
}

export default function NotificationTabs({
  activeTab,
  onTabChange,
}: NotificationTabsProps) {
  return (
    <div className="notification-tabs">

      <button
        className={
          activeTab === "today"
            ? "notification-tab active"
            : "notification-tab"
        }
        onClick={() => onTabChange("today")}
      >
        Today
      </button>

      <button
        className={
          activeTab === "previous"
            ? "notification-tab active"
            : "notification-tab"
        }
        onClick={() => onTabChange("previous")}
      >
        Previous
      </button>

    </div>
  );
}