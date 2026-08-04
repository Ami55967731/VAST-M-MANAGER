import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { register } from "../../services/AuthService";

import "./Register.css";

import AuthHeader from "../../assets/images/AuthHeader1.svg";

import AuthInput from "../../components/AuthInput/AuthInput";
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import SocialLogin from "../../components/SocialLogin/SocialLogin";

export default function Register() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");

  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    /* ---------------- Validation ---------------- */

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    try {
      await register({
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        email,
        password,
      });

      navigate("/login");
    } catch (err: any) {
      console.error(err);

      const message =
        err?.response?.data?.message;

      if (Array.isArray(message)) {
        setError(message.join(", "));
      } else {
        setError(
          message ||
            "Registration failed. Please try again."
        );
      }
    }
  };

  return (
    <div className="register-page">
      <img
        src={AuthHeader}
        alt="Authentication Header"
        className="register-header"
      />

      <form
        className="register-content"
        onSubmit={handleRegister}
      >
        <AuthInput
          label="First Name"
          placeholder="Enter your first name"
          value={firstName}
          onChange={(e) =>
            setFirstName(e.target.value)
          }
        />

        <AuthInput
          label="Last Name"
          placeholder="Enter your last name"
          value={lastName}
          onChange={(e) =>
            setLastName(e.target.value)
          }
        />

        <AuthInput
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <PasswordInput
          label="Choose Password"
          placeholder="Enter password"
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
            setConfirmPassword(
              e.target.value
            )
          }
        />

        {error && (
          <p className="register-error">
            {error}
          </p>
        )}

        <SocialLogin />

        <PrimaryButton
          text="Create an account"
          type="submit"
        />

        <p className="login-link">
          Already have an account?
          <span
            onClick={() =>
              navigate("/login")
            }
          >
            {" "}
            Login
          </span>
        </p>
      </form>
    </div>
  );
}