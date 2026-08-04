import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import "./AuthLayout.css";

import ArrowLeft from "../../assets/icons/ArrowLeft.svg";

interface AuthLayoutProps {
  header: string;
  children: ReactNode;
  showBackButton?: boolean;
  backTo?: string;
  disableBackButton?: boolean;
}

export default function AuthLayout({
  header,
  children,
  showBackButton = false,
  backTo = "/login",
  disableBackButton = false,
}: AuthLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-header-container">
        <img
          src={header}
          alt="Authentication Header"
          className="auth-header"
        />

        {showBackButton && (
      <button
  type="button"
  className={`back-button ${
    disableBackButton ? "back-button-disabled" : ""
  }`}
  aria-label="Go back"
  onClick={() => {
    if (disableBackButton) return;

    navigate(backTo);
  }}
>
  <img
    src={ArrowLeft}
    alt="Back"
  />
</button>
        )}
      </div>

      <div className="auth-content">
        {children}
      </div>
    </div>
  );
}