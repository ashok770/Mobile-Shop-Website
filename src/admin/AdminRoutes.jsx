import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import ManageProducts from "./ManageProducts";
import ManageOrders from "./ManageOrders";

const isAdminAuthenticated = () => {
  return localStorage.getItem("adminToken");
};

function AdminRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAdminAuthenticated() ? (
            <Navigate to="/admin/dashboard" />
          ) : (
            <AdminLogin />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          isAdminAuthenticated() ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/admin/login" />
          )
        }
      />

      <Route
        path="/products"
        element={
          isAdminAuthenticated() ? (
            <ManageProducts />
          ) : (
            <Navigate to="/admin/login" />
          )
        }
      />

      <Route
        path="/orders"
        element={
          isAdminAuthenticated() ? (
            <ManageOrders />
          ) : (
            <Navigate to="/admin/login" />
          )
        }
      />
    </Routes>
  );
}

export default AdminRoutes;
