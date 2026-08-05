import { useMemo, useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Globe } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

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
  const { register } = useAuth();

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
  const [error, setError] = useState("");

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
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 auth-form-section">
      {error && (
        <div className="rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-3">
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
            required
          />
        </div>
      </div>

      <div className="space-y-3">
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
            required
          />
        </div>
      </div>

      <div className="space-y-3">
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
            className="auth-input pr-14"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="auth-input-action"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="space-y-3">
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
            className="auth-input pr-14"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm((value) => !value)}
            className="auth-input-action"
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full rounded-full ${strengthColor}`}
            style={{ width: `${(passwordScore / 3) * 100}%` }}
          />
        </div>
        <div className="grid gap-2">
          {passwordRequirements.map((requirement) => {
            const isValid = requirement.test(formData.password);
            return (
              <div
                key={requirement.label}
                className="flex items-center gap-2 text-sm text-slate-600"
              >
                <span
                  className={`inline-flex h-4 w-4 items-center justify-center rounded-full ${isValid ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"}`}
                >
                  {isValid ? "✓" : "•"}
                </span>
                <span>{requirement.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <label className="flex items-center gap-3 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
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
        disabled={loading}
        className="flex w-full items-center justify-center gap-3 rounded-xl bg-sky-600 px-5 py-4 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(56,189,248,0.18)] transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-70"
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

      <div className="relative py-4">
        <div className="absolute inset-x-0 top-1/2 h-px bg-slate-200" />
        <span className="auth-divider-label">Continue with</span>
      </div>

      <button type="button" className="auth-secondary-button">
        <Globe size={18} />
        Continue with Google
      </button>
    </form>
  );
};

export default RegisterForm;
