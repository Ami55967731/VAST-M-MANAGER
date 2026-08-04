import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./ChangeName.css";

import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";
import AuthInput from "../../components/AuthInput/AuthInput";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import LoadingIndicator from "../../components/LoadingIndicator/LoadingIndicator";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

import EditIcon from "../../assets/icons/edit .svg";
import SuccessImage from "../../assets/images/Success.svg";

import {
  getCurrentUser,
  updateUser,
} from "../../services/UserService";

export default function ChangeName() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [showLoading, setShowLoading] =
    useState(false);

  const [showSuccess, setShowSuccess] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user =
          await getCurrentUser();

        setUserId(user.id);
        setFirstName(user.firstName);
        setLastName(user.lastName);
      } catch (error) {
        console.error(error);
      }
    };

    loadUser();
  }, []);

  const handleSave = async () => {
    setError("");

    if (
      !firstName.trim() ||
      !lastName.trim()
    ) {
      setError(
        "Please enter both first and last name."
      );
      return;
    }

    try {
      setShowLoading(true);

      await updateUser(userId, {
        firstName,
        lastName,
      });

      setShowLoading(false);
      setShowSuccess(true);
    } catch (error) {
      console.error(error);

      setShowLoading(false);

      setError(
        "Unable to update your name. Please try again."
      );
    }
  };

  return (
    <>
      <div className="change-name-page">
        <ProfileHeader
          title="Profile"
          showBackButton
          disabled={
            showLoading || showSuccess
          }
        />

        <div className="change-name-content">
          <div className="change-name-title">
            <h3>Change name</h3>

            <img
              src={EditIcon}
              alt="Edit"
            />
          </div>

          <AuthInput
            label="First Name"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) =>
              setFirstName(e.target.value)
            }
          />

          <AuthInput
            label="Last Name"
            placeholder="Enter last name"
            value={lastName}
            onChange={(e) =>
              setLastName(e.target.value)
            }
          />

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          <div className="save-button">
            <PrimaryButton
              text="Save changes"
              onClick={handleSave}
            />
          </div>
        </div>
      </div>

      <LoadingIndicator
        open={showLoading}
        title="Updating Name..."
      />

      <ConfirmModal
        open={showSuccess}
        image={SuccessImage}
        title="Name Updated!"
        message="Your name has been updated successfully."
        confirmText="Done"
        onConfirm={() => {
          setShowSuccess(false);

          navigate("/home", {
            state: {
              showSkeleton: true,
            },
          });
        }}
      />
    </>
  );
}