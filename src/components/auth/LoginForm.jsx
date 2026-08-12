import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { getGoogleAuthErrorMessage } from "../../utils/googleAuthErrors";
import GoogleSignInButton from "./GoogleSignInButton";

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, googleLogin } = useAuth();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const isSubmitting = loading || googleLoading;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(formData);
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credential) => {
    setError("");
    setGoogleLoading(true);

    try {
      await googleLogin(credential);
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setError(getGoogleAuthErrorMessage(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form-section">
      {error && (
        <div className="rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="auth-field">
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-slate-700"
        >
          Email
        </label>
        <div className="relative">
          <Mail className="auth-input-icon" />
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="auth-input"
            disabled={isSubmitting}
            required
          />
        </div>
      </div>

      <div className="auth-field">
        <label
          htmlFor="password"
          className="block text-sm font-semibold text-slate-700"
        >
          Password
        </label>
        <div className="relative">
          <Lock className="auth-input-icon" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="auth-input auth-input-with-action"
            disabled={isSubmitting}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="auth-input-action"
            disabled={isSubmitting}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          Forgot Password?
        </button>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="auth-primary-button"
      >
        {loading ? (
          <>
            <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </button>

      <div className="auth-divider">
        <div className="absolute inset-x-0 top-1/2 h-px bg-slate-200" />
        <span className="auth-divider-label">Or continue with</span>
      </div>

      {googleLoading ? (
        <div className="auth-secondary-button">
          <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
          Signing in with Google...
        </div>
      ) : (
        <GoogleSignInButton
          clientId={googleClientId}
          mode="login"
          disabled={isSubmitting}
          onCredential={handleGoogleLogin}
          onError={(err) => setError(getGoogleAuthErrorMessage(err))}
        />
      )}
    </form>
  );
};

export default LoginForm;
