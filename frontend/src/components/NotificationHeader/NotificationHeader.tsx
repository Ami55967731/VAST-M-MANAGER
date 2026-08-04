import { useNavigate } from "react-router-dom";

import "./NotificationHeader.css";



import BackArrow from "../../assets/images/Vector.svg";

export default function NotificationHeader() {
  const navigate = useNavigate();

  return (
    <header className="notification-header">

      <button
        className="notification-back-btn"
        onClick={() => navigate(-1)}
      >
        <img
          src={BackArrow}
          alt="Back"
        />
      </button>

      <h1 className="notification-title">
        Notifications
      </h1>

    </header>
  );
}