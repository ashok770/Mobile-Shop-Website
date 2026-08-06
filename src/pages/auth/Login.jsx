import { Link } from "react-router-dom";
import { PackageCheck, ShieldCheck, ShoppingBag } from "lucide-react";
import LoginForm from "../../components/auth/LoginForm";
import "./AuthPages.css";

const benefits = [
  {
    icon: ShieldCheck,
    description: "Securely access your account and saved details.",
  },
  {
    icon: ShoppingBag,
    description: "Pick up your cart and check out with less effort.",
  },
  {
    icon: PackageCheck,
    description: "Keep your orders and delivery updates in one place.",
  },
];

const Login = () => {
  return (
    <main className="auth-shell">
      <div className="auth-container">
        <div className="auth-grid">
          <section
            className="auth-panel auth-brand-panel"
          >
            <div className="auth-brand-header">
              <span className="auth-brand-mark">Ommasta</span>
              <h1>Welcome back</h1>
              <p className="auth-brand-copy">
                Sign in to manage your orders and continue shopping securely.
              </p>
            </div>

            <svg className="auth-illustration" viewBox="0 0 160 160" aria-hidden="true">
              <defs>
                <linearGradient id="login-shape" x1="0" y1="0" x2="1" y2="1">
                  <stop stopColor="#38bdf8" stopOpacity=".22" />
                  <stop offset="1" stopColor="#3b82f6" stopOpacity=".04" />
                </linearGradient>
              </defs>
              <path d="M115 13c22 8 35 29 29 51-5 21-25 29-39 45-14 15-24 40-45 37-22-3-34-28-30-49 3-18 25-23 40-38 15-16 23-53 45-46Z" fill="url(#login-shape)" />
              <path d="M47 106c14-10 34-4 42 10" fill="none" stroke="#38bdf8" strokeOpacity=".22" strokeWidth="2" strokeLinecap="round" />
            </svg>

            <ul className="auth-benefit-list">
              {benefits.map((item) => (
                <li key={item.description}>
                  <item.icon size={17} strokeWidth={1.8} aria-hidden="true" />
                  <span>{item.description}</span>
                </li>
              ))}
            </ul>
          </section>

          <section
            className="auth-panel auth-card-panel"
          >
            <div className="auth-card">
              <h2 className="auth-card-title">Sign in</h2>
              <p className="auth-card-subtitle">
                Access your account and continue shopping with ease.
              </p>

              <LoginForm />

              <div className="auth-card-footer">
                <p className="auth-card-footer-copy">
                  New here?{" "}
                  <Link to="/register" className="auth-card-footer-link">
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Login;
