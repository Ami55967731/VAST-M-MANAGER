import { useNavigate } from "react-router-dom";

import "./ProfileHeader.css";

import ArrowLeft from "../../assets/images/arrow-down.svg";

interface ProfileHeaderProps {
  title: string;
  showBackButton?: boolean;
  backTo?: string;
  disabled?: boolean;
}

export default function ProfileHeader({
  title,
  showBackButton = false,
  backTo,
  disabled = false,
}: ProfileHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (disabled) return;

    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="profile-header">
      {showBackButton && (
        <button
          type="button"
          className="profile-back-button"
          onClick={handleBack}
          disabled={disabled}
          aria-label="Go Back"
        >
          <img
            src={ArrowLeft}
            alt="Back"
          />
        </button>
      )}

      <h2>{title}</h2>
    </header>
  );
}