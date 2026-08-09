import { useState } from "react";
import { ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { authApi } from "../services/api";
import { setToken } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      const data = await authApi.login(form);
      setToken(data.token);
      const destination = location.state?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <Logo />
        <div className="visual-copy">
          <span className="pill"><span className="live-dot" /> Workspace ready</span>
          <h1>Write. Think.<br /><span>Together.</span></h1>
          <p>A clean workspace today, with real-time collaboration, presence and AI coming next.</p>
        </div>
        <div className="visual-footer">CollabSpace · Collaborative Document Platform</div>
      </div>

      <div className="auth-panel">
        <div className="auth-form-wrap">
          <div className="mobile-brand"><Logo /></div>
          <p className="eyebrow">Welcome back</p>
          <h2>Sign in to your workspace</h2>
          <p className="muted-copy">Continue where you left off.</p>

          {error && <div className="form-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>

            <label>
              Password
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)}>
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </label>

            <button className="primary-button large" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          <p className="switch-auth">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>

          <div className="security-note">
            <ShieldCheck size={17} />
            <span>Your session is protected with JWT authentication.</span>
          </div>
        </div>
      </div>
    </div>
  );
}