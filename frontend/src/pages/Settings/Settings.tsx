import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./Settings.css";

import { getCurrentUser, updateUser } from "../../services/UserService";

import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";
import DefaultAvatar from "../../assets/images/Avatar.png";

import CameraIcon from "../../assets/icons/Camera.svg";
import ArrowLeft from "../../assets/icons/ArrowLeft.svg";
import GlobeIcon from "../../assets/icons/GeoGray.svg";
import LockIcon from "../../assets/icons/Lock.svg";
import ChevronRight from "../../assets/icons/arrow-down (2).svg";

export default function Settings() {
  const navigate = useNavigate();

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
  const loadUser = async () => {
    try {
      const currentUser =
        await getCurrentUser();

      setUser(currentUser);

      setProfileImage(
        currentUser.avatar || DefaultAvatar
      );
    } catch (error) {
      console.error(error);
    }
  };

  loadUser();
}, []);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const handleImageChange = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = async () => {
    const image = reader.result as string;

    try {
      const updatedUser =
        await updateUser(user.id, {
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: image,
        });

      setUser(updatedUser);

      setProfileImage(
        updatedUser.avatar || DefaultAvatar
      );
    } catch (error) {
      console.error(error);
    }
  };

  reader.readAsDataURL(file);
};

  return (
    <div className="settings-page">

      <header className="settings-header">
        <ProfileHeader
  title="Profile"
  showBackButton
/>

        <button
          className="settings-back"
          onClick={() => navigate(-1)}
        >
          <img
            src={ArrowLeft}
            alt="Back"
          />
        </button>

        

      </header>

      <div className="settings-avatar">

        <img
          src={profileImage}
          alt="Profile"
          className="settings-profile-image"
        />

        <button
          className="settings-camera"
          onClick={() =>
            fileInputRef.current?.click()
          }
        >
          <img
            src={CameraIcon}
            alt="Camera"
          />
        </button>

        <input
          hidden
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

      </div>

      <h3 className="settings-title">
        Settings
      </h3>

      <div className="settings-card">

        <button
          className="settings-item"
          onClick={() =>
            navigate("/change-name")
          }
        >
          <div className="settings-left">

            <img
              src={GlobeIcon}
              alt=""
            />

            <span>Change name</span>

          </div>

          <img
            src={ChevronRight}
            alt=""
          />

        </button>

        <div className="settings-divider" />

        <button
         className="settings-item"
  onClick={() =>
    navigate("/change-password-otp"
    
    )
  }
        >
          <div className="settings-left">

            <img
              src={LockIcon}
              alt=""
            />

            <span>Change password</span>

          </div>

          <img
            src={ChevronRight}
            alt=""
          />

        </button>

      </div>

    </div>
  );
}