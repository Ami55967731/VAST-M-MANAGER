import "./LoadingIndicator.css";

import BottomSheet from "../BottomSheet/BottomSheet";

interface LoadingIndicatorProps {
  open: boolean;
  title?: string;
  message?: string;
}

export default function LoadingIndicator({
  open,
  title = "Loading...",
  message,
}: LoadingIndicatorProps) {
  return (
    <BottomSheet open={open}>
      <div className="loading-indicator">

        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <h2>{title}</h2>

        {message && <p>{message}</p>}

      </div>
    </BottomSheet>
  );
}