import "./SocialLogin.css";

import Google from "../../assets/icons/google.svg";
import Apple from "../../assets/icons/apple.svg";
import Facebook from "../../assets/icons/facebook.svg";

interface SocialLoginProps {
  onGoogleClick?: () => void;
  onAppleClick?: () => void;
  onFacebookClick?: () => void;
}

export default function SocialLogin({
  onGoogleClick,
  onAppleClick,
  onFacebookClick,
}: SocialLoginProps) {
  return (
    <div className="social-login">
      <p className="social-title">Continue with</p>

      <div className="social-icons">
        <button
          type="button"
          className="social-button"
          onClick={onGoogleClick}
          aria-label="Continue with Google"
        >
          <img src={Google} alt="Google" />
        </button>

        <button
          type="button"
          className="social-button"
          onClick={onAppleClick}
          aria-label="Continue with Apple"
        >
          <img src={Apple} alt="Apple" />
        </button>

        <button
          type="button"
          className="social-button"
          onClick={onFacebookClick}
          aria-label="Continue with Facebook"
        >
          <img src={Facebook} alt="Facebook" />
        </button>
      </div>
    </div>
  );
}