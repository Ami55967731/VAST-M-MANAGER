import { useNavigate } from "react-router-dom";

import "./ChangePasswordOtp.css";

import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";
import VerifyOtpForm from "../../components/VerifyOtpForm/VerifyOtpForm";

export default function ChangePasswordOtp() {
  const navigate = useNavigate();

  return (
    <div className="change-password-otp-page">

      <ProfileHeader
        title="Profile"
        showBackButton
      />

      <div className="change-password-otp-content">

        <VerifyOtpForm
          title="Change password"
          showLock
          email=""
          onSuccess={() =>
            navigate("/create-new-password", {
              state: {
                purpose: "change-password",
              },
            })
          }
        />

      </div>

    </div>
  );
}