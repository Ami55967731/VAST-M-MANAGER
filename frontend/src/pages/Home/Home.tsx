import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import "./Home.css";

import HomeHeader from "../../components/HomeHeader/HomeHeader";
import MeetingTabs, {
  type Tab,
} from "../../components/MeetingTabs/MeetingTabs";
import MeetingCard from "../../components/MeetingCard/MeetingCard";
import MeetingSkeleton from "../../components/MeetingSkeleton/MeetingSkeleton";
import EmptyState from "../../components/EmptyState/EmptyState";
import BottomNavigation from "../../components/ButtomNavigation/ButtomNavigation";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

import {
  getMeetings,
  deleteMeeting,
  type Meeting,
} from "../../services/MeetingService";

export default function Home() {
  const location = useLocation();

  /* ---------------- ACTIVE TAB ---------------- */

  const [activeTab, setActiveTab] = useState<Tab>(
    location.state?.activeTab ?? "today"
  );

  /* ---------------- LOADING ---------------- */

  const showSkeleton =
    location.state?.showSkeleton || false;

  const [loading, setLoading] =
    useState(showSkeleton);

  /* ---------------- MEETINGS ---------------- */

  const [meetings, setMeetings] =
    useState<Meeting[]>([]);

  /* ---------------- DELETE ---------------- */

  const [confirmOpen, setConfirmOpen] =
    useState(false);

  const [selectedMeetingId, setSelectedMeetingId] =
    useState<string | null>(null);

  const selectedMeeting = meetings.find(
    (meeting) =>
      meeting.id === selectedMeetingId
  );

  /* ---------------- LOAD MEETINGS ---------------- */

  const loadMeetings = async () => {
    try {
      const data = await getMeetings();
      setMeetings(data);
    } catch (error) {
      console.error("Failed to fetch meetings", error);
    }
  };

  /* ---------------- INITIAL LOAD ---------------- */

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const initialize = async () => {
      if (showSkeleton) {
        timer = setTimeout(async () => {
          await loadMeetings();
          setLoading(false);

          window.history.replaceState({}, "");
        }, 2500);
      } else {
        await loadMeetings();
        setLoading(false);
      }
    };

    initialize();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showSkeleton]);

  /* ---------------- REFRESH ---------------- */

  useEffect(() => {
    loadMeetings();
  }, [location.key]);

  /* ---------------- DELETE ---------------- */

  const handleOpenDeleteModal = (
    id: string
  ) => {
    setSelectedMeetingId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async (
    id: string
  ) => {
    try {
      await deleteMeeting(id);

      await loadMeetings();

      setConfirmOpen(false);
      setSelectedMeetingId(null);
    } catch (error) {
      console.error(error);
    }
  };

  /* ---------------- FILTER ---------------- */

  const filteredMeetings = meetings.filter(
    (meeting) => {
      switch (activeTab) {
        case "today":
          return meeting.status === "TODAY";

        case "upcoming":
          return meeting.status === "UPCOMING";

        case "completed":
          return meeting.status === "COMPLETED";

        default:
          return true;
      }
    }
  );

  /* ---------------- EMPTY STATE ---------------- */

  const emptyStateContent = {
    today: {
      title:
        "Don't have any available meetings today.",
      description:
        "Meetings scheduled for today will appear here.",
    },

    upcoming: {
      title:
        "No upcoming meetings yet.",
      description:
        "Future meetings you create will appear here.",
    },

    completed: {
      title:
        "No completed meetings yet.",
      description:
        "Completed meetings will appear here after they end.",
    },
  };

  return (
    <div className="home-page">
      <HomeHeader />

      <div className="home-content">
        <MeetingTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="meeting-list">
          {loading ? (
            <>
              <MeetingSkeleton />
              <MeetingSkeleton />
              <MeetingSkeleton />
            </>
          ) : filteredMeetings.length === 0 ? (
            <EmptyState
              title={
                emptyStateContent[
                  activeTab
                ].title
              }
              description={
                emptyStateContent[
                  activeTab
                ].description
              }
            />
          ) : (
            filteredMeetings.map(
              (meeting, index) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={{
                    ...meeting,
                    active:
                      index % 2 === 0,
                  }}
                  onDelete={
                    handleOpenDeleteModal
                  }
                />
              )
            )
          )}
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title={`Delete ${
          selectedMeeting?.title ??
          "Meeting"
        }`}
        message={`Are you sure you want to delete ${
          selectedMeeting?.title ??
          "this meeting"
        } from your schedule?`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          if (selectedMeetingId) {
            handleDelete(selectedMeetingId);
          }
        }}
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedMeetingId(null);
        }}
      />

      <BottomNavigation />
    </div>
  );
}