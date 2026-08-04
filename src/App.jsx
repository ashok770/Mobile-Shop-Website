import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

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

// Admin pages
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import ManageProducts from "./admin/ManageProducts";
import ManageOrders from "./admin/ManageOrders";
import OrdersPage from "./admin/OrdersPage";

function Layout() {
  const location = useLocation();

  // ✅ Detect admin routes
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Header only for public pages */}
      {!isAdminRoute && <Header />}

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

        {/* Admin (hidden) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<ManageProducts />} />
        <Route path="/admin/orders" element={<OrdersPage />} />
      </Routes>

      {/* Footer only for public pages */}
      {!isAdminRoute && <Footer />}

      {/* Chatbot only for public pages */}
      {!isAdminRoute && <Chatbot />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
