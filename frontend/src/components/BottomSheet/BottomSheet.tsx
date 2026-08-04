import "./BottomSheet.css";

interface BottomSheetProps {
  open: boolean;
  children: React.ReactNode;
}

export default function BottomSheet({
  open,
  children,
}: BottomSheetProps) {
  return (
    <div className={`bottom-sheet-overlay ${open ? "show" : ""}`}>
  <div className="bottom-sheet">
    {children}
  </div>
</div>
  );
}