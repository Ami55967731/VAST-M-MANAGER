import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import VLogo from "../../assets/images/V.svg";
import VMMLogo from "../../assets/images/VMM.svg";

function Splash() {
  const navigate = useNavigate();

  const [showFullLogo, setShowFullLogo] = useState(false);

  useEffect(() => {
    const logoTimer = setTimeout(() => {
      setShowFullLogo(true);
    }, 1500);

    const pageTimer = setTimeout(() => {
      navigate("/onboarding");
    }, 3500);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(pageTimer);
    };
  }, [navigate]);

  return (
    <div className="w-full h-full bg-white flex items-center justify-center">

      {!showFullLogo ? (
        <img
          src={VLogo}
          alt="V Logo"
          className="animate-scaleFade"
          style={{ width: 32, height: 'auto' }}
        />
      ) : (
        <div className="flex flex-col items-center animate-fadeIn">
          <img
            src={VMMLogo}
            alt="VMM Logo"
            style={{ width: 146, height: 72 }}
          />

          <p className="mt-3 text-[#1789FC] heading-2">
            Vast Meeting Manager
          </p>
        </div>
      )}

    </div>
  );
}

export default Splash;