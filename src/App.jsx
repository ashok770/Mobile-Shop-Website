import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import useAuth from "./hooks/useAuth";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";

// Public pages
import Home from "./pages/Home";
import Mobiles from "./pages/Mobiles";
import ProductDetails from "./pages/ProductDetails";
import Accessories from "./pages/Accessories";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Order from "./pages/Order";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import OrderSuccess from "./pages/OrderSuccess";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/account/Dashboard";
import AccountSection from "./pages/AccountSection";

// Admin pages
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import ManageProducts from "./admin/ManageProducts";
import ManageOrders from "./admin/ManageOrders";
import OrdersPage from "./admin/OrdersPage";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  return user ? (
    children
  ) : (
    <Navigate
      to="/login"
      replace
      state={{ from: `${location.pathname}${location.search}${location.hash}` }}
    />
  );
}

function GuestOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? <Navigate to="/profile" replace /> : children;
}

function Layout() {
  const location = useLocation();

  const hideLayout =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register");

  return (
    <>
      {/* Header only for public pages */}
      {!hideLayout && <Header />}

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/mobiles" element={<Mobiles />} />
        <Route path="/mobiles/:id" element={<ProductDetails />} />
        <Route path="/accessories" element={<Accessories />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/order" element={<Order />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route
          path="/login"
          element={
            <GuestOnlyRoute>
              <Login />
            </GuestOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestOnlyRoute>
              <Register />
            </GuestOnlyRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <AccountSection title="My Orders" description="Your order history will appear here." />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addresses"
          element={
            <ProtectedRoute>
              <AccountSection title="Saved Addresses" description="Your saved delivery addresses will appear here." />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <AccountSection title="Wishlist" description="Your saved products will appear here." />
            </ProtectedRoute>
          }
        />

        {/* Admin (hidden) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<ManageProducts />} />
        <Route path="/admin/orders" element={<OrdersPage />} />
      </Routes>

      {/* Footer only for public pages */}
      {!hideLayout && <Footer />}

      {/* Chatbot only for public pages */}
      {!hideLayout && <Chatbot />}
    </>
  );
}

export default function App() {
  return <Layout />;
}
