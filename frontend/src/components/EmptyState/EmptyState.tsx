

import "./EmptyState.css";

import EmptyIllustration from "../../assets/images/Frame 4572.svg";


interface EmptyStateProps {
  title: string;
  description: string;
  buttonText?: string;
}

export default function EmptyState({
  title,
  description,
 
}: EmptyStateProps) {
  

  return (
    <div className="empty-state">

      <h2>{title}</h2>

      <p>{description}</p>
      
      <img
        src={EmptyIllustration}
        alt="No meetings"
        className="empty-image"
      />

      

      
      

    </div>
  );
}