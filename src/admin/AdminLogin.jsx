import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Eye, EyeOff, Lock } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  const successMessage = location.state?.message;

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (loading) return;
    setError(null);

    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setError(data.message || "Too many login attempts. Please try again later.");
      } else if (data.token) {
        localStorage.setItem("adminToken", data.token);
        const from = location.state?.from || "/admin/dashboard";
        navigate(from, { replace: true });
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9fafb",
        padding: "24px 16px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Branding */}
      <div style={{ marginBottom: "28px", textAlign: "center" }}>
        <img 
          src="/images/logo.png" 
          alt="Ommastra" 
          style={{ height: "36px", width: "auto", margin: "0 auto 8px auto", display: "block", objectFit: "contain" }} 
        />
        <div style={{ position: "relative", display: "inline-block" }}>
          <p style={{ margin: 0, color: "#4b5563", fontSize: "12px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>
            Admin Portal
          </p>
          <div style={{ position: "absolute", bottom: "-6px", left: "50%", transform: "translateX(-50%)", width: "24px", height: "2px", backgroundColor: "#2563eb", borderRadius: "2px" }} />
        </div>
      </div>

      {/* Auth Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)",
          padding: "36px 32px",
          boxSizing: "border-box",
        }}
      >
        {/* Card Header */}
        <div style={{ marginBottom: "28px" }}>
          <h2 style={{ margin: "0 0 8px 0", color: "#111827", fontSize: "22px", fontWeight: 600 }}>
            Welcome back
          </h2>
          <p style={{ margin: 0, color: "#6b7280", fontSize: "14px", lineHeight: "1.5" }}>
            Sign in to access the Ommastra administrator portal.
          </p>
        </div>

        <form onSubmit={handleLogin} noValidate>
          {/* Alerts */}
          {successMessage && (
            <div
              role="status"
              style={{
                marginBottom: "20px",
                padding: "12px 16px",
                backgroundColor: "#ecfdf5",
                color: "#065f46",
                borderRadius: "8px",
                fontSize: "14px",
                border: "1px solid #a7f3d0",
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <span style={{ marginRight: "8px", marginTop: "1px" }}>✓</span>
              <span>{successMessage}</span>
            </div>
          )}

          {error && (
            <div
              role="alert"
              style={{
                marginBottom: "20px",
                padding: "12px 16px",
                backgroundColor: "#fef2f2",
                color: "#991b1b",
                borderRadius: "8px",
                fontSize: "14px",
                border: "1px solid #fecaca",
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <span style={{ marginRight: "8px", marginTop: "1px", fontWeight: "bold" }}>!</span>
              <span>{error}</span>
            </div>
          )}

          {/* Username Field */}
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="admin-username"
              style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#374151", marginBottom: "8px" }}
            >
              Username
            </label>
            <input
              id="admin-username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
              autoComplete="username"
              style={{
                width: "100%",
                height: "44px",
                padding: "0 14px",
                fontSize: "15px",
                color: "#111827",
                backgroundColor: "#fff",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                outline: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#2563eb";
                e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#d1d5db";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="admin-password"
              style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#374151", marginBottom: "8px" }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                autoComplete="current-password"
                style={{
                  width: "100%",
                  height: "44px",
                  padding: "0 44px 0 14px",
                  fontSize: "15px",
                  color: "#111827",
                  backgroundColor: "#fff",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  outline: "none",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#2563eb";
                  e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#d1d5db";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={loading}
                style={{
                  position: "absolute",
                  right: "4px",
                  top: "4px",
                  height: "36px",
                  width: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  border: "none",
                  color: "#9ca3af",
                  cursor: "pointer",
                  borderRadius: "6px",
                  padding: 0,
                  transition: "color 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#4b5563")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#9ca3af")}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "24px" }}>
            <Link
              to="/admin/forgot-password"
              style={{
                fontSize: "13px",
                color: "#2563eb",
                textDecoration: "none",
                fontWeight: 500,
                transition: "color 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.color = "#1d4ed8")}
              onMouseOut={(e) => (e.target.style.color = "#2563eb")}
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: "46px",
              backgroundColor: loading ? "#93c5fd" : "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseOver={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = "#1d4ed8";
            }}
            onMouseOut={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = "#2563eb";
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Security Indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              marginTop: "20px",
              color: "#6b7280",
            }}
          >
            <Lock size={14} />
            <span style={{ fontSize: "13px" }}>Secure administrator access</span>
          </div>
        </form>
      </div>

      {/* Footer Note */}
      <div style={{ marginTop: "32px", color: "#9ca3af", fontSize: "13px" }}>
        Authorized administrators only
      </div>
    </div>
  );
}

export default AdminLogin;
