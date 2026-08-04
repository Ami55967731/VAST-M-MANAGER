import "./PhoneFrame.css";

type PhoneFrameProps = {
  children: React.ReactNode;
};

export default function PhoneFrame({
  children,
}: PhoneFrameProps) {
  return (
    <div className="phone-wrapper">
      <div className="phone">
        <div className="dynamic-island" />
        <div className="phone-screen">
          {children}
        </div>
      </div>
    </div>
  );
}