import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./CreatingMeeting.css";

import { createMeeting } from "../../services/MeetingService";

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

export default function CreatingMeeting() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [location, setLocation] = useState("");
  const [timezone, setTimezone] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState("");

  const [createdMeeting, setCreatedMeeting] = useState<any>(null);

  const [showLoading, setShowLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [showTimezone, setShowTimezone] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const [errors, setErrors] = useState({
    title: "",
    location: "",
    timezone: "",
    time: "",
    duration: "",
    date: "",
  });
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

  const convertTo24Hour = (time12: string) => {
    const [time, modifier] = time12.split(" ");

    let hours: number;
    const [parsedHours, minutes] = time.split(":").map(Number);
    hours = parsedHours;

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

  const createMeetingStartTime = (
    dateValue: string,
    timeValue: string,
    timezoneValue: string
  ) => {
    const [year, month, day] = dateValue.split("-").map(Number);
    const [hours, minutes] = timeValue.split(":").map(Number);
    const wallClockTime = Date.UTC(year, month - 1, day, hours, minutes);
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezoneValue,
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).formatToParts(new Date(wallClockTime));
    const values = Object.fromEntries(
      parts
        .filter(({ type }) => type !== "literal")
        .map(({ type, value }) => [type, Number(value)])
    );
    const timezoneTime = Date.UTC(
      values.year,
      values.month - 1,
      values.day,
      values.hour === 24 ? 0 : values.hour,
      values.minute,
      values.second
    );

    return new Date(wallClockTime - (timezoneTime - wallClockTime)).toISOString();
  };

const handleProceed = async () => {
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

  if (hasErrors) {
    return;
  }

  try {
    const formattedTime = convertTo24Hour(time);

    const durationValue = Number(
      duration.replace(/\D/g, "")
    );

    if (isNaN(durationValue)) {
      setErrors((prev) => ({
        ...prev,
        duration: "Please enter a valid duration.",
      }));
      return;
    }

    if (durationValue < 1) {
      setErrors((prev) => ({
        ...prev,
        duration: "Duration must be at least 1 minute.",
      }));
      return;
    }

    const meetingPayload = {
      title,
      description: note || "",
      timezone,
      startTime: createMeetingStartTime(date, formattedTime, timezone),
      duration: durationValue,
      date,
      location,
      isRecurring: false,
    };

    setShowLoading(true);

    const [meeting] = await Promise.all([
      createMeeting(meetingPayload),
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ]);

    setCreatedMeeting(meeting);
    setShowLoading(false);
    setShowSuccess(true);
  } catch (error: any) {
    setShowLoading(false);
    const message = Array.isArray(error?.response?.data?.message)
      ? error.response.data.message.join(" ")
      : error?.response?.data?.message ||
        error?.message ||
        "Unable to create meeting right now.";

    setErrors((prev) => ({
      ...prev,
      title: message,
    }));
  }
};
  return (
    <div className="create-meeting-page">
      <header className="create-header">
        <h2>Create Meeting</h2>
      </header>

      <div className="create-form-container">
        <div className="create-form">

         <MeetingInput
  label="Meeting Title"
  placeholder="Business, Sales, Board..."
  value={title}
  onChange={(e) => {
    console.log("Typing title:", e.target.value);
    setTitle(e.target.value);
  }}
/>

          {errors.title && (
            <span className="field-error">{errors.title}</span>
          )}

          <MeetingInput
            label="Add Note (Optional)"
            textarea
            placeholder="Enter meeting note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <MeetingInput
            label="Location"
            placeholder="e.g. Ottawa, Canada"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);

              if (errors.location) {
                setErrors({ ...errors, location: "" });
              }
            }}
          />

          {errors.location && (
            <span className="field-error">{errors.location}</span>
          )}

          <div className="dropdown-container">
            <MeetingInput
              label="Select Time Zone"
              icon={timezone ? GeoIconBlue : GeoIconGray}
              rightIcon={showTimezone ? ChevronUp : ChevronDown}
              placeholder="Select Time Zone"
              value={
                timezones.find(
                  (tz) => tz.value === timezone
                )?.label || ""
              }
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

          <MeetingInput
            label="Pick Time"
            type="text"
            placeholder="01:00 PM"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);

              if (errors.time) {
                setErrors({ ...errors, time: "" });
              }
            }}
          />

          {errors.time && (
            <span className="field-error">{errors.time}</span>
          )}

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

          <div className="dropdown-container">
            <MeetingInput
              label="Select Date"
              icon={
                date
                  ? CalendarIconBlue
                  : CalendarIconGray
              }
              rightIcon={showCalendar ? ChevronUp : ChevronDown}
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
  text="Proceed"
  type="button"
  onClick={handleProceed}
  disabled={showLoading || showSuccess}
/>
        </div>

        <LoadingIndicator open={showLoading} />

     <SuccessModal
  open={showSuccess}
  image={SuccessImage}
  title="Meeting created successfully!"
  description={`${title} has been added to your meeting list.`}
  buttonText="Proceed"
  onClose={() => {
    setShowSuccess(false);

    navigate("/home", {
      state: {
        showSkeleton: true,
        newMeeting: createdMeeting,
        activeTab:
          new Date(`${date}T00:00:00`).toDateString() ===
          new Date().toDateString()
            ? "today"
            : undefined,
      },
    });
  }}
/>
      </div>
    </div>
  );
}