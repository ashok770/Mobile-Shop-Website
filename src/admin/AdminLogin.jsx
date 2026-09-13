import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const successMessage = location.state?.message;

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (loading) return;

    if (!username.trim() || !password) {
      alert("Please enter your username and password.");
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
        alert(data.message || "Too many login attempts. Please try again later.");
      } else if (data.token) {
        localStorage.setItem("adminToken", data.token);
        const from = location.state?.from || "/admin/dashboard";
        navigate(from, { replace: true });
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="order-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
      }}
    >
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <h2 style={{ margin: "0 0 6px 0", color: "#111827", fontSize: "28px" }}>OMMASTRA</h2>
        <p style={{ margin: 0, color: "#6b7280", fontSize: "14px", fontWeight: 500 }}>Administrator Access</p>
      </div>

      <form className="order-form" onSubmit={handleLogin} style={{ width: "100%", maxWidth: "420px" }}>
        {successMessage && (
          <div
            role="status"
            style={{
              padding: "12px 16px",
              backgroundColor: "#ecfdf5",
              color: "#065f46",
              borderRadius: "6px",
              fontSize: "14px",
              textAlign: "left",
              border: "1px solid #a7f3d0",
            }}
          >
            {successMessage}
          </div>
        )}

        <div style={{ textAlign: "left" }}>
          <label
            htmlFor="admin-username"
            style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}
          >
            Username
          </label>
          <input
            id="admin-username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            required
            style={{ width: "100%", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ textAlign: "left" }}>
          <label
            htmlFor="admin-password"
            style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}
          >
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            style={{ width: "100%", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-4px" }}>
          <Link
            to="/admin/forgot-password"
            style={{
              fontSize: "13px",
              color: "#2563eb",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="btn order-btn"
          disabled={loading}
          style={{ width: "100%", marginTop: "8px" }}
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
