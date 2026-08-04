import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, ShoppingCart } from "lucide-react";
import CheckoutStepper from "../components/CheckoutStepper";
import "./Checkout.css";
import "./CheckoutFlow.css";

const CART_KEY = "mobile_shop_cart";
const DELIVERY_KEY = "mobile_shop_delivery";
const readCart = () => { try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch { return []; } };

function Checkout() {
  const navigate = useNavigate();
  const cart = useMemo(() => readCart(), []);
  const continueToPayment = (event) => {
    event.preventDefault();
    sessionStorage.setItem(DELIVERY_KEY, JSON.stringify(Object.fromEntries(new FormData(event.currentTarget).entries())));
    navigate("/payment");
  };
  return <main className="checkout-page-shell"><div className="checkout-page-container">
    <nav className="checkout-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><ChevronRight size={14}/><Link to="/cart">Cart</Link><ChevronRight size={14}/><span>Delivery</span></nav>
    <header className="checkout-heading"><h1>Delivery details</h1><p>Where should we send your order?</p></header><CheckoutStepper currentStep={2} />
    {!cart.length ? <section className="checkout-empty"><ShoppingCart size={42}/><h2>Your cart is empty</h2><p>Add an item before proceeding to checkout.</p><button onClick={() => navigate("/mobiles")}>Continue Shopping</button></section> : <form className="checkout-delivery-form checkout-card" onSubmit={continueToPayment}>
      <h2>Delivery Information</h2><div className="checkout-form-grid"><label className="checkout-field full">Full Name<input name="customerName" required placeholder="Enter your full name"/></label><label className="checkout-field">Phone Number<input name="phone" type="tel" required pattern="[-0-9+ ]{8,}" placeholder="Enter your phone number"/></label><label className="checkout-field">Email Address<input name="email" type="email" placeholder="Enter your email address"/></label><label className="checkout-field full">Address<textarea name="address" required placeholder="Enter your delivery address"/></label><label className="checkout-field">City<input name="city" required placeholder="Enter your city"/></label><label className="checkout-field">State<input name="state" placeholder="Enter your state"/></label><label className="checkout-field">PIN Code<input name="pinCode" inputMode="numeric" placeholder="Enter PIN code"/></label><label className="checkout-field">Optional Landmark<input name="landmark" placeholder="Nearby landmark"/></label></div>
      <label className="checkout-terms"><input type="checkbox" required /><span>I agree to the terms and conditions.</span></label><div className="checkout-actions"><button className="checkout-back" type="button" onClick={() => navigate("/cart")}>Back to Cart</button><button className="checkout-submit" type="submit">Continue to Payment</button></div>
    </form>}
  </div></main>;
}
export default Checkout;
