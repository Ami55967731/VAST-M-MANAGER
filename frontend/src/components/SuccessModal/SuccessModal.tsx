import "./SuccessModal.css";


import BottomSheet from "../BottomSheet/BottomSheet";
import PrimaryButton from "../PrimaryButton/PrimaryButton";

interface SuccessModalProps {
  open: boolean;
  image: string;

  title: string;
  description: string;

  buttonText?: string;

  onClose: () => void;
}

export default function SuccessModal({
  open,
  image,
  title,
  description,
  buttonText = "Done",
  onClose,
}: SuccessModalProps) {
  return (
    <BottomSheet open={open}>
      <div className="success-modal">

        <img
          src={image}
          alt=""
          className="success-image"
        />

        <h2>{title}</h2>

        <p>{description}</p>

        <PrimaryButton
          text={buttonText}
          onClick={onClose}
        />

      </div>
    </BottomSheet>
  );
}