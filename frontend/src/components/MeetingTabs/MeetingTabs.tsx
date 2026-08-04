
import "./MeetingTabs.css";

export type Tab = "today" | "upcoming" | "completed";

interface MeetingTabsProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function MeetingTabs({
  activeTab,
  onTabChange,
}: MeetingTabsProps) {
  return (
    <div className="meeting-tabs-container">
      <button
        className={activeTab === "today" ? "tab active" : "tab"}
        onClick={() => onTabChange("today")}
      >
        Today
      </button>

      <button
        className={activeTab === "upcoming" ? "tab active" : "tab"}
        onClick={() => onTabChange("upcoming")}
      >
        Upcoming
      </button>

      <button
        className={activeTab === "completed" ? "tab active" : "tab"}
        onClick={() => onTabChange("completed")}
      >
        Completed
      </button>
    </div>
  );
}