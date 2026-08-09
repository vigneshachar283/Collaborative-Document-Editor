import { Clock3, FileText, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

function formatDate(value) {
  if (!value) return "Just now";
  const date = new Date(value);
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

export default function DocumentCard({ document, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="document-card">
      <Link className="document-card-main" to={`/document/${document._id}`}>
        <div className="document-icon">
          <FileText size={21} />
        </div>
        <div className="document-card-info">
          <h3>{document.title || "Untitled document"}</h3>
          <p>{document.content?.slice(0, 80) || "Empty document"}</p>
          <span><Clock3 size={13} /> Updated {formatDate(document.updatedAt)}</span>
        </div>
      </Link>

      <div className="card-menu-wrap">
        <button
          className="icon-button subtle"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Document actions"
        >
          <MoreHorizontal size={18} />
        </button>

        {menuOpen && (
          <div className="card-menu">
            <Link to={`/document/${document._id}`} onClick={() => setMenuOpen(false)}>
              Open
            </Link>
            <button
              className="danger-menu"
              onClick={() => {
                setMenuOpen(false);
                onDelete(document);
              }}
            >
              <Trash2 size={15} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}