import { useLocation, useNavigate } from "react-router-dom";

import "./VerifyOtp.css";

import AuthLayout from "../../components/AuthLayout/AuthLayout";
import VerifyOtpForm from "../../components/VerifyOtpForm/VerifyOtpForm";

import OtpHeader from "../../assets/images/AuthHeader3.svg";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  return (
    <AuthLayout
      header={OtpHeader}
      showBackButton
      backTo="/forgot-password"
    >
      <VerifyOtpForm
     email={email}
      onSuccess={() =>
     navigate("/create-new-password", {
      state: { email },
     })
       }
        />
    </AuthLayout>
  );
}