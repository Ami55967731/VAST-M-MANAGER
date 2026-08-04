import "./Terms.css";

import TermsHeader from "../../components/TermsHeader/TermsHeader";
import TermsContent from "../../components/TermsContent/TermsContent";
import BottomNavigation from "../../components/ButtomNavigation/ButtomNavigation";

export default function Terms() {
  return (
    <div className="terms-page">

      <TermsHeader />

      <TermsContent />

      <BottomNavigation />

    </div>
  );
}