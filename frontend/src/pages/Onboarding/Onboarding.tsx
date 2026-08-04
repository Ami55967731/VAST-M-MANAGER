import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Screen1 from "../../assets/onboarding/Frame1.png";
import Screen2 from "../../assets/onboarding/Frame2.png";
import Screen3 from "../../assets/onboarding/Frame3.png";

import "./Onboarding.css";

const slides = [
  {
    image: Screen1,
    title: "Welcome to Vast Meeting Manager, your personal calendar manager",
    subtitle:
      "Let's organize your life, one event at a time",
  },
  {
    image: Screen2,
    title: "Manage your meetings and schedules with ease",
    subtitle:
      "Where event planning meets simplicity. Let's guide you through a seamless journey of managing your activities effortlessly.",
  },
  {
    image: Screen3,
    title: "Stay organised and stay inspired",
    subtitle:
      "Get ready to elevate your meeting game! Vast is here to keep you organized and inspired.",
  },
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const navigate = useNavigate();

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const skip = () => {
    setCurrentSlide(slides.length - 1);
  };

  return (
    <div className="onboarding">

      {/* Top Button */}

      {currentSlide !== 2 ? (
        <button
          className="topButton"
          onClick={currentSlide === 0 ? skip : nextSlide}
        >
          {currentSlide === 0 ? "Skip" : "Next"}
        </button>
      ) : (
        <div className="topSpacer" />
      )}

      {/* Slide */}

      <AnimatePresence mode="wait">

        <motion.div
          key={currentSlide}
          className="slide"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{
            duration: 0.45,
          }}
        >

          <img
            src={slides[currentSlide].image}
            alt="Onboarding"
            className="slideImage"
          />

          <h1 className="title">
            {slides[currentSlide].title}
          </h1>

          <p className="subtitle">
            {slides[currentSlide].subtitle}
          </p>

        </motion.div>

      </AnimatePresence>

      {/* Indicators */}

      <div className="indicatorContainer">

        {slides.map((_, index) => (
          <motion.div
            key={index}
            className={`indicator ${
              currentSlide === index ? "activeIndicator" : ""
            }`}
            layout
          />
        ))}

      </div>

      {/* Buttons */}

      {currentSlide === 2 && (

        <motion.div
          className="bottomButtons"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >

          <button
            className="primaryButton"
            onClick={() => navigate("/register")}
          >
            Create an account
          </button>

          <button
            className="secondaryButton"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

        </motion.div>

      )}

      {/* Invisible Next Area */}

      {currentSlide < 2 && (
        <button
          className="nextArea"
          onClick={nextSlide}
        />
      )}

    </div>
  );
}