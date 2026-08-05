import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LoginForm from "../../components/auth/LoginForm";
import "./AuthPages.css";

const benefits = [
  {
    title: "Secure sign in",
    description: "Protected account access with clear session handling.",
  },
  {
    title: "Fast checkout",
    description: "Return to your cart and complete purchases quickly.",
  },
  {
    title: "Order updates",
    description: "Review delivery status and order history in one place.",
  },
];

const Login = () => {
  return (
    <main className="auth-shell">
      <div className="auth-container">
        <div className="auth-grid">
          <motion.section
            className="auth-panel auth-brand-panel"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="auth-brand-header">
              <span className="auth-brand-mark">Ommasta</span>
              <h1>Welcome back</h1>
              <p className="auth-brand-copy">
                Sign in to manage your orders and continue shopping securely.
              </p>
            </div>

            <div className="auth-illustration" aria-hidden="true">
              <div className="auth-illustration-ring" />
              <div className="auth-illustration-dot" />
            </div>

            <ul className="auth-benefit-list">
              {benefits.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.description}</span>
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.section
            className="auth-panel auth-card-panel"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
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
          </motion.section>
        </div>
      </div>
    </main>
  );
};

export default Login;
