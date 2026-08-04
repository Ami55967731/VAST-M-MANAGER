import "./TermsContent.css";

import { TERMS } from "../../data/Terms";

export default function TermsContent() {
  return (
   <div className="terms-content">

  <h3 className="terms-date">
    Last revised: {TERMS.lastRevised}
  </h3>

  <div className="terms-introduction">
    {TERMS.introduction.map((paragraph, index) => (
      <p key={index}>{paragraph}</p>
    ))}
  </div>

  <div className="terms-sections">
    {TERMS.sections.map((section, index) => (
      <div key={index} className="terms-section">
        <h4>{section.title}</h4>
        <p>{section.body}</p>
      </div>
    ))}
  </div>

</div>
  );
}