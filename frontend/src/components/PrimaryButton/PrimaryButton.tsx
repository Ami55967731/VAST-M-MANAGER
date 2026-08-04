import "./PrimaryButton.css";

interface PrimaryButtonProps {
  text: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
}

export default function PrimaryButton({
  text,
  type = "button",
  onClick,
  disabled = false,
}: PrimaryButtonProps) {
  return (
    <button
      className="primary-button"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}