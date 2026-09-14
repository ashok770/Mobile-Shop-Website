import React, { useEffect, useState } from "react";
import {
  X,
  User,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Package,
  ArrowRight,
  ShieldCheck,
  RefreshCcw,
} from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import "./OrdersPage.css";

const ALLOWED_TRANSITIONS = {
  Pending: ["Confirmed", "Cancelled"],
  Confirmed: ["Packed", "Cancelled"],
  Packed: ["Shipped", "Cancelled"],
  Shipped: ["Out for Delivery", "Cancelled"],
  "Out for Delivery": ["Delivered", "Cancelled"],
  Delivered: [],
  Cancelled: [],
};

export default function OrderDetailsModal({
  order,
  onClose,
  onStatusUpdate,
  isUpdatingStatus,
  error,
}) {
  const [selectedNextStatus, setSelectedNextStatus] = useState("");

  useEffect(() => {
    if (order) {
      setSelectedNextStatus("");
    }
  }, [order]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!order) return null;

  const currentStatus = order.orderStatus || "Pending";
  const allowedNext = ALLOWED_TRANSITIONS[currentStatus] || [];
  const isTerminal = allowedNext.length === 0;

  const subtotal = order.subtotal ?? (order.items || []).reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  const shippingCharge = order.shippingCharge ?? (subtotal > 0 && subtotal < 500 ? 49 : 0);
  const totalAmount = order.totalAmount ?? (subtotal + shippingCharge);

  const handleUpdate = () => {
    if (!selectedNextStatus || selectedNextStatus === currentStatus) return;
    onStatusUpdate(order._id, selectedNextStatus);
  };

  return (
    <div className="order-modal-backdrop" onClick={onClose}>
      <div
        className="order-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Header */}
        <div className="order-modal-header">
          <div className="modal-header-info">
            <div className="modal-title-row">
              <h3 id="modal-title" className="modal-order-id">
                Order #{order._id}
              </h3>
              <OrderStatusBadge status={currentStatus} />
            </div>
            <span className="modal-order-date">
              Placed on {formatDate(order.createdAt)}
            </span>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close order details"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body Scrollable Content */}
        <div className="order-modal-body">
          {error && (
            <div className="modal-error-banner" role="alert">
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Customer & Address Information Grid */}
          <div className="modal-info-grid">
            <div className="info-card">
              <div className="info-card-title">
                <User size={16} /> Customer Information
              </div>
              <div className="info-card-content">
                <p className="info-primary-text">{order.customerName || "N/A"}</p>
                {order.phone && (
                  <a href={`tel:${order.phone}`} className="info-link">
                    <Phone size={14} /> {order.phone}
                  </a>
                )}
              </div>
            </div>

            <div className="info-card">
              <div className="info-card-title">
                <MapPin size={16} /> Shipping Address
              </div>
              <div className="info-card-content">
                <p className="info-address-text">{order.address || "N/A"}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-card-title">
                <CreditCard size={16} /> Payment Status
              </div>
              <div className="info-card-content">
                <div className="payment-badge-row">
                  <span className="payment-method-tag">{order.paymentMethod || "COD"}</span>
                  <OrderStatusBadge status={order.paymentStatus || "Pending"} type="payment" />
                </div>
                {order.paidAt && (
                  <span className="timestamp-note">
                    Paid at: {formatDate(order.paidAt)}
                  </span>
                )}
                {order.deliveredAt && (
                  <span className="timestamp-note">
                    Delivered at: {formatDate(order.deliveredAt)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="modal-section">
            <h4 className="section-heading">
              <Package size={18} /> Ordered Items ({(order.items || []).length})
            </h4>

            <div className="modal-items-table-wrapper">
              <table className="modal-items-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th className="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(order.items || []).map((item, idx) => {
                    const itemPrice = Number(item.price) || 0;
                    const itemQty = Number(item.quantity) || 1;
                    const itemTotal = itemPrice * itemQty;

                    return (
                      <tr key={idx}>
                        <td className="item-cell">
                          <div className="item-thumb">
                            {item.image ? (
                              <img src={item.image} alt={item.name} />
                            ) : (
                              <Package size={20} className="placeholder-icon" />
                            )}
                          </div>
                          <span className="item-name">{item.name || "Product"}</span>
                        </td>
                        <td>{formatCurrency(itemPrice)}</td>
                        <td>× {itemQty}</td>
                        <td className="text-right font-medium">{formatCurrency(itemTotal)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="financial-summary-card">
            <div className="summary-line">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="summary-line">
              <span>Shipping Charge</span>
              <span>{shippingCharge > 0 ? formatCurrency(shippingCharge) : "FREE"}</span>
            </div>
            <div className="summary-line total-line">
              <span>Total Amount</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          {/* Status Update Control Card */}
          <div className="status-update-card">
            <div className="status-update-header">
              <h4>Fulfillment Lifecycle Control</h4>
              <span className="current-status-tag">
                Current Status: <strong>{currentStatus}</strong>
              </span>
            </div>

            {isTerminal ? (
              <div className="terminal-state-notice">
                <ShieldCheck size={18} />
                <span>
                  This order is in terminal status (<strong>{currentStatus}</strong>). No further status updates are permitted in V1.
                </span>
              </div>
            ) : (
              <div className="status-action-row">
                <div className="status-select-wrapper">
                  <label htmlFor="next-status-select" className="sr-only">Select next status</label>
                  <select
                    id="next-status-select"
                    className="modal-status-select"
                    value={selectedNextStatus}
                    onChange={(e) => setSelectedNextStatus(e.target.value)}
                    disabled={isUpdatingStatus}
                  >
                    <option value="">-- Choose Next Status --</option>
                    {allowedNext.map((st) => (
                      <option key={st} value={st}>
                        Transition to: {st}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  className="btn-update-status"
                  onClick={handleUpdate}
                  disabled={!selectedNextStatus || isUpdatingStatus}
                >
                  {isUpdatingStatus ? (
                    <>
                      <RefreshCcw size={16} className="spin-icon" /> Updating...
                    </>
                  ) : (
                    <>
                      Apply Status <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
