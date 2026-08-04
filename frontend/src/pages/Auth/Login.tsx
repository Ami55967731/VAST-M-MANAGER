import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import "./Login.css";

import { login } from "../../services/AuthService";

import LoginHeader from "../../assets/images/AuthHeader2.svg";

import AuthInput from "../../components/AuthInput/AuthInput";
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import SocialLogin from "../../components/SocialLogin/SocialLogin";
import Checkbox from "../../components/Checkbox/Checkbox";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

const handleLogin = async (
  e: FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  setError("");

  if (!email.trim() || !password.trim()) {
    setError("Please enter your email and password.");
    return;
  }

  try {
    await login({
      email,
      password,
    });

    if (rememberMe) {
      localStorage.setItem("remember_me", "true");
    } else {
      localStorage.removeItem("remember_me");
    }

    navigate("/home");
  } catch (err: any) {
    console.error(err);

    const message = err?.response?.data?.message;

    if (Array.isArray(message)) {
      setError(message.join(", "));
    } else {
      setError(
        message || "Invalid email or password."
      );
    }
  }
};

  

  return (
    <div className="login-page">
      <img
        src={LoginHeader}
        alt="Login Header"
        className="login-header"
      />

      <form
        className="login-content"
        onSubmit={handleLogin}
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

        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);

            if (error) {
              setError("");
            }
          }}
        />

        {error && (
          <p className="login-error">
            {error}
          </p>
        )}

        <div className="login-options">
          <Checkbox
            checked={rememberMe}
            label="Remember Me"
            onChange={() => setRememberMe(!rememberMe)}
          />

          <button
            type="button"
            className="forgot-password"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </button>
        </div>

        <SocialLogin
          onGoogleClick={() => console.log("Google")}
          onAppleClick={() => console.log("Apple")}
          onFacebookClick={() => console.log("Facebook")}
        />

        <PrimaryButton
          text="Login"
          type="submit"
        />

        <p className="register-link">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>
            Create an account
          </span>
        </p>
      </form>
    </div>
  );
}