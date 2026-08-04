import "./Checkbox.css";
import CheckedIcon from "../../assets/icons/Vector.svg";

interface CheckboxProps {
  checked: boolean;
  label: string;
  onChange: () => void;
}

export default function Checkbox({
  checked,
  label,
  onChange,
}: CheckboxProps) {
  return (
    <label className="checkbox-container">
      <button
        type="button"
        className="checkbox-button"
        onClick={onChange}
      >
        {checked ? (
          <img
            src={CheckedIcon}
            alt="Checked"
            className="checkbox-image"
          />
        ) : (
          <span className="checkbox-empty" />
        )}
      </button>

      <span className="checkbox-label">
        {label}
      </span>
    </label>
  );
}