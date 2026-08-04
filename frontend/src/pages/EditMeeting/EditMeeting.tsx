import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getMeetings,
  updateMeeting,
} from "../../services/MeetingService";

import "./EditMeeting.css";


import MeetingInput from "../../components/MeetingInput/MeetingInput";
import MeetingCalendar from "../../components/MeetingCalendar/MeetingCalendar";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import LoadingIndicator from "../../components/LoadingIndicator/LoadingIndicator";
import SuccessModal from "../../components/SuccessModal/SuccessModal";

import CalendarIconGray from "../../assets/icons/CalendarGray.svg";
import CalendarIconBlue from "../../assets/icons/CalendarBlue.svg";

import GeoIconGray from "../../assets/icons/GeoGray.svg";
import GeoIconBlue from "../../assets/icons/GeoBlue.svg";

import ChevronDown from "../../assets/icons/ChevronDown.svg";
import ChevronUp from "../../assets/icons/ChevronUp.svg";

import SuccessImage from "../../assets/images/success.svg";

export default function EditMeeting() {
  const navigate = useNavigate();

  const { id } = useParams();

  /* ---------------- Meeting Data ---------------- */

  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [location, setLocation] = useState("");
  const [timezone, setTimezone] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState("");

  /* ---------------- Bottom Sheets ---------------- */

  const [showLoading, setShowLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  /* ---------------- Dropdowns ---------------- */

  const [showTimezone, setShowTimezone] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  /* ---------------- Validation ---------------- */

  const [errors, setErrors] = useState({
    title: "",
    location: "",
    timezone: "",
    time: "",
    duration: "",
    date: "",
  });

  /* ---------------- Timezones ---------------- */

const timezones = [
  {
    label: "(UTC +00:00) Coordinated Universal Time",
    value: "UTC",
  },
  {
    label: "(UTC +01:00) West Central Africa",
    value: "Africa/Lagos",
  },
  {
    label: "(UTC +02:00) Cairo",
    value: "Africa/Cairo",
  },
  {
    label: "(UTC +02:00) Johannesburg",
    value: "Africa/Johannesburg",
  },
  {
    label: "(UTC +03:00) Nairobi",
    value: "Africa/Nairobi",
  },
  {
    label: "(UTC +03:00) Moscow",
    value: "Europe/Moscow",
  },
  {
    label: "(UTC +04:00) Dubai",
    value: "Asia/Dubai",
  },
  {
    label: "(UTC +05:00) Islamabad, Karachi",
    value: "Asia/Karachi",
  },
  {
    label: "(UTC +05:30) Chennai, Kolkata, Mumbai, New Delhi",
    value: "Asia/Kolkata",
  },
  {
    label: "(UTC +06:00) Dhaka",
    value: "Asia/Dhaka",
  },
  {
    label: "(UTC +07:00) Bangkok, Hanoi, Jakarta",
    value: "Asia/Bangkok",
  },
  {
    label: "(UTC +08:00) Beijing, Singapore",
    value: "Asia/Singapore",
  },
  {
    label: "(UTC +09:00) Osaka, Sapporo, Tokyo",
    value: "Asia/Tokyo",
  },
  {
    label: "(UTC +09:00) Seoul",
    value: "Asia/Seoul",
  },
  {
    label: "(UTC +10:00) Sydney, Melbourne",
    value: "Australia/Sydney",
  },
  {
    label: "(UTC +12:00) Auckland, Wellington",
    value: "Pacific/Auckland",
  },
  {
    label: "(UTC -08:00) Pacific Time (US & Canada)",
    value: "America/Los_Angeles",
  },
  {
    label: "(UTC -07:00) Mountain Time (US & Canada)",
    value: "America/Denver",
  },
  {
    label: "(UTC -06:00) Central Time (US & Canada)",
    value: "America/Chicago",
  },
  {
    label: "(UTC -05:00) Eastern Time (US & Canada)",
    value: "America/New_York",
  },
  {
    label: "(UTC -03:00) Brasília",
    value: "America/Sao_Paulo",
  },
];

  /* ---------------- Load Meeting ---------------- */

  useEffect(() => {
  const loadMeeting = async () => {
    if (!id) return;

    try {
      const meetings = await getMeetings();

      const meeting = meetings.find(
        (item) => item.id === id
      );

      if (!meeting) return;

      setTitle(meeting.title);
      setNote(meeting.description);
      setLocation(meeting.location);
      setTimezone(meeting.timezone);

      setDate(new Date(meeting.date).toISOString().split("T")[0]);

      setTime(
        new Date(meeting.startTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );

      const durationMinutes =
        Math.floor(
          (new Date(meeting.endTime).getTime() -
            new Date(meeting.startTime).getTime()) /
            60000
        );

      setDuration(`${durationMinutes} mins`);
    } catch (error) {
      console.error(error);
    }
  };

  loadMeeting();
 }, [id]);


  /* ---------------- Update Meeting ---------------- */

  /* ---------------- Update Meeting ---------------- */

const convertTo24Hour = (time12: string) => {
  const [time, modifier] = time12.split(" ");

  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }

  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

const handleUpdate = async () => {
  const newErrors = {
    title: title ? "" : "Meeting title is required.",
    location: location ? "" : "Location is required.",
    timezone: timezone ? "" : "Please select a time zone.",
    time: time ? "" : "Please enter meeting time.",
    duration: duration ? "" : "Duration is required.",
    date: date ? "" : "Please select a date.",
  };

  setErrors(newErrors);

  const hasErrors = Object.values(newErrors).some(
    (error) => error !== ""
  );

  if (hasErrors || !id) return;

  try {
    const formattedTime = convertTo24Hour(time);
const durationValue = Number(duration.replace(/\D/g, ""));

await updateMeeting(id, {
  title,
  description: note,
  location,
  timezone,
  date,
  startTime: new Date(
    `${date}T${formattedTime}:00`
  ).toISOString(),
  duration: durationValue,
  isRecurring: false,
});
    setShowLoading(true);

    setTimeout(() => {
      setShowLoading(false);
      setShowSuccess(true);
    }, 2500);
  } catch (error) {
    console.error(error);
  }
};

    return (
    <div className="create-meeting-page">
      <header className="create-header">
        <h2>Edit Meeting</h2>
      </header>

      <div className="create-form-container">
        <div className="create-form">

          {/* Meeting Title */}

          <MeetingInput
            label="Meeting Title"
            placeholder="Business, Sales, Board..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);

              if (errors.title) {
                setErrors({
                  ...errors,
                  title: "",
                });
              }
            }}
          />

          {errors.title && (
            <span className="field-error">
              {errors.title}
            </span>
          )}

          {/* Note */}

          <MeetingInput
            label="Add Note (Optional)"
            textarea
            placeholder="Enter meeting note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          {/* Location */}

          <MeetingInput
            label="Location"
            placeholder="e.g. Ottawa, Canada"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);

              if (errors.location) {
                setErrors({
                  ...errors,
                  location: "",
                });
              }
            }}
          />

          {errors.location && (
            <span className="field-error">
              {errors.location}
            </span>
          )}

          {/* Timezone */}

          <div className="dropdown-container">

            <MeetingInput
              label="Select Time Zones"
              icon={timezone ? GeoIconBlue : GeoIconGray}
              rightIcon={
                showTimezone
                  ? ChevronDown
                  : ChevronUp
              }
              placeholder="Select Time Zone"
              value={timezone}
              readOnly
              onChange={() => {}}
              onClick={() =>
                setShowTimezone(!showTimezone)
              }
            />

            {showTimezone && (
              <div className="timezone-dropdown">

                {timezones.map((item) => (
  <button
    key={item.value}
    className="timezone-item"
    onClick={() => {
      setTimezone(item.value);

      setShowTimezone(false);

      if (errors.timezone) {
        setErrors({
          ...errors,
          timezone: "",
        });
      }
    }}
  >
    {item.label}
  </button>
))}

              </div>
            )}

            {errors.timezone && (
              <span className="field-error">
                {errors.timezone}
              </span>
            )}

          </div>

          {/* Time */}

          <MeetingInput
            label="Pick Time"
            placeholder="01:00 PM"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);

              if (errors.time) {
                setErrors({
                  ...errors,
                  time: "",
                });
              }
            }}
          />

          {errors.time && (
            <span className="field-error">
              {errors.time}
            </span>
          )}

          {/* Duration */}

          <MeetingInput
            label="Duration"
            placeholder="40 mins"
            value={duration}
            onChange={(e) => {
              setDuration(e.target.value);

              if (errors.duration) {
                setErrors({
                  ...errors,
                  duration: "",
                });
              }
            }}
          />

          {errors.duration && (
            <span className="field-error">
              {errors.duration}
            </span>
          )}

          {/* Date */}

          <div className="dropdown-container">

            <MeetingInput
              label="Select Date"
              icon={
                date
                  ? CalendarIconBlue
                  : CalendarIconGray
              }
              rightIcon={
                showCalendar
                  ? ChevronDown
                  : ChevronUp
              }
              placeholder="Select Date"
              value={date}
              readOnly
              onChange={() => {}}
              onClick={() =>
                setShowCalendar(!showCalendar)
              }
            />

            {showCalendar && (
              <div className="calendar-dropdown">

                <MeetingCalendar
                  value={date}
                  onSelect={(selectedDate) => {
                    setDate(selectedDate);

                    setShowCalendar(false);

                    if (errors.date) {
                      setErrors({
                        ...errors,
                        date: "",
                      });
                    }
                  }}
                  onClose={() =>
                    setShowCalendar(false)
                  }
                />

              </div>
            )}

            {errors.date && (
              <span className="field-error">
                {errors.date}
              </span>
            )}

          </div>

          <PrimaryButton
            text="Edit Meeting"
            type="button"
            onClick={handleUpdate}
          />

        </div>
                {/* Loading Bottom Sheet */}

        <LoadingIndicator
  open={showLoading}
  title="Updating Meeting..."
/>

        {/* Success Bottom Sheet */}

        <SuccessModal
          open={showSuccess}
          image={SuccessImage}
          title="Meeting edited successfully!"
          description={`${title} has been updated successfully.`}
          buttonText="Done"
          onClose={() => {
            setShowSuccess(false);

            navigate("/home", {
              state: {
                showSkeleton: true,
              },
            });
          }}
        />
      </div>
    </div>
  );
}