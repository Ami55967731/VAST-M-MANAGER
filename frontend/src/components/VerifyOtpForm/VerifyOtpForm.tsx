import { useState } from "react";
import { verifyOtp } from "../../services/AuthService";

import "./VerifyOtpForm.css";

import LockIcon from "../../assets/icons/Lock.svg";
import PrimaryButton from "../PrimaryButton/PrimaryButton";

interface VerifyOtpFormProps {
  email: string;
  title?: string;
  showLock?: boolean;
  instruction?: string;
  buttonText?: string;
  onSuccess: () => void;
}

export default function VerifyOtpForm({
  email,
  title,
  showLock = false,
  instruction = "Enter the six-digit code sent to your email.",
  buttonText = "Proceed",
  onSuccess,
}: VerifyOtpFormProps) {
  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [error, setError] = useState("");

  const handleChange = (
    index: number,
    value: string
  ) => {
    if (!/^\d?$/.test(value)) return;

    if (error) {
      setError("");
    }

    const updatedOtp = [...otp];
    updatedOtp[index] = value;

    setOtp(updatedOtp);

    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(
        `otp-${index + 1}`
      ) as HTMLInputElement | null;

      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key !== "Backspace") return;

    const updatedOtp = [...otp];

    if (updatedOtp[index] !== "") {
      updatedOtp[index] = "";
      setOtp(updatedOtp);
      return;
    }

    if (index > 0) {
      updatedOtp[index - 1] = "";
      setOtp(updatedOtp);

      const previousInput = document.getElementById(
        `otp-${index - 1}`
      ) as HTMLInputElement | null;

      previousInput?.focus();
    }
  };

  const handleEnter = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleProceed();
    }
  };

 const handleProceed = async () => {
  const enteredOtp = otp.join("");

  if (enteredOtp.length !== 6) {
    setError("Please enter the complete 6-digit code.");
    return;
  }

  try {
    await verifyOtp({
      email,
      otp: enteredOtp,
    });

    setError("");

    onSuccess();
  } catch (err: any) {
    console.error(err);

    const message = err?.response?.data?.message;

    if (Array.isArray(message)) {
      setError(message.join(", "));
    } else {
      setError(message || "Invalid verification code.");
    }
  }
};

  return (
    <>
      {title && (
        <div className="verify-title-row">
          <h2 className="verify-title">
            {title}
          </h2>

          {showLock && (
            <img
              src={LockIcon}
              alt=""
              className="verify-lock"
            />
          )}
        </div>
      )}

      <p className="otp-instruction">
        {instruction}
      </p>

      <div className="otp-container">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            className="otp-input"
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) =>
              handleChange(index, e.target.value)
            }
            onKeyDown={(e) =>
              handleKeyDown(index, e)
            }
            onKeyPress={handleEnter}
          />
        ))}
      </div>

      {error && (
        <p className="otp-error">
          {error}
        </p>
      )}

      <PrimaryButton
        text={buttonText}
        onClick={handleProceed}
      />
    </>
  );
}