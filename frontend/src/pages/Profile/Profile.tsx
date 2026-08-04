import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { logout } from "../../services/AuthService";
import {
  getCurrentUser,
  updateUser,
} from "../../services/UserService";

import "./Profile.css";

import DefaultAvatar from "../../assets/images/Avatar.png";
import LogoutImage from "../../assets/images/DeleteIllustration.svg";

import CameraIcon from "../../assets/icons/Camera.svg";
import GearSix from "../../assets/icons/GearSix.svg";
import Sparkle from "../../assets/icons/Sparkle.svg";
import ShieldCheck from "../../assets/icons/ShieldCheck.svg";
import LogOut from "../../assets/icons/SignOut.svg";

import BottomNavigation from "../../components/ButtomNavigation/ButtomNavigation";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import ProfileMenuItem from "../../components/ProfileMenuItem/ProfileMenuItem";

export default function Profile() {
  const navigate = useNavigate();

  /* ---------------- USER ---------------- */

  const [user, setUser] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    avatar: "",
  });

  /* ---------------- PROFILE IMAGE ---------------- */

  const [profileImage, setProfileImage] =
    useState(DefaultAvatar);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  /* ---------------- LOGOUT MODAL ---------------- */

  const [showLogoutModal, setShowLogoutModal] =
    useState(false);

  /* ---------------- LOAD USER ---------------- */

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

  /* ---------------- CHANGE PROFILE IMAGE ---------------- */

  const handleProfileImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

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

  /* ---------------- LOGOUT ---------------- */

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="profile-page">
      {/* Header */}

      <header className="profile-header">
        <h2>Profile</h2>
      </header>

      {/* User */}

      <div className="profile-user">
        <div className="profile-avatar">
          <img
            src={profileImage}
            alt="Profile"
            className="profile-avatar-image"
          />

          <button
            type="button"
            className="camera-button"
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
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={
              handleProfileImageChange
            }
          />
        </div>

      </div>

      {/* Account */}

      <section className="profile-section">
        <h3>Account</h3>

        <div className="profile-card">
          <ProfileMenuItem
            icon={GearSix}
            title="Settings"
            onClick={() =>
              navigate("/settings")
            }
          />

          <div className="profile-divider" />

          <ProfileMenuItem
            icon={Sparkle}
            title="Rate us"
            onClick={() =>
              navigate("/rateus")
            }
          />
        </div>
      </section>

      {/* About */}

      <section className="profile-section">
        <h3>About</h3>

        <div className="profile-card">
          <ProfileMenuItem
            icon={ShieldCheck}
            title="Terms & condition"
            onClick={() =>
              navigate("/terms")
            }
          />

          <div className="profile-divider" />

          <ProfileMenuItem
            icon={LogOut}
            title="Logout"
            onClick={() =>
              setShowLogoutModal(true)
            }
          />
        </div>
      </section>

      {/* Logout Modal */}

      <ConfirmModal
        open={showLogoutModal}
        image={LogoutImage}
        title="Logout"
        message="Are you sure you want to logout from your account?"
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={handleLogout}
        onCancel={() =>
          setShowLogoutModal(false)
        }
      />

      {/* Bottom Navigation */}

      <BottomNavigation />
    </div>
  );
}