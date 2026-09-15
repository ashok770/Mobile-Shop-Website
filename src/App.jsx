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
import Products from "./pages/Products";
import Offers from "./pages/Offers";
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
import Orders from "./pages/account/Orders";
import OrderDetails from "./pages/account/OrderDetails";
import Addresses from "./pages/account/Addresses";
import Wishlist from "./pages/account/Wishlist";
import Settings from "./pages/account/Settings";

// Admin pages
import AdminLogin from "./admin/AdminLogin";
import AdminForgotPassword from "./admin/AdminForgotPassword";
import AdminResetPassword from "./admin/AdminResetPassword";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProductsList from "./admin/products/AdminProductsList";
import AddProduct from "./admin/products/AddProduct";
import EditProduct from "./admin/products/EditProduct";
import ManageOrders from "./admin/ManageOrders";
import OrdersPage from "./admin/orders/OrdersPage";
import CustomersPage from "./admin/customers/CustomersPage";
import CustomerDetailPage from "./admin/customers/CustomerDetailPage";
import PromotionsPage from "./admin/promotions/PromotionsPage";
import HomepageManagement from "./admin/homepage/HomepageManagement";
import BrandsPage from "./admin/brands/BrandsPage";
import AdminProtectedRoute from "./admin/AdminProtectedRoute";
import AdminLayout from "./admin/layout/AdminLayout";

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
        <Route path="/products" element={<Products />} />
        <Route path="/mobiles" element={<Mobiles />} />
        <Route path="/mobiles/:id" element={<ProductDetails />} />
        <Route path="/accessories" element={<Accessories />} />
        <Route path="/offers/below-1000" element={<Offers offerKey="below-1000" />} />
        <Route path="/offers/mega-flash" element={<Offers offerKey="mega-flash" />} />
        <Route path="/offers/bogo" element={<Offers offerKey="bogo" />} />
        <Route path="/offers/daily" element={<Offers offerKey="daily" />} />
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
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/addresses"
          element={
            <ProtectedRoute>
              <Addresses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Navigate to="/profile/orders" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addresses"
          element={
            <ProtectedRoute>
              <Navigate to="/profile/addresses" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Navigate to="/profile/wishlist" replace />
            </ProtectedRoute>
          }
        />

        {/* Admin (public auth + recovery) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
        <Route path="/admin/reset-password" element={<AdminResetPassword />} />

        {/* Admin (protected) */}
        <Route
          path="/admin"
          element={<AdminProtectedRoute />}
        >
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProductsList />} />
            <Route path="products/new" element={<AddProduct />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="orders" element={<OrdersPage />} />
            {/* Placeholders to prevent crashes */}
            <Route path="promotions" element={<PromotionsPage />} />
            <Route path="homepage" element={<HomepageManagement />} />
            <Route path="brands" element={<BrandsPage />} />
            <Route path="services" element={<div style={{ padding: "20px" }}>Services Placeholder</div>} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="customers/:id" element={<CustomerDetailPage />} />
            <Route path="settings" element={<div style={{ padding: "20px" }}>Settings Placeholder</div>} />
          </Route>
        </Route>
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
