import { useNavigate } from "react-router-dom";

import "./TermsHeader.css";

import BackIcon from "../../assets/images/arrow-down.svg";

export default function TermsHeader() {
  const navigate = useNavigate();

  return (
    <header className="terms-header">

      <button
        className="terms-back-button"
        onClick={() => navigate(-1)}
      >
        <img src={BackIcon} alt="Back" />
      </button>

      <h2>Terms & condition</h2>

      <div className="terms-header-space" />

    </header>
  );
}