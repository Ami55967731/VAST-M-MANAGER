import "./ConfirmModal.css";

import DeleteIllustration from "../../assets/images/DeleteIllustration.svg";

interface ConfirmModalProps {
  open: boolean;

  image?: string;

  title: string;

  message: string;

  confirmText?: string;

  cancelText?: string;

  hideCancelButton?: boolean;

  onConfirm: () => void;

  onCancel?: () => void;
}

export default function ConfirmModal({
  open,
  image,
  title,
  message,
  confirmText = "Delete",
  cancelText,
  hideCancelButton = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div
      className={`bottom-sheet-overlay ${
        open ? "show" : ""
      }`}
    >
      <div
        className="bottom-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirm-content">
          <img
            src={image || DeleteIllustration}
            alt={title}
            className="confirm-image"
          />

          <h2 className="confirm-title">
            {title}
          </h2>

          <p className="confirm-message">
            {message}
          </p>

          <div className="confirm-buttons">
            <button
              className="confirm-delete-btn"
              onClick={onConfirm}
            >
              {confirmText}
            </button>
{!hideCancelButton && cancelText && (
  <button
    className="confirm-cancel-btn"
    onClick={onCancel}
  >
    {cancelText}
  </button>
)}
          </div>
        </div>
      </div>
    </div>
  );
}