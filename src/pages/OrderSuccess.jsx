import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, ChevronRight, PackageCheck } from "lucide-react";
import CheckoutStepper from "../components/CheckoutStepper";
import "./Checkout.css";
import "./CheckoutFlow.css";
function OrderSuccess() { const { state } = useLocation(); const order = useMemo(() => state?.order || JSON.parse(localStorage.getItem("lastOrder") || "null"), [state]); return <main className="checkout-page-shell"><div className="checkout-page-container"><nav className="checkout-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><ChevronRight size={14}/><span>Order complete</span></nav><CheckoutStepper currentStep={4}/><section className="order-success-card"><CheckCircle2 size={58}/><p className="order-success-eyebrow">Order confirmed</p><h1>Thanks for your order!</h1><p>We have received your order and will notify you when it is on its way.</p>{order?.orderId && <div className="order-success-id"><PackageCheck size={18}/><span>Order ID</span><strong>{order.orderId}</strong></div>}<Link className="order-success-link" to="/mobiles">Continue Shopping</Link></section></div></main>; }
export default OrderSuccess;
