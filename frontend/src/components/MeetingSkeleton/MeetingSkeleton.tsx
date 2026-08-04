import "./MeetingSkeleton.css";

export default function MeetingSkeleton() {
  return (
    <div className="meeting-skeleton-list">
      {[1, 2, 3].map((item) => (
        <div className="meeting-skeleton-card" key={item}>
          <div className="line large"></div>
          <div className="line medium"></div>
          <div className="line small"></div>
          <div className="line medium"></div>
          <div className="line small"></div>
        </div>
      ))}
    </div>
  );
}