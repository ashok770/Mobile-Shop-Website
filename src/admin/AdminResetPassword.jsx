import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AdminResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isTokenInvalidOrExpired, setIsTokenInvalidOrExpired] = useState(!token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!token) {
      setIsTokenInvalidOrExpired(true);
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/admin/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setErrorMessage(data.message || "Too many attempts. Please try again later.");
      } else if (res.ok) {
        setNewPassword("");
        setConfirmPassword("");
        navigate("/admin/login", {
          replace: true,
          state: { message: "Password reset successfully. Please sign in with your new password." },
        });
      } else if (res.status === 400 && data.message?.includes("Invalid or expired")) {
        setIsTokenInvalidOrExpired(true);
      } else {
        setErrorMessage(data.message || "Unable to reset password. Please try again.");
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
        {isTokenInvalidOrExpired ? (
          <div style={{ textAlign: "center" }}>
            <h3 style={{ margin: "0 0 12px 0", color: "#111827", fontSize: "20px" }}>
              Reset link expired or invalid
            </h3>
            <p style={{ color: "#4b5563", fontSize: "14px", lineHeight: "1.6", margin: "0 0 24px 0" }}>
              Please request a new password reset link.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link
                to="/admin/forgot-password"
                className="btn order-btn"
                style={{
                  display: "inline-block",
                  width: "100%",
                  boxSizing: "border-box",
                  textDecoration: "none",
                  textAlign: "center",
                }}
              >
                Request New Reset Link
              </Link>
              <Link
                to="/admin/login"
                style={{
                  fontSize: "13px",
                  color: "#2563eb",
                  textDecoration: "none",
                  fontWeight: 500,
                  marginTop: "6px",
                }}
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ margin: "0 0 4px 0", color: "#111827", fontSize: "20px", textAlign: "center" }}>
              Create a new password
            </h3>
            <p style={{ color: "#6b7280", fontSize: "13px", margin: "0 0 8px 0", textAlign: "center" }}>
              Enter and confirm your new administrator password (min 8 characters).
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
              <label htmlFor="new-password" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                New Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  required
                  minLength={8}
                  style={{ width: "100%", boxSizing: "border-box", paddingRight: "42px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    padding: "4px",
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                Confirm New Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                  minLength={8}
                  style={{ width: "100%", boxSizing: "border-box", paddingRight: "42px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    padding: "4px",
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn order-btn"
              disabled={loading}
              style={{ width: "100%", marginTop: "4px" }}
            >
              {loading ? "Resetting Password..." : "Reset Password"}
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

export default AdminResetPassword;
