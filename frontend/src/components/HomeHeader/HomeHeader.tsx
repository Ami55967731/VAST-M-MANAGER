import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { getUnreadNotificationCount } from "../../services/NotificationService";
import { subscribeToNotifications } from "../../services/NotificationRealtime";
import { getCurrentUser } from "../../services/UserService";

import "./HomeHeader.css";

import Notification from "../../assets/icons/BellRinging.svg";
import DefaultAvatar from "../../assets/images/Avatar.png";

export default function HomeHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const [unreadCount, setUnreadCount] = useState(0);

  const [user, setUser] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    avatar: "",
  });

  const [profileImage, setProfileImage] =
    useState(DefaultAvatar);

  useEffect(() => {
    const loadData = async () => {
      try {
        const count =
          await getUnreadNotificationCount();
        setUnreadCount(count);

        const currentUser =
          await getCurrentUser();

        setUser(currentUser);

        if (currentUser.avatar) {
          setProfileImage(currentUser.avatar);
        } else {
          setProfileImage(DefaultAvatar);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadData();

    const unsubscribe = subscribeToNotifications(() => {
      setUnreadCount((count) => count + 1);
    });

    return unsubscribe;
  }, [location.pathname]);

  const today = new Date().toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <header className="home-header">
      <div className="header-top">
        <div className="user-info">
          <img
            src={profileImage || DefaultAvatar}
            alt="Profile"
            className="profile-image"
          />

          <div>
            <p className="header-date">{today}</p>

            <h2 className="header-name">
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : "Guest"}
            </h2>
          </div>
        </div>

        <button
          className="notification-btn"
          onClick={() =>
            navigate("/notification")
          }
        >
          <img
            src={Notification}
            alt="Notification"
          />

          {unreadCount > 0 && (
            <span className="notification-badge">
              {unreadCount > 99
                ? "99+"
                : unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}