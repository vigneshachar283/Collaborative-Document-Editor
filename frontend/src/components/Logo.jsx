import { FileText } from "lucide-react";

export default function Logo({ compact = false }) {
  return (
    <div className={`brand ${compact ? "brand-compact" : ""}`}>
      <span className="brand-mark"><FileText size={19} /></span>
      {!compact && <span>CollabSpace</span>}
    </div>
  );
}