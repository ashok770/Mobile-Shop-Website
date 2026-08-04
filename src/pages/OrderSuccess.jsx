import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BadgeCheck, Check, CheckCircle2, ChevronRight, Circle, ClipboardList,
  Download, MapPin, PackageCheck, ShieldCheck, Truck,
  Undo2, WalletCards,
} from "lucide-react";
import CheckoutStepper from "../components/CheckoutStepper";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../api/api";
import "./Checkout.css";
import "./CheckoutFlow.css";

const formatPrice = (value) => Number(value || 0).toLocaleString("en-IN");
const formatOrderDate = (value) => {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
};
const deliveryDate = (value) => {
  const date = new Date(value || Date.now());
  date.setDate(date.getDate() + 5);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
};

function OrderSuccess() {
  const { state } = useLocation();
  const order = useMemo(() => {
    try { return state?.order || JSON.parse(localStorage.getItem("lastOrder") || "null") || {}; }
    catch { return state?.order || {}; }
  }, [state]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    getProducts()
      .then((products) => setRecommendations(Array.isArray(products) ? products.slice(0, 4) : []))
      .catch(() => setRecommendations([]));
  }, []);

  const items = order.items || [];
  const orderTotal = order.total ?? items.reduce((total, item) => total + Number(item.price || 0) * Number(item.quantity || 1), 0);
  const address = order.delivery || order;
  const paymentStatus = order.paymentMethod === "Cash on Delivery" ? "Pending on delivery" : "Paid";
  const journey = [
    { label: "Order Confirmed", detail: "Your order has been received.", complete: true },
    { label: "Preparing Shipment", detail: "We’ll carefully pack your items." },
    { label: "Shipped", detail: "Tracking details will be shared with you." },
    { label: "Out for Delivery", detail: "Your order is on its way." },
    { label: "Delivered", detail: "Enjoy your Ommasta purchase." },
  ];

  return (
    <main className="checkout-page-shell order-success-page">
      <div className="checkout-page-container">
        <nav className="checkout-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link><ChevronRight size={14} /><Link to="/cart">Cart</Link><ChevronRight size={14} /><span>Checkout</span><ChevronRight size={14} /><span>Success</span>
        </nav>
        <CheckoutStepper currentStep={4} />

        <section className="order-success-hero order-success-reveal">
          <span className="order-success-icon"><CheckCircle2 size={48} strokeWidth={2.2} /></span>
          <p className="order-success-eyebrow">Order confirmed</p>
          <h1>Order Placed Successfully!</h1>
          <p>Thank you for shopping with Ommasta. Your order has been confirmed and our team is preparing it for shipment. You&apos;ll receive updates as your order progresses.</p>
        </section>

        <section className="order-info-card order-success-stagger" aria-labelledby="order-information-title">
          <div className="order-card-heading"><div><p className="order-card-kicker">Order information</p><h2 id="order-information-title">Everything is confirmed</h2></div><span className="order-status-badge"><Check size={14} /> Confirmed</span></div>
          <div className="order-info-grid">
            <div><span>Order ID</span><strong>{order.orderId || "—"}</strong></div>
            <div><span>Order Date &amp; Time</span><strong>{formatOrderDate(order.orderedAt)}</strong></div>
            <div><span>Payment Method</span><strong>{order.paymentMethod || "—"}</strong></div>
            <div><span>Estimated Delivery</span><strong>{deliveryDate(order.orderedAt)}</strong></div>
          </div>
          <div className="order-success-actions"><Link className="order-track-button" to="/order"><PackageCheck size={18} /> Track Order</Link><Link className="order-continue-button" to="/mobiles">Continue Shopping</Link></div>
          <button className="order-invoice-link" type="button" aria-label="Download invoice placeholder"><Download size={15} /> Download Invoice</button>
        </section>

        <section className="order-success-grid">
          <section className="order-section-card order-success-stagger" aria-labelledby="next-title">
            <div className="order-section-heading"><ClipboardList size={20} /><div><h2 id="next-title">What&apos;s Next?</h2><p>A quick look at your order journey.</p></div></div>
            <ol className="order-journey">{journey.map((step, index) => <li key={step.label} className={step.complete ? "complete" : ""}><span className="journey-marker">{step.complete ? <Check size={15} /> : <Circle size={12} />}</span><div><strong>{step.label}</strong><p>{step.detail}</p></div>{index < journey.length - 1 && <i />}</li>)}</ol>
          </section>

          <section className="order-section-card order-success-stagger" aria-labelledby="payment-summary-title">
            <div className="order-section-heading"><WalletCards size={20} /><div><h2 id="payment-summary-title">Payment Summary</h2><p>Your order payment details.</p></div></div>
            <div className="payment-summary-list"><div><span>Payment Method</span><strong>{order.paymentMethod || "—"}</strong></div><div><span>Payment Status</span><strong className="payment-status"><CheckCircle2 size={15} /> {paymentStatus}</strong></div><div className="payment-grand-total"><span>Grand Total</span><strong>₹{formatPrice(orderTotal)}</strong></div></div>
          </section>
        </section>

        <section className="order-section-card order-items-section order-success-stagger" aria-labelledby="items-title">
          <div className="order-section-heading"><PackageCheck size={20} /><div><h2 id="items-title">Items Ordered</h2><p>{items.length ? `${items.length} item${items.length === 1 ? "" : "s"} in this order.` : "Your purchased items will appear here."}</p></div></div>
          <div className="order-items-list">{items.map((item, index) => <article className="cart-product-card order-product-card" key={item.productId || `${item.name}-${index}`}><div className="cart-product-image"><img src={item.image || "/vite.svg"} alt={item.name} /></div><div className="cart-product-details"><p className="cart-product-brand">Ommasta Select</p><h2>{item.name}</h2><p className="order-item-quantity">Quantity: <strong>{item.quantity || 1}</strong></p></div><div className="cart-line-subtotal"><span>Price</span><strong>₹{formatPrice(Number(item.price || 0) * Number(item.quantity || 1))}</strong></div></article>)}</div>
        </section>

        <section className="order-success-grid order-details-grid">
          <section className="order-section-card order-success-stagger" aria-labelledby="delivery-address-title">
            <div className="order-section-heading"><MapPin size={20} /><div><h2 id="delivery-address-title">Delivery Address</h2><p>Where we&apos;ll send your order.</p></div></div>
            <address className="delivery-address"><strong>{address.customerName || "Recipient details unavailable"}</strong><span>{address.phone || "—"}</span><span>{address.address || "—"}</span><span>{[address.city, address.state, address.pinCode].filter(Boolean).join(", ") || "—"}</span></address>
          </section>
          <section className="order-section-card order-success-stagger order-help-card"><BadgeCheck size={24} /><div><h2>We&apos;re here to help</h2><p>Questions about your order? Our support team is ready when you need us.</p><Link to="/contact">Contact Support</Link></div></section>
        </section>

        <section className="order-recommendations order-success-stagger" aria-labelledby="also-like-title"><div className="order-recommendations-heading"><div><h2 id="also-like-title">You May Also Like</h2><p>Handpicked accessories and devices for you.</p></div><Link to="/mobiles">View all products</Link></div><div className="order-recommendation-grid">{recommendations.map((product) => <ProductCard key={product._id} product={product} />)}</div></section>

        <section className="order-trust-section order-success-stagger" aria-label="Shop with confidence"><div><BadgeCheck size={21} /><span>Genuine Products</span></div><div><ShieldCheck size={21} /><span>Secure Payments</span></div><div><Truck size={21} /><span>Fast Delivery</span></div><div><Undo2 size={21} /><span>Easy Returns</span></div></section>
      </div>
    </main>
  );
}

export default OrderSuccess;
