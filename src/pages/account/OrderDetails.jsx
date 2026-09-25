import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Calendar,
  Hash,
  MapPin,
  Phone,
  User,
  CreditCard,
  RefreshCw,
  ShoppingBag,
  CheckCircle2,
  Clock,
  Truck,
  CheckCheck,
  FileText,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  XCircle,
  HelpCircle,
  Navigation,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import "./Orders.css";

const trackingSteps = [
  { key: "Pending", label: "Order Placed", desc: "Received & verified", icon: Clock },
  { key: "Confirmed", label: "Confirmed", desc: "Approved by store", icon: CheckCircle2 },
  { key: "Packed", label: "Packed", desc: "Ready for courier", icon: Package },
  { key: "Shipped", label: "Shipped", desc: "On the way", icon: Truck },
  { key: "Out for Delivery", label: "Out for Delivery", desc: "Arriving today", icon: Navigation },
  { key: "Delivered", label: "Delivered", desc: "Package received", icon: CheckCheck },
];

const statusClassKey = {
  Pending: "pending",
  Confirmed: "confirmed",
  Packed: "packed",
  Shipped: "shipped",
  "Out for Delivery": "out-for-delivery",
  Delivered: "delivered",
  Cancelled: "cancelled",
};

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(false);

  const fetchOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get(`/orders/${id}`);
      setOrder(data.order);
    } catch (err) {
      const status = err.response?.status;
      const message =
        err.response?.data?.message || "Failed to load order details";

      if (status === 404) {
        setError("Order not found or you do not have permission to view it.");
      } else if (status === 401 || status === 403) {
        setError("Your session has expired. Please log in again.");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCopyId = () => {
    if (!order?._id) return;
    navigator.clipboard.writeText(order._id);
    setCopiedId(true);
    toast.success("Order ID copied to clipboard!", { id: "copy-detail-id" });
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const orderStatus = order?.orderStatus || "Pending";
  const isCancelled = orderStatus === "Cancelled";
  const currentStepIndex = trackingSteps.findIndex((s) => s.key === orderStatus);
  // Default to 0 (Pending) if not found
  const activeStepIdx = currentStepIndex === -1 ? 0 : currentStepIndex;

  return (
    <main className="orders-page-shell">
      <div className="orders-container">
        {/* ── Breadcrumb Navigation ── */}
        <nav className="orders-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="orders-breadcrumb-separator">/</span>
          <Link to="/profile">My Account</Link>
          <span className="orders-breadcrumb-separator">/</span>
          <Link to="/profile/orders">My Orders</Link>
          <span className="orders-breadcrumb-separator">/</span>
          <span className="orders-breadcrumb-current">
            Order #{order?._id ? order._id.slice(-8).toUpperCase() : "Details"}
          </span>
        </nav>

        {/* ── Top Bar with Back Link & Action ── */}
        <div className="order-details-top-bar">
          <Link to="/profile/orders" className="btn-back-link">
            <ArrowLeft size={16} />
            Back to All Orders
          </Link>

          {order && (
            <div className="order-details-actions-group">
              <button
                type="button"
                onClick={handlePrint}
                className="btn-order-secondary"
                title="Print or save invoice as PDF"
              >
                <Printer size={15} />
                Print Invoice
              </button>
            </div>
          )}
        </div>

        {/* ── Loading State ── */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm py-24 px-8 text-center my-6">
            <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">Loading order details...</h3>
            <p className="text-sm text-slate-500 mt-1">Fetching live tracking information and order receipt.</p>
          </div>
        ) : error ? (
          /* ── Error State ── */
          <div className="bg-white rounded-3xl border border-red-200 shadow-sm py-16 px-8 text-center max-w-lg mx-auto my-8">
            <div className="h-14 w-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={30} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Unable to load order</h2>
            <p className="text-sm text-slate-500 mt-2 mb-6">{error}</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={fetchOrder} className="btn-order-primary">
                <RefreshCw size={15} />
                Try Again
              </button>
              <Link to="/profile/orders" className="btn-order-secondary">
                Back to Orders
              </Link>
            </div>
          </div>
        ) : order ? (
          /* ── Loaded Order Details ── */
          <div>
            {/* ── Order Header Summary Card ── */}
            <div className="order-details-header-card">
              <div className="order-details-title-group">
                <div className="order-details-id-row">
                  <h1 className="order-details-id">
                    Order #{order._id?.slice(-8).toUpperCase()}
                  </h1>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="order-id-copy-btn"
                    title="Copy Full Order ID"
                  >
                    {copiedId ? (
                      <>
                        <Check size={13} className="text-emerald-600" />
                        <span className="text-emerald-600 font-semibold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Copy Full ID</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="order-details-meta-row">
                  <span className="order-details-meta-item">
                    <Calendar size={14} className="text-slate-400" />
                    Placed on {formatDate(order.createdAt)}
                  </span>
                  <span>•</span>
                  <span className="order-details-meta-item">
                    <Hash size={14} className="text-slate-400" />
                    Full ID: <span className="font-mono">{order._id}</span>
                  </span>
                </div>
              </div>

              <div>
                <span className={`order-status-badge ${statusClassKey[orderStatus] || "pending"}`}>
                  {orderStatus === "Delivered" && <CheckCircle2 size={15} />}
                  {orderStatus === "Cancelled" && <XCircle size={15} />}
                  {["Shipped", "Out for Delivery"].includes(orderStatus) && <Truck size={15} />}
                  {["Pending", "Confirmed", "Packed"].includes(orderStatus) && <Clock size={15} />}
                  {orderStatus}
                </span>
              </div>
            </div>

            {/* ── Progress Tracking Stepper (or Cancelled Banner) ── */}
            {isCancelled ? (
              <div className="order-cancelled-card">
                <div className="order-cancelled-icon">
                  <XCircle size={26} />
                </div>
                <div>
                  <h3 className="order-cancelled-title">This order has been cancelled</h3>
                  <p className="order-cancelled-desc">
                    If payment was deducted via Online Payment, the refund will be credited back to your original source account within 5-7 business days.
                  </p>
                </div>
              </div>
            ) : (
              <div className="order-tracking-card">
                <div className="order-tracking-header">
                  <h2 className="order-tracking-title">
                    <Truck size={20} className="text-blue-600" />
                    Order Progress & Delivery Timeline
                  </h2>
                  <span className="order-tracking-eta">
                    {orderStatus === "Delivered" ? "Delivered Successfully" : "Estimated Delivery: 2-4 Days"}
                  </span>
                </div>

                <div className="stepper-container">
                  {trackingSteps.map((step, idx) => {
                    const isCompleted = activeStepIdx > idx;
                    const isActive = activeStepIdx === idx;
                    const StepIcon = step.icon;

                    return (
                      <div
                        key={step.key}
                        className={`stepper-step ${isCompleted ? "completed" : ""} ${isActive ? "active" : ""}`}
                      >
                        {/* Connecting Line between steps */}
                        {idx < trackingSteps.length - 1 && (
                          <div
                            className={`stepper-line ${isCompleted ? "completed" : ""}`}
                          />
                        )}

                        {/* Step Circle */}
                        <div className="stepper-icon-circle">
                          {isCompleted ? (
                            <Check size={18} />
                          ) : (
                            <StepIcon size={18} />
                          )}
                        </div>

                        {/* Label */}
                        <span className="stepper-step-title">{step.label}</span>
                        <span className="stepper-step-desc">{step.desc}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── 2-Column Responsive Layout Grid ── */}
            <div className="order-details-grid">
              {/* ── Left Column: Items, Shipping, Support ── */}
              <div className="order-details-main-col">
                {/* 1. Items in this Order */}
                <div className="order-section-card">
                  <div className="order-section-card-header">
                    <h2 className="order-section-card-title">
                      <ShoppingBag size={18} className="text-blue-600" />
                      Items in this Order ({order.items?.length || 0})
                    </h2>
                  </div>

                  <div className="order-section-card-body">
                    {order.items?.map((item, idx) => (
                      <div
                        key={item._id || item.productId || idx}
                        className="order-details-item-row"
                      >
                        <div className="order-item-left">
                          <div className="order-item-image-box">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="order-item-image"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                            ) : null}
                            <div
                              className="w-full h-full flex items-center justify-center text-blue-600 bg-blue-50"
                              style={{ display: item.image ? "none" : "flex" }}
                            >
                              <ShoppingBag size={24} />
                            </div>
                          </div>

                          <div className="order-item-details">
                            {item.productId ? (
                              <Link
                                to={`/mobiles/${item.productId}`}
                                className="order-item-name"
                              >
                                {item.name}
                              </Link>
                            ) : (
                              <p className="order-item-name">{item.name}</p>
                            )}

                            <div className="order-item-meta">
                              <span>Quantity: <strong>{item.quantity}</strong></span>
                              <span>•</span>
                              <span>{formatCurrency(item.price)} each</span>
                              {item.metadata?.offerType && (
                                <span className="order-item-badge">
                                  {item.metadata.offerType === "BOGO"
                                    ? "BOGO Special Offer"
                                    : item.metadata.offerType}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="order-item-price">
                          <div className="order-item-price-val">
                            {formatCurrency(item.price * item.quantity)}
                          </div>
                          {item.productId && (
                            <Link
                              to={`/mobiles/${item.productId}`}
                              className="text-xs font-semibold text-blue-600 hover:underline mt-1 inline-block"
                            >
                              Buy Again
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Delivery & Recipient Details */}
                <div className="order-section-card">
                  <div className="order-section-card-header">
                    <h2 className="order-section-card-title">
                      <MapPin size={18} className="text-blue-600" />
                      Delivery & Shipping Information
                    </h2>
                  </div>

                  <div className="order-section-card-body">
                    <div className="delivery-info-list">
                      <div className="delivery-info-item">
                        <div className="delivery-info-icon">
                          <User size={18} />
                        </div>
                        <div>
                          <div className="delivery-info-label">Customer Name</div>
                          <div className="delivery-info-value">{order.customerName}</div>
                        </div>
                      </div>

                      <div className="delivery-info-item">
                        <div className="delivery-info-icon">
                          <Phone size={18} />
                        </div>
                        <div>
                          <div className="delivery-info-label">Contact Phone Number</div>
                          <div className="delivery-info-value">{order.phone}</div>
                        </div>
                      </div>

                      <div className="delivery-info-item">
                        <div className="delivery-info-icon">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <div className="delivery-info-label">Shipping Address</div>
                          <div className="delivery-info-value whitespace-pre-line">
                            {order.address}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Assurance & Support Banner */}
                <div className="support-banner-card">
                  <div>
                    <div className="support-banner-title">
                      100% Genuine Mobile Devices Guaranteed
                    </div>
                    <div className="support-banner-desc">
                      Every phone is covered by official manufacturer brand warranty with 7-day replacement support.
                    </div>
                  </div>

                  <Link
                    to="/contact"
                    className="btn-order-primary shrink-0"
                    style={{ backgroundColor: "#1e40af" }}
                  >
                    <HelpCircle size={15} />
                    Need Help?
                  </Link>
                </div>
              </div>

              {/* ── Right Column: Order Summary, Payment, Actions ── */}
              <div className="order-details-side-col">
                {/* 1. Price Breakdown Card */}
                <div className="order-section-card">
                  <div className="order-section-card-header">
                    <h2 className="order-section-card-title">
                      <FileText size={18} className="text-blue-600" />
                      Order Summary
                    </h2>
                  </div>

                  <div className="order-section-card-body">
                    <div className="price-breakdown-row">
                      <span>Items Subtotal</span>
                      <span className="font-semibold text-slate-800">
                        {formatCurrency(order.subtotal)}
                      </span>
                    </div>

                    <div className="price-breakdown-row">
                      <span>Shipping & Handling</span>
                      {order.shippingCharge > 0 ? (
                        <span className="font-semibold text-slate-800">
                          {formatCurrency(order.shippingCharge)}
                        </span>
                      ) : (
                        <span className="badge-free-delivery">FREE</span>
                      )}
                    </div>

                    <div className="price-breakdown-row total">
                      <span>Total Amount</span>
                      <span className="text-blue-700">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-2">
                      All prices are inclusive of GST and applicable taxes.
                    </p>
                  </div>
                </div>

                {/* 2. Payment Details Card */}
                <div className="order-section-card">
                  <div className="order-section-card-header">
                    <h2 className="order-section-card-title">
                      <CreditCard size={18} className="text-blue-600" />
                      Payment Information
                    </h2>
                  </div>

                  <div className="order-section-card-body">
                    <div className="payment-info-box">
                      <div className="payment-method-desc">
                        <CreditCard size={18} className="text-slate-500" />
                        <span>
                          {order.paymentMethod === "COD"
                            ? "Cash on Delivery"
                            : "Online Payment (Prepaid)"}
                        </span>
                      </div>

                      <span
                        className={`payment-status-badge ${
                          order.paymentStatus === "Paid"
                            ? "paid"
                            : order.paymentStatus === "Failed"
                            ? "failed"
                            : "pending"
                        }`}
                      >
                        {order.paymentStatus || "Pending"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                      <span>Encrypted & secure order transaction</span>
                    </div>
                  </div>
                </div>

                {/* 3. Fast Actions Card */}
                <div className="order-section-card">
                  <div className="order-section-card-body flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="btn-order-primary w-full justify-center"
                    >
                      <Printer size={16} />
                      Download / Print Receipt
                    </button>

                    <Link
                      to="/mobiles"
                      className="btn-order-secondary w-full justify-center"
                    >
                      <ShoppingBag size={16} />
                      Continue Shopping
                    </Link>

                    <Link
                      to="/contact"
                      className="btn-order-secondary w-full justify-center text-slate-500"
                    >
                      <HelpCircle size={16} />
                      Contact Customer Support
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
