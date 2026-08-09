import { FileText, LogOut, Plus, Search, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { clearToken } from "../utils/auth";

export default function AppShell({
  children,
  query,
  setQuery,
  onNewDocument,
  title = "Workspace"
}) {
  const navigate = useNavigate();

  function logout() {
    clearToken();
    navigate("/login", { replace: true });
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <Logo />
        <div className="topbar-right">
          <button className="ghost-button" onClick={logout}>
            <LogOut size={16} /> Sign out
          </button>
          <div className="avatar">V</div>
        </div>
      </header>

      <div className="shell-body">
        <aside className="sidebar">
          <button className="primary-button full-width" onClick={onNewDocument}>
            <Plus size={18} /> New document
          </button>

          <nav className="side-nav">
            <div className="side-nav-item active">
              <FileText size={17} />
              Documents
            </div>
            <div className="side-nav-item muted">
              <Sparkles size={17} />
              AI assistant <span className="soon">Soon</span>
            </div>
          </nav>

          <div className="sidebar-bottom">
            <div className="upgrade-card">
              <strong>Build together.</strong>
              <p>Real-time collaboration is the next layer of this workspace.</p>
            </div>
          </div>
        </aside>

        <main className="main-content">
          <div className="page-heading">
            <div>
              <p className="eyebrow">Workspace</p>
              <h1>{title}</h1>
            </div>
            {setQuery && (
              <div className="search-box">
                <Search size={17} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search documents..."
                />
              </div>
            )}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}