import "./MeetingInput.css";

interface MeetingInputProps {
  label: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
  icon?: string;
  rightIcon?: string;
  readOnly?: boolean;
  onClick?: () => void;
}

export default function MeetingInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  textarea = false,
  icon,
  rightIcon,
  readOnly = false,
  onClick,
}: MeetingInputProps) {
  return (
    <div className="meeting-input">
      <label>{label}</label>

      <div
        className={
          textarea
            ? "meeting-input-wrapper meeting-textarea-wrapper"
            : "meeting-input-wrapper"
        }
        onClick={onClick}
      >
        {icon && (
          <img
            src={icon}
            className="meeting-left-icon"
            alt=""
          />
        )}

        {textarea ? (
          <textarea
            className="meeting-textarea"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
          />
        ) : (
          <input
            className="meeting-input-field"
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
          />
        )}

        {rightIcon && (
          <img
            src={rightIcon}
            className="meeting-right-icon"
            alt=""
          />
        )}
      </div>
    </div>
  );
}