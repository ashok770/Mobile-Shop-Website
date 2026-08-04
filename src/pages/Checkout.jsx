import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, ChevronRight, CreditCard, Landmark, ShoppingCart, ShieldCheck, WalletCards } from "lucide-react";
import CheckoutStepper from "../components/CheckoutStepper";
import "./Checkout.css";

const CART_KEY = "mobile_shop_cart";
const readCart = () => { try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch { return []; } };
const formatPrice = (value) => Number(value || 0).toLocaleString("en-IN");

function Checkout() {
  const navigate = useNavigate();
  const cart = useMemo(readCart, []);
  const [payment, setPayment] = useState("cod");
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce((total, item) => total + Number(item.price || 0) * item.quantity, 0);
  const submitOrder = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const customerName = String(form.get("customerName") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const email = String(form.get("email") || "").trim();
    const address = String(form.get("address") || "").trim();
    const city = String(form.get("city") || "").trim();
    if (!customerName || !phone || !address || !city) return;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert("Please enter a valid email address"); return; }
    if (!/^[0-9+\s-]{8,}$/.test(phone)) { alert("Please enter a valid phone number"); return; }
    if (!cart.length) { alert("Your cart is empty. Please add items before placing an order."); return; }
    setLoading(true);
    const order = { customerName, phone, address, items: cart.map((item) => ({ productId:item.productId, name:item.name, price:item.price, quantity:item.quantity })), paymentMethod:"COD" };
    try {
      const response = await fetch("https://mobile-shop-website-backend.onrender.com/api/orders", { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify(order) });
      if (!response.ok) { const error = await response.json().catch(() => ({})); throw new Error(error.message || "Unable to place your order"); }
      const data = await response.json();
      localStorage.removeItem(CART_KEY);
      localStorage.setItem("lastOrder", JSON.stringify({ ...order, orderId:data._id || Date.now() }));
      alert(`Order placed successfully!\nOrder ID: ${data._id || "Your order has been received"}`);
      window.location.href = "/";
    } catch (error) { alert(`Error placing order: ${error.message}\n\nPlease try again or contact support.`); setLoading(false); }
  };

  return <main className="checkout-page-shell"><div className="checkout-page-container">
    <nav className="checkout-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><ChevronRight size={14}/><Link to="/cart">Cart</Link><ChevronRight size={14}/><span>Checkout</span></nav>
    <header className="checkout-heading"><h1>Checkout</h1><p>Complete your purchase securely.</p></header>
    <CheckoutStepper currentStep={2} />
    {!cart.length ? <section className="checkout-empty"><ShoppingCart size={42}/><h2>Your cart is empty</h2><p>Add an item before proceeding to checkout.</p><button onClick={() => navigate("/mobiles")}>Continue Shopping</button></section> :
    <form className="checkout-layout" onSubmit={submitOrder}>
      <div className="checkout-left-column">
        <section className="checkout-card"><h2>Delivery Information</h2><div className="checkout-form-grid">
          <label className="checkout-field full">Full Name<input name="customerName" required placeholder="Enter your full name"/></label>
          <label className="checkout-field">Phone Number<input name="phone" type="tel" required pattern="[0-9+\s-]{8,}" placeholder="Enter your phone number"/></label>
          <label className="checkout-field">Email Address<input name="email" type="email" placeholder="Enter your email address"/></label>
          <label className="checkout-field full">Address<textarea name="address" required placeholder="Enter your delivery address"/></label>
          <label className="checkout-field">City<input name="city" required placeholder="Enter your city"/></label>
          <label className="checkout-field">State<input name="state" placeholder="Enter your state"/></label>
          <label className="checkout-field">PIN Code<input name="pinCode" inputMode="numeric" placeholder="Enter PIN code"/></label>
          <label className="checkout-field">Optional Landmark<input name="landmark" placeholder="Nearby landmark"/></label>
        </div><label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 18, color: "#6B7280", fontSize: 13 }}><input id="agreeTerms" type="checkbox" required style={{ accentColor: "#1E40AF" }} /> <span>I agree to the terms and conditions.</span></label></section>
        <section className="checkout-card checkout-payment"><h2>Payment Method</h2><div className="checkout-payment-options">
          {[{id:"cod",label:"Cash on Delivery",icon:WalletCards},{id:"upi",label:"UPI",icon:CreditCard},{id:"card",label:"Credit / Debit Card",icon:CreditCard},{id:"bank",label:"Net Banking",icon:Landmark}].map(({id,label,icon:Icon}) => <label className={`checkout-payment-option ${payment === id ? "selected" : ""}`} key={id}><input type="radio" name="payment" value={id} checked={payment === id} onChange={() => setPayment(id)}/><Icon size={18}/><span>{label}</span></label>)}
        </div></section>
      </div>
      <aside className="checkout-summary"><h2>Order Summary</h2><div className="checkout-items">{cart.map((item) => <div className="checkout-item" key={item.productId}><span>{item.name} <em>×{item.quantity}</em></span><strong>₹{formatPrice(Number(item.price) * item.quantity)}</strong></div>)}</div><div className="checkout-summary-row"><span>Subtotal</span><strong>₹{formatPrice(subtotal)}</strong></div><div className="checkout-summary-row"><span>Shipping</span><strong>Free</strong></div><div className="checkout-summary-row"><span>Tax</span><strong>₹0</strong></div><div className="checkout-divider"/><div className="checkout-total"><span>Grand Total</span><strong>₹{formatPrice(subtotal)}</strong></div><button className="checkout-submit" type="submit" disabled={loading}>{loading ? "Processing..." : "Place Order"}</button><button className="checkout-back" type="button" onClick={() => navigate("/cart")}>Back to Cart</button><div className="checkout-trust"><div><Check size={15}/><span>Genuine Products</span></div><div><ShieldCheck size={15}/><span>Secure Payments</span></div><div><Check size={15}/><span>Easy Returns</span></div><div><Check size={15}/><span>Fast Delivery</span></div></div></aside>
    </form>}
  </div></main>;
}
export default Checkout;
