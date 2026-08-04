import { useNavigate } from "react-router-dom";

import "./RateUsHeader.css";

import BackIcon from "../../assets/images/arrow-down.svg";

export default function RateUsHeader() {
  const navigate = useNavigate();

  return (
    <header className="rate-header">

      <button
        className="rate-back-btn"
        onClick={() => navigate("/profile")}
      >
        <img
          src={BackIcon}
          alt="Back"
        />
      </button>

      <h2 className="rate-title">
        Rate Us
      </h2>

      {/* Keeps the title centered */}
      <div className="rate-placeholder" />

    </header>
  );
}