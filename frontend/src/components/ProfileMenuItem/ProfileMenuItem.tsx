import "./ProfileMenuItem.css";

import ChevronRight from "../../assets/icons/arrow-down (2).svg";

interface ProfileMenuItemProps {
  icon: string;
  title: string;
  onClick: () => void;
}

export default function ProfileMenuItem({
  icon,
  title,
  onClick,
}: ProfileMenuItemProps) {
  return (
    <button
      type="button"
      className="profile-menu-item"
      onClick={onClick}
    >
      <div className="profile-menu-left">
        <img
          src={icon}
          alt=""
          className="profile-menu-icon"
          aria-hidden="true"
        />

        <span className="profile-menu-title">
          {title}
        </span>
      </div>

      <img
        src={ChevronRight}
        alt=""
        aria-hidden="true"
        className="profile-menu-arrow"
      />
    </button>
  );
}