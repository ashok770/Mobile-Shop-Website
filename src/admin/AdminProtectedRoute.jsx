import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function AdminProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [tokenState, setTokenState] = useState(() =>
    localStorage.getItem("adminToken"),
  );

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "adminToken") {
        setTokenState(e.newValue);
        if (!e.newValue) {
          navigate("/admin/login", { replace: true });
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
        Checking administrator access...
      </div>
    );
  }

  const isAdmin = !!tokenState || (user && user?.role === "admin");

  if (isAdmin) {
    return <Outlet />;
  }

  if (user) {
    // Authenticated non-admin
    return <Navigate to="/" replace />;
  }

  // Unauthenticated
  return (
    <Navigate
      to="/admin/login"
      replace
      state={{ from: `${location.pathname}${location.search}${location.hash}` }}
    />
  );
}

export default AdminProtectedRoute;
