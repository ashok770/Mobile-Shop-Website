import { useState } from "react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Please enter your administrator email address.");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/admin/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setErrorMessage(data.message || "Too many requests. Please try again later.");
      } else if (res.ok) {
        setSubmitted(true);
      } else if (res.status === 400) {
        setErrorMessage(data.message || "Please provide a valid email address.");
      } else {
        setErrorMessage("Unable to process password reset request. Please try again later.");
      }
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
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

      <div className="order-form" style={{ width: "100%", maxWidth: "420px", textAlign: "left" }}>
        {submitted ? (
          <div>
            <h3 style={{ margin: "0 0 12px 0", color: "#111827", fontSize: "20px", textAlign: "center" }}>
              Check your email
            </h3>
            <p style={{ color: "#4b5563", fontSize: "14px", lineHeight: "1.6", margin: "0 0 16px 0", textAlign: "center" }}>
              If an account with that email exists, a password reset link has been sent.
            </p>
            <p style={{ color: "#6b7280", fontSize: "13px", lineHeight: "1.5", margin: "0 0 24px 0", textAlign: "center" }}>
              The link expires in 15 minutes.
            </p>
            <div style={{ textAlign: "center" }}>
              <Link
                to="/admin/login"
                className="btn order-btn"
                style={{
                  display: "inline-block",
                  width: "100%",
                  boxSizing: "border-box",
                  textDecoration: "none",
                  textAlign: "center",
                }}
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ margin: "0 0 4px 0", color: "#111827", fontSize: "20px", textAlign: "center" }}>
              Forgot your password?
            </h3>
            <p style={{ color: "#4b5563", fontSize: "14px", lineHeight: "1.5", margin: "0 0 8px 0", textAlign: "center" }}>
              Enter the email address associated with your administrator account and we'll send you a reset link.
            </p>

            {errorMessage && (
              <div
                role="alert"
                aria-live="polite"
                style={{
                  padding: "12px 14px",
                  backgroundColor: "#fef2f2",
                  color: "#991b1b",
                  borderRadius: "6px",
                  fontSize: "13px",
                  border: "1px solid #fecaca",
                }}
              >
                {errorMessage}
              </div>
            )}

            <div>
              <label htmlFor="forgot-email" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                Email address
              </label>
              <input
                id="forgot-email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </div>

            <button
              type="submit"
              className="btn order-btn"
              disabled={loading}
              style={{ width: "100%", marginTop: "4px" }}
            >
              {loading ? "Sending reset link..." : "Send Reset Link"}
            </button>

            <div style={{ textAlign: "center", marginTop: "8px" }}>
              <Link
                to="/admin/login"
                style={{
                  fontSize: "13px",
                  color: "#2563eb",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AdminForgotPassword;
