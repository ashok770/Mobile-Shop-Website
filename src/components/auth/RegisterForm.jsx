import { useMemo, useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { getGoogleAuthErrorMessage } from "../../utils/googleAuthErrors";
import GoogleSignInButton from "./GoogleSignInButton";

const passwordRequirements = [
  { label: "At least 8 characters", test: (value) => value.length >= 8 },
  { label: "Includes a number", test: (value) => /[0-9]/.test(value) },
  {
    label: "Includes an uppercase letter",
    test: (value) => /[A-Z]/.test(value),
  },
];

const RegisterForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, googleLogin } = useAuth();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const isSubmitting = loading || googleLoading;

  const passwordScore = useMemo(
    () =>
      passwordRequirements.reduce(
        (score, requirement) =>
          score + (requirement.test(formData.password) ? 1 : 0),
        0,
      ),
    [formData.password],
  );

  const strengthLabel = useMemo(() => {
    if (passwordScore === 3) return "Strong";
    if (passwordScore === 2) return "Good";
    if (passwordScore === 1) return "Weak";
    return "Very weak";
  }, [passwordScore]);

  const strengthColor = useMemo(() => {
    if (passwordScore === 3) return "bg-emerald-500";
    if (passwordScore === 2) return "bg-sky-500";
    if (passwordScore === 1) return "bg-amber-500";
    return "bg-red-500";
  }, [passwordScore]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!termsAccepted) {
      setError("Please accept the terms and privacy policy.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate("/login");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Registration failed. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async (credential) => {
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
          htmlFor="name"
          className="block text-sm font-semibold text-slate-700"
        >
          Full Name
        </label>
        <div className="relative">
          <User className="auth-input-icon" />
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="auth-input"
            disabled={isSubmitting}
            required
          />
        </div>
      </div>

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
            placeholder="Create a password"
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

      <div className="auth-field">
        <div className="flex items-center justify-between gap-4">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-semibold text-slate-700"
          >
            Confirm Password
          </label>
          <span className="text-xs text-slate-500">{strengthLabel}</span>
        </div>
        <div className="relative">
          <Lock className="auth-input-icon" />
          <input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            className="auth-input auth-input-with-action"
            disabled={isSubmitting}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm((value) => !value)}
            className="auth-input-action"
            disabled={isSubmitting}
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="auth-password-guidance">
        <div className="auth-strength-track">
          <div
            className={`h-full rounded-full ${strengthColor}`}
            style={{ width: `${(passwordScore / 3) * 100}%` }}
          />
        </div>
        <div className="auth-password-list">
          {passwordRequirements.map((requirement) => {
            const isValid = requirement.test(formData.password);
            return (
              <div
                key={requirement.label}
                className="auth-password-item"
              >
                <span
                  className={`auth-password-status ${isValid ? "is-valid" : ""}`}
                >
                  {isValid ? "✓" : "•"}
                </span>
                <span>{requirement.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <label className="auth-terms">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
          disabled={isSubmitting}
          required
        />
        <span>
          I agree to the{" "}
          <span className="font-semibold text-slate-900">
            Terms &amp; Privacy
          </span>
          .
        </span>
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="auth-primary-button"
      >
        {loading ? (
          <>
            <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </button>

      <div className="auth-divider">
        <div className="absolute inset-x-0 top-1/2 h-px bg-slate-200" />
        <span className="auth-divider-label">Or continue with</span>
      </div>

      {googleLoading ? (
        <div className="auth-secondary-button">
          <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
          Signing up with Google...
        </div>
      ) : (
        <GoogleSignInButton
          clientId={googleClientId}
          mode="register"
          disabled={isSubmitting}
          onCredential={handleGoogleRegister}
          onError={(err) => setError(getGoogleAuthErrorMessage(err))}
        />
      )}
    </form>
  );
};

export default RegisterForm;
