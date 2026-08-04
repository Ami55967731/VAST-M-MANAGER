import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { forgotPassword } from "../../services/AuthService";

import "./ForgotPassword.css";

import AuthLayout from "../../components/AuthLayout/AuthLayout";
import AuthInput from "../../components/AuthInput/AuthInput";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";

import ForgotHeader from "../../assets/images/AuthHeader3.svg";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleProceed = async () => {
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    try {
      await forgotPassword({ email });

      navigate("/verify-otp", {
        state: { email },
      });
    } catch (err: any) {
      console.error(err);

      const message = err?.response?.data?.message;

      if (Array.isArray(message)) {
        setError(message.join(", "));
      } else {
        setError(
          message || "Unable to send OTP."
        );
      }
    }
  };

  return (
    <AuthLayout
      header={ForgotHeader}
      showBackButton={true}
      backTo="/login"
    >
      <AuthInput
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);

          if (error) {
            setError("");
          }
        }}
      />

      {error && (
        <p className="forgot-error">
          {error}
        </p>
      )}

      <PrimaryButton
        text="Proceed"
        onClick={handleProceed}
      />
    </AuthLayout>
  );
}