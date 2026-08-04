import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, } from "framer-motion";

import V from "../../assets/images/V.svg";
import VM from "../../assets/images/VM.svg";
import VMM from "../../assets/images/VMM.svg";

type LogoStage = 0 | 1 | 2;

export default function Splash() {
  const navigate = useNavigate();

  const [stage, setStage] = useState<LogoStage>(0);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 500),
      setTimeout(() => setStage(2), 1500),
      setTimeout(() => setShowText(true), 2600),
      setTimeout(() => {
        navigate("/onboarding");
      }, 7000),
    ];

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [navigate]);

  const logos = [V, VM, VMM];

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#FFFFFF",
         transform:" translateY(-200px)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={stage}
            src={logos[stage]}
            alt="Vast Meeting Manager Logo"
            initial={{
              opacity: 0,
              x: 45,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: -15,
            }}
            transition={{
              duration: 0.45,
              ease: [0.4, 0, 0.2, 1],
            }}
          />
        </AnimatePresence>

        <AnimatePresence>
          {showText && (
            <motion.p
              initial={{
                opacity: 0,
                x: 30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
              }}
              style={{
                marginTop: 20,
                fontSize: 20,
                fontFamily: "Urbanist, sans-serif",
                fontWeight: 600,
                color: "#1789FC",
              }}
            >
              Vast Meeting Manager
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}