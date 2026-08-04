import { NavLink, useLocation } from "react-router-dom";



import "./ButtomNavigation.css";

import HomeIconGray from "../../assets/icons/HomeGray.svg";
import HomeIconBlue from "../../assets/icons/HomeBlue.svg";

import CalendarIconGray from "../../assets/icons/CreatingMeetingGray.svg";
import CalendarIconBlue from "../../assets/icons/CreatingMeetingBlue.svg";

import ProfileIconGray from "../../assets/icons/ProfileGray.svg";
import ProfileIconBlue from "../../assets/icons/ProfileBlue.svg";

export default function BottomNavigation() {
  const location = useLocation();

const profileActive =
  location.pathname === "/profile" ||
  location.pathname === "/terms"   ||
  location.pathname === "/RateUs"  ||
  location.pathname === "/Settings" ||
  location.pathname === "/change-name" ||
  location.pathname === "/change-password" ||
    location.pathname === "/change-password-otp";

  return (
    <nav className="bottom-navigation">
      <NavLink
        to="/home"
        className={({ isActive }) =>
          isActive ? "Navigation-item active" : "Navigation-item"
        }
      >
        {({ isActive }) => (
          <>
        <img src={isActive ? HomeIconBlue : HomeIconGray} alt="Home" />
        <span>Home</span>
        </>
        )}
      </NavLink>

      <NavLink
        to="/create-meeting"
        className={({ isActive }) =>
          isActive ? "Navigation-item active" : "Navigation-item"
        }
      >
        {({ isActive }) => (
          <>
            <img src={isActive ? CalendarIconBlue : CalendarIconGray} alt="Create Meeting" />
            <span>Create Meeting</span>
          </>
        )}
      </NavLink>

     <NavLink
  to="/profile"
  className={() =>
    profileActive
      ? "Navigation-item active"
      : "Navigation-item"
  }
>
  {() => (
    <>
      <img
        src={
          profileActive
            ? ProfileIconBlue
            : ProfileIconGray
        }
        alt="Profile"
      />

      <span>Profile</span>
    </>
  )}
</NavLink>
    </nav>
  );
}