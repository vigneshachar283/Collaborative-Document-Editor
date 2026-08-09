import { useEffect, useMemo, useState } from "react";
import { FilePlus2, FolderOpen, LoaderCircle, Plus, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import DocumentCard from "../components/DocumentCard";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import { documentApi } from "../services/api";
import { clearToken } from "../utils/auth";

export default function Dashboard() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  function showToast(message, type = "success") {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 2800);
  }

  async function loadDocuments() {
    try {
      setLoading(true);
      const data = await documentApi.list();
      setDocuments(data.documents || []);
    } catch (err) {
      if (/token|unauthorized|expired/i.test(err.message)) {
        clearToken();
        navigate("/login", { replace: true });
        return;
      }
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  const filteredDocuments = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return documents;
    return documents.filter((doc) =>
      `${doc.title} ${doc.content}`.toLowerCase().includes(normalized)
    );
  }, [documents, query]);

  async function createDocument() {
    const title = newTitle.trim() || "Untitled document";

    try {
      setCreating(true);
      const data = await documentApi.create({ title, content: "" });
      setNewTitle("");
      showToast("Document created");
      navigate(`/document/${data.document._id}`);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setCreating(false);
    }
  }

  async function deleteDocument() {
    if (!deleteTarget) return;

    try {
      await documentApi.remove(deleteTarget._id);
      setDocuments((current) => current.filter((doc) => doc._id !== deleteTarget._id));
      setDeleteTarget(null);
      showToast("Document deleted");
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  return (
    <AppShell
      query={query}
      setQuery={setQuery}
      onNewDocument={() => setCreating(true)}
      title="Your documents"
    >
      <div className="dashboard-toolbar">
        <div>
          <p className="section-label">{documents.length} document{documents.length === 1 ? "" : "s"}</p>
          <p className="section-description">Everything you've created in one place.</p>
        </div>
        <button className="ghost-button" onClick={loadDocuments} disabled={loading}>
          <RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="empty-state">
          <LoaderCircle className="spin" size={28} />
          <p>Loading your workspace...</p>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            {query ? <FolderOpen size={25} /> : <FilePlus2 size={25} />}
          </div>
          <h3>{query ? "No matching documents" : "Your workspace is empty"}</h3>
          <p>
            {query
              ? "Try another search term."
              : "Create your first document and start building your workspace."}
          </p>
          {!query && (
            <button className="primary-button" onClick={() => setCreating(true)}>
              <Plus size={17} /> Create document
            </button>
          )}
        </div>
      ) : (
        <div className="document-grid">
          {filteredDocuments.map((document) => (
            <DocumentCard
              key={document._id}
              document={document}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <Modal
        open={creating}
        title="Create document"
        onClose={() => !creating && setCreating(false)}
      >
        <div className="modal-body">
          <label>
            Document title
            <input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Project notes"
              onKeyDown={(e) => {
                if (e.key === "Enter") createDocument();
              }}
            />
          </label>
          <div className="modal-actions">
            <button className="ghost-button" onClick={() => setCreating(false)}>
              Cancel
            </button>
            <button className="primary-button" onClick={createDocument} disabled={creating}>
              {creating ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        title="Delete document?"
        onClose={() => setDeleteTarget(null)}
      >
        <div className="modal-body">
          <p className="modal-copy">
            This will permanently delete <strong>{deleteTarget?.title}</strong>.
          </p>
          <div className="modal-actions">
            <button className="ghost-button" onClick={() => setDeleteTarget(null)}>
              Cancel
            </button>
            <button className="danger-button" onClick={deleteDocument}>
              Delete
            </button>
          </div>
        </div>
      </Modal>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </AppShell>
  );
}