import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import RegisterForm from "../../components/auth/RegisterForm";
import "./AuthPages.css";

const benefits = [
  {
    title: "Save time",
    description:
      "Keep your shipping and payment details available for future orders.",
  },
  {
    title: "Stay organized",
    description: "View your order history and track deliveries in one place.",
  },
  {
    title: "Receive updates",
    description: "Get order status notices without leaving the site.",
  },
];

const Register = () => {
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
              <h1>Create your account</h1>
              <p className="auth-brand-copy">
                Sign up to manage orders, save preferences, and checkout faster.
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
              <h2 className="auth-card-title">Create account</h2>
              <p className="auth-card-subtitle">
                Set up your account and start enjoying a smoother checkout
                experience.
              </p>

              <RegisterForm />

              <div className="auth-card-footer">
                <p className="auth-card-footer-copy">
                  Already have an account?{" "}
                  <Link to="/login" className="auth-card-footer-link">
                    Sign in
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

export default Register;
