import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Bold,
  Check,
  Clock3,
  Italic,
  Link as LinkIcon,
  LoaderCircle,
  MoreHorizontal,
  Redo2,
  Save,
  Share2,
  Sparkles,
  Underline,
  Undo2
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Toast from "../components/Toast";
import { documentApi } from "../services/api";

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const saveTimer = useRef(null);

  const [document, setDocument] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState(null);

  function showToast(message, type = "success") {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 2800);
  }

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const data = await documentApi.get(id);
        if (!active) return;
        setDocument(data.document);
        setTitle(data.document.title || "");
        setContent(data.document.content || "");
      } catch (err) {
        showToast(err.message, "error");
        if (/access denied|not found|token|unauthorized/i.test(err.message)) {
          window.setTimeout(() => navigate("/dashboard"), 700);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [id]);

  function scheduleSave(nextTitle = title, nextContent = content) {
    setDirty(true);

    if (saveTimer.current) clearTimeout(saveTimer.current);

    saveTimer.current = setTimeout(async () => {
      try {
        setSaving(true);
        const data = await documentApi.update(id, {
          title: nextTitle,
          content: nextContent
        });
        setDocument(data.document);
        setDirty(false);
        setSavedAt(new Date());
      } catch (err) {
        showToast(err.message, "error");
      } finally {
        setSaving(false);
      }
    }, 900);
  }

  function handleTitleChange(e) {
    const value = e.target.value;
    setTitle(value);
    scheduleSave(value, content);
  }

  function handleContentChange(e) {
    const value = e.target.value;
    setContent(value);
    scheduleSave(title, value);
  }

  async function saveNow() {
    if (saveTimer.current) clearTimeout(saveTimer.current);

    try {
      setSaving(true);
      const data = await documentApi.update(id, { title, content });
      setDocument(data.document);
      setDirty(false);
      setSavedAt(new Date());
      showToast("Saved");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  function exec(command, value = null) {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    if (editorRef.current) {
      const valueNow = editorRef.current.innerHTML;
      setContent(valueNow);
      scheduleSave(title, valueNow);
    }
  }

  function addLink() {
    const url = window.prompt("Enter URL");
    if (url) exec("createLink", url);
  }

  function syncEditorContent() {
    if (!editorRef.current) return;
    if (editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content || "";
    }
  }

  useEffect(() => {
    syncEditorContent();
  }, [loading]);

  if (loading) {
    return (
      <div className="editor-loading">
        <LoaderCircle className="spin" size={28} />
        Loading document...
      </div>
    );
  }

  if (!document) return null;

  return (
    <div className="editor-page">
      <header className="editor-topbar">
        <div className="editor-left">
          <Link to="/dashboard" className="icon-button" title="Back to documents">
            <ArrowLeft size={18} />
          </Link>
          <div className="editor-brand">
            <span className="brand-mark"><Save size={17} /></span>
            <div>
              <strong>CollabSpace</strong>
              <span>{saving ? "Saving..." : dirty ? "Unsaved changes" : savedAt ? "Saved just now" : "Saved"}</span>
            </div>
          </div>
        </div>

        <div className="editor-actions">
          <div className="save-state">
            {saving ? <LoaderCircle className="spin" size={15} /> : <Check size={15} />}
            {saving ? "Saving" : "Saved"}
          </div>
          <button className="ghost-button" onClick={() => showToast("Sharing will be added in the collaboration phase.")}>
            <Share2 size={16} /> Share
          </button>
          <button className="primary-button" onClick={saveNow} disabled={saving}>
            <Save size={16} /> Save
          </button>
        </div>
      </header>

      <div className="editor-workspace">
        <aside className="editor-side">
          <div className="side-document-title">{title || "Untitled document"}</div>
          <div className="editor-side-item active">Document</div>
          <div className="editor-side-item"><Clock3 size={15} /> Version history <span className="soon">Soon</span></div>
          <div className="editor-side-item"><Sparkles size={15} /> AI assistant <span className="soon">Soon</span></div>

          <div className="editor-side-footer">
            <div className="presence-placeholder">
              <div className="avatar small">V</div>
              <div>
                <strong>You</strong>
                <span>Owner</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="editor-main">
          <div className="document-sheet">
            <input
              className="document-title"
              value={title}
              onChange={handleTitleChange}
              placeholder="Untitled document"
            />

            <div className="editor-toolbar">
              <button title="Undo" onClick={() => exec("undo")}><Undo2 size={17} /></button>
              <button title="Redo" onClick={() => exec("redo")}><Redo2 size={17} /></button>
              <span className="toolbar-divider" />
              <button title="Bold" onClick={() => exec("bold")}><Bold size={17} /></button>
              <button title="Italic" onClick={() => exec("italic")}><Italic size={17} /></button>
              <button title="Underline" onClick={() => exec("underline")}><Underline size={17} /></button>
              <span className="toolbar-divider" />
              <button title="Link" onClick={addLink}><LinkIcon size={17} /></button>
              <button title="AI assistant" onClick={() => showToast("AI assistant is coming in the next phase.")}>
                <Sparkles size={17} />
              </button>
              <button className="toolbar-more" title="More"><MoreHorizontal size={17} /></button>
            </div>

            <div
              ref={editorRef}
              className="rich-editor"
              contentEditable
              suppressContentEditableWarning
              onInput={handleContentChange}
              data-placeholder="Start writing your document..."
            >
              {!content && ""}
            </div>

            <div className="document-footer">
              <span>{content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length} words</span>
              <span>Autosave enabled</span>
            </div>
          </div>
        </main>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}