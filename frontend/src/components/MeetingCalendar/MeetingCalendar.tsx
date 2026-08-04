import { useEffect, useState } from "react";
import "./MeetingCalendar.css";

import ChevronDown from "../../assets/icons/arrow-down.svg";

interface MeetingCalendarProps {
  value: string;
  onSelect: (date: string) => void;
  onClose: () => void;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const weekdays = ["M", "T", "W", "T", "F", "S", "S"];

const formatDateValue = (day: number, month: number, year: number) => {
  const monthValue = String(month + 1).padStart(2, "0");
  const dayValue = String(day).padStart(2, "0");

  return `${year}-${monthValue}-${dayValue}`;
};

const parseDateValue = (value: string) => {
  if (!value) {
    return null;
  }

  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return {
      year: Number(year),
      month: Number(month) - 1,
      day: Number(day),
    };
  }

  const humanMatch = value.match(/^(\d{1,2})\s+([A-Za-z]+),\s+(\d{4})$/);
  if (humanMatch) {
    const [, day, monthLabel, year] = humanMatch;
    const monthIndex = months.findIndex(
      (item) => item.toLowerCase() === monthLabel.toLowerCase()
    );

    if (monthIndex >= 0) {
      return {
        year: Number(year),
        month: monthIndex,
        day: Number(day),
      };
    }
  }

  return null;
};

export default function MeetingCalendar({
  value,
  onSelect,
  onClose,
}: MeetingCalendarProps) {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const firstDay = new Date(year, month, 1).getDay();

  const offset = firstDay === 0 ? 6 : firstDay - 1;

  const parsedValue = parseDateValue(value);
  const selectedDay = parsedValue?.day;

  useEffect(() => {
    if (parsedValue) {
      setMonth(parsedValue.month);
      setYear(parsedValue.year);
    }
  }, [parsedValue]);

  const years = Array.from(
  { length: 21 },
  (_, index) => 2020 + index
);

  const previousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <div className="meeting-calendar">
<div className="calendar-header">
  <div
  className="calendar-title"
  onClick={() =>
    setShowMonthYearPicker(!showMonthYearPicker)
  }
>
  <span>
    {months[month]} {year}
  </span>

  <img
    src={ChevronDown}
    className={`calendar-chevron ${
      !showMonthYearPicker ? "rotate" : ""
    }`}
    alt=""
  />
</div>

        {!showMonthYearPicker && (
  <div className="calendar-actions">
    <button onClick={previousMonth}>↑</button>
    <button onClick={nextMonth}>↓</button>
  </div>
)}

      </div>
{showMonthYearPicker ? (

  <div className="month-year-picker">

    {/* Years */}

    <div className="year-list">
      {years.map((item) => (
        <button
          key={item}
          className={item === year ? "active-year" : ""}
          onClick={() => setYear(item)}
        >
          {item}
        </button>
      ))}
    </div>

    {/* Months */}

    <div className="month-grid">
      {months.map((item, index) => (
        <button
          key={item}
          className={index === month ? "active-month" : ""}
          onClick={() => {
            setMonth(index);
            setShowMonthYearPicker(false);
          }}
        >
          {item.slice(0, 3)}
        </button>
      ))}
    </div>

  </div>

) : (

  <>
    <div className="calendar-weekdays">
  {weekdays.map((day, index) => (
    <span key={index}>
      {day}
    </span>
  ))}
</div>

    <div className="calendar-grid">
      {Array.from({ length: offset }).map((_, index) => (
        <div key={index}></div>
      ))}

      {Array.from({ length: daysInMonth }).map((_, index) => {
        const day = index + 1;

        return (
          <button
            key={day}
            className={
              selectedDay === day
                ? "calendar-day selected"
                : "calendar-day"
            }
            onClick={() => {
              onSelect(formatDateValue(day, month, year));
              onClose();
            }}
          >
            {day}
          </button>
        );
      })}
    </div>
  </>

    )}
      </div>
  );
}

    
