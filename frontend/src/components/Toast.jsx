import { CheckCircle2, XCircle } from "lucide-react";

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <button className={`toast toast-${toast.type}`} onClick={onClose}>
      {toast.type === "success" ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
      <span>{toast.message}</span>
    </button>
  );
}