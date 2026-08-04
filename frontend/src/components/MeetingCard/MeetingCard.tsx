import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Meeting } from "../../services/MeetingService";
import { updateMeetingStatus } from "../../services/MeetingService";

import "./MeetingCard.css";

import MeetingMenu from "../MeetingMenu/MeetingMenu";

import ThreeDotsBlue from "../../assets/icons/ThreeDotsBlue.svg";
import ThreeDotsWhite from "../../assets/icons/ThreeDotsWhite.svg";

import CalendarGray from "../../assets/icons/CalendarGray.svg";
import CalendarWhite from "../../assets/icons/CalendarWhite.svg";

import GeoGray from "../../assets/icons/GeoGray.svg";
import GeoWhite from "../../assets/icons/GeoWhite.svg";

import ClockGray from "../../assets/icons/Clock.svg";
import ClockWhite from "../../assets/icons/ClockWhite.svg";

import LocationGray from "../../assets/icons/MapPin.svg";
import LocationWhite from "../../assets/icons/MapPinWhite.svg";

import PeopleBlue from "../../assets/images/UserBlue.png";
import PeopleWhite from "../../assets/images/UserWhite.png";

import ChartBlue from "../../assets/icons/ChartBlue.svg";
import ChartGray from "../../assets/icons/ChartGray.svg";

interface MeetingCardProps {
  meeting: Meeting & {
    active?: boolean;
  };

  onDelete: (id: string) => void;
}

export default function MeetingCard({
  meeting,
  onDelete,
}: MeetingCardProps) {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const lastSyncedStatusRef = useRef(meeting.status);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const isBlue = Boolean(meeting.active);
  const peopleImage = isBlue ? PeopleWhite : PeopleBlue;
  const threeDots = isBlue ? ThreeDotsWhite : ThreeDotsBlue;
  const calendar = isBlue ? CalendarWhite : CalendarGray;
  const globe = isBlue ? GeoWhite : GeoGray;
  const clock = isBlue ? ClockWhite : ClockGray;
  const location = isBlue ? LocationWhite : LocationGray;
  const chart = isBlue ? ChartGray : ChartBlue;

  const startTime = useMemo(() => new Date(meeting.startTime), [meeting.startTime]);
  const endTime = useMemo(() => new Date(meeting.endTime), [meeting.endTime]);

  const formattedDate = useMemo(
    () =>
      startTime.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    [startTime]
  );

  const formattedTime = useMemo(
    () =>
      startTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [startTime]
  );

  const countdownInfo = useMemo(() => {
    const startTimestamp = startTime.getTime();
    const endTimestamp = endTime.getTime();
    const currentTimestamp = now;
    const wasNotCompleted = meeting.status !== "COMPLETED";

    if (currentTimestamp < startTimestamp) {
      const remainingMs = startTimestamp - currentTimestamp;
      const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      return {
        label: `Starts in ${days}d ${hours}h ${minutes}m ${seconds}s`,
        status: "UPCOMING" as const,
      };
    }

    if (currentTimestamp >= endTimestamp) {
      return {
        label: wasNotCompleted ? "Meeting was not completed" : "Meeting Completed",
        status: "COMPLETED" as const,
      };
    }

    return {
      label: "Meeting Started",
      status: "TODAY" as const,
    };
  }, [endTime, meeting.status, now, startTime]);

  const computedStatus = countdownInfo.status;
  const canEdit = computedStatus !== "COMPLETED";
  const canDelete = computedStatus !== "COMPLETED";

  useEffect(() => {
    if (computedStatus === lastSyncedStatusRef.current) {
      return;
    }

    lastSyncedStatusRef.current = computedStatus;

    void updateMeetingStatus(meeting.id, computedStatus).catch(() => {
      lastSyncedStatusRef.current = meeting.status;
    });
  }, [computedStatus, meeting.id, meeting.status]);

  return (
    <div
      className={`meeting-card ${
        isBlue ? "meeting-card-active" : ""
      }`}
    >
      <div className="meeting-header">
        <div className="meeting-left">
          <img
            src={peopleImage}
            alt=""
            className="meeting-avatar"
          />

          <div className="meeting-text">
            <p className="meeting-description">
              {meeting.description}
            </p>

            <h2 className="meeting-title">
              {meeting.title}
            </h2>

            <p className="meeting-description">
              {countdownInfo.label}
            </p>
          </div>
        </div>

        {computedStatus !== "COMPLETED" && (
          <div className="meeting-menu">
            <button
              className="menu-button"
              onClick={() => setMenuOpen(true)}
            >
              <img
                src={threeDots}
                alt="Menu"
              />
            </button>

            <MeetingMenu
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              canEdit={canEdit}
              canDelete={canDelete}
              onEdit={() =>
                navigate(`/edit-meeting/${meeting.id}`)
              }
              onDelete={() => {
                onDelete(meeting.id);
                setMenuOpen(false);
              }}
            />
          </div>
        )}
      </div>

      <div className="meeting-divider" />

      <div className="meeting-body">
        <div className="meeting-details">
          <div className="detail-row">
            <img src={calendar} alt="" />
            <span>{formattedDate}</span>
          </div>

          <div className="detail-row">
            <img src={globe} alt="" />
            <span>{meeting.timezone}</span>
          </div>

          <div className="detail-row">
            <img src={clock} alt="" />
            <span>{formattedTime}</span>
          </div>

          <div className="detail-row">
            <img src={location} alt="" />
            <span>{meeting.location}</span>
          </div>
        </div>

        <img
          src={chart}
          alt=""
          className="meeting-chart"
        />
      </div>
    </div>
  );
}