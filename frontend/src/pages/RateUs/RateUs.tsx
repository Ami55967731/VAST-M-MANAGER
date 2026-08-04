import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./RateUs.css";

import RateUsHeader from "../../components/RateUsHeader/RateUsHeader";
import RatingAvatars from "../../components/RatingAvatar/RatingAvatar";
import RatingSelector from "../../components/RatingSelector/RatingSelector";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import BottomNavigation from "../../components/ButtomNavigation/ButtomNavigation";
import LoadingIndicator from "../../components/LoadingIndicator/LoadingIndicator";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

import SuccessImage from "../../assets/images/Success.svg";

export default function RateUs() {
  const navigate = useNavigate();

  const [rating, setRating] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);

  const [showSuccess, setShowSuccess] =
    useState(false);

  const handleProceed = async () => {
    if (!rating) return;

    setLoading(true);

    try {
      // Temporary loading
      await new Promise((resolve) =>
        setTimeout(resolve, 2000)
      );

      setLoading(false);

      setShowSuccess(true);
    } catch (error) {
      console.error(error);

      setLoading(false);
    }
  };

  const handleDone = () => {
    setShowSuccess(false);

    navigate("/profile");
  };

  return (
    <div className="rate-us-page">

      <RateUsHeader />

      <div className="rate-us-content">

        <RatingAvatars />

        <RatingSelector
          value={rating}
          onChange={setRating}
        />

      </div>

      <div className="rate-button">

        <PrimaryButton
          text="Proceed"
          onClick={handleProceed}
          disabled={!rating || loading}
        />

      </div>

      {/* Loading Indicator */}

      <LoadingIndicator
  open={loading}
  title="Submitting Rating..."
/>

      {/* Success Modal */}

      <ConfirmModal
        open={showSuccess}
        image={SuccessImage}
        title="Rating Successful!"
        message="Thank you for choosing to give us a rating. We will continue to improve our app."
        confirmText="Done"
        onConfirm={handleDone}
       
      />

      <BottomNavigation />

    </div>
  );
}