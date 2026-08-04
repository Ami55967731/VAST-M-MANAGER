import { useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./CreateNewPassword.css";

import AuthLayout from "../../components/AuthLayout/AuthLayout";
import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import LoadingIndicator from "../../components/LoadingIndicator/LoadingIndicator";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

import PasswordHeader from "../../assets/images/AuthHeader4.svg";
import LockIcon from "../../assets/icons/Lock.svg";
import SuccessImage from "../../assets/images/Success.svg";

export default function CreateNewPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const purpose =
    location.state?.purpose || "forgot-password";

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showLoading, setShowLoading] =
    useState(false);

  const [showSuccess, setShowSuccess] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = () => {
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setShowLoading(true);

    setTimeout(() => {
      setShowLoading(false);
      setShowSuccess(true);
    }, 1500);
  };

  const form = (
    <>
     {purpose === "change-password" && (
  <div className="password-title">
    <div className="password-title-row">
      <h2>Change password</h2>

      <img
        src={LockIcon}
        alt="Lock"
        className="password-lock-icon"
      />
    </div>
  </div>
)}

      {purpose === "change-password" ? (

        <div className="password-card">

          <PasswordInput
            label="Choose Password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
          />

          {error && (
            <p className="password-error">
              {error}
            </p>
          )}

          <PrimaryButton
            text={
              showLoading
                ? "Updating..."
                : "Create New Password"
            }
            disabled={showLoading}
            onClick={handleSubmit}
          />

        </div>

      ) : (

        <>
          <PasswordInput
            label="New Password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
          />

          {error && (
            <p className="password-error">
              {error}
            </p>
          )}

          <PrimaryButton
            text={
              showLoading
                ? "Updating..."
                : "Create New Password"
            }
            disabled={showLoading}
            onClick={handleSubmit}
          />
        </>

      )}

      <LoadingIndicator
  open={showLoading}
  title="Updating Password..."
/>

      <ConfirmModal
        open={showSuccess}
        image={SuccessImage}
        title="Password Changed!"
        message="Your password has been updated successfully."
        confirmText="Done"
        onConfirm={() => {
          setShowSuccess(false);

          if (
            purpose === "forgot-password"
          ) {
            navigate("/login");
          } else {
            navigate("/profile");
          }
        }}
        onCancel={() => {}}
        hideCancelButton
      />
    </>
  );

  if (purpose === "change-password") {
    return (
      <div className="create-password-page">

        <ProfileHeader
          title="Profile"
          showBackButton
        />

        <div className="create-password-content">
          {form}
        </div>

      </div>
    );
  }

  return (
    <AuthLayout
      header={PasswordHeader}
      showBackButton
    >
      {form}
    </AuthLayout>
  );
}