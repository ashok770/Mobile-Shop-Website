import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCcw,
  AlertCircle,
  CheckCircle2,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Copy,
  Check,
  AlertTriangle,
  PackageSearch,
  Eye,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { adminFetch } from "../../utils/adminFetch";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
import CustomerStatusBadge from "./CustomerStatusBadge";
import OrderDetailsModal from "../orders/OrderDetailsModal";
import "./CustomerDetailPage.css";

export default function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Data state
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Status Action Modal state
  const [confirmStatusUpdate, setConfirmStatusUpdate] = useState(null); // { targetStatus: string }
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Selected Order for OrderDetailsModal inspection
  const [selectedOrderDoc, setSelectedOrderDoc] = useState(null);
  const [loadingOrderModal, setLoadingOrderModal] = useState(false);

  // Notification state
  const [feedback, setFeedback] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Auto-clear feedback notification
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => {
      setFeedback(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [feedback]);

  // Fetch customer detail from GET /api/admin/customers/:id
  const fetchCustomerDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await adminFetch(`${API}/api/admin/customers/${id}`);

      if (!res.ok) {
        if (res.status === 401) {
          navigate("/admin/login", { replace: true });
          return;
        }
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to load customer profile");
      }

      const data = await res.json();
      setCustomer(data.customer || null);
    } catch (err) {
      setError(err.message || "Unable to load customer profile");
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchCustomerDetail();
  }, [fetchCustomerDetail]);

  // Status Mutation Handler (PUT /api/admin/customers/:id/status)
  const handleExecuteStatusUpdate = async (targetStatus) => {
    setIsUpdatingStatus(true);
    setConfirmStatusUpdate(null);
    try {
      const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await adminFetch(`${API}/api/admin/customers/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountStatus: targetStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update account status");
      }

      setFeedback({
        type: "success",
        message: `Customer account status updated to "${targetStatus}" successfully.`,
      });

      fetchCustomerDetail();
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Inspect order modal trigger
  const handleInspectOrder = async (orderId) => {
    setLoadingOrderModal(true);
    try {
      const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await adminFetch(`${API}/api/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedOrderDoc(data.order);
      }
    } catch (err) {
      console.error("Failed to load order details for modal:", err);
    } finally {
      setLoadingOrderModal(false);
    }
  };

  // Copy ID helper
  const handleCopyId = (val, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(val);
    setCopiedId(val);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="admin-customer-detail-page">
        <div className="detail-skeleton-wrapper">
          <div className="skeleton-box skeleton-header" />
          <div className="skeleton-box skeleton-grid" />
          <div className="skeleton-box skeleton-table" />
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="admin-customer-detail-page">
        <div className="detail-error-state">
          <AlertCircle size={48} />
          <h2>Customer Not Found</h2>
          <p>{error || "The requested customer profile could not be loaded."}</p>
          <div className="error-actions">
            <button
              type="button"
              className="btn-back"
              onClick={() => navigate("/admin/customers")}
            >
              <ArrowLeft size={16} /> Back to Customers
            </button>
            <button type="button" className="btn-retry" onClick={fetchCustomerDetail}>
              <RefreshCcw size={16} /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const initial = (customer.name || "C").charAt(0).toUpperCase();
  const currentStatus = customer.accountStatus || "ACTIVE";
  const stats = customer.stats || {
    totalOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalSpent: 0,
  };
  const addresses = customer.addresses || [];
  const recentOrders = customer.recentOrders || [];

  return (
    <div className="admin-customer-detail-page">
      {/* Alert Notification Banner */}
      {feedback && (
        <div className={`admin-alert-banner ${feedback.type}`} role="alert">
          <div className="admin-alert-content">
            {feedback.type === "success" ? (
              <CheckCircle2 size={18} className="admin-alert-icon" />
            ) : (
              <AlertCircle size={18} className="admin-alert-icon" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            className="admin-alert-close"
            onClick={() => setFeedback(null)}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="admin-detail-header">
        <div className="header-text-group">
          <span className="header-breadcrumbs">ADMIN / CUSTOMER MANAGEMENT / CUSTOMER DETAILS</span>
          <h1 className="header-title">{customer.name || "Customer Profile"}</h1>
          <p className="header-subtitle">
            Inspect customer profile, stored addresses, historical purchase metrics, and manage account status.
          </p>
        </div>

        <div className="header-action-buttons">
          <button
            type="button"
            className="btn-back"
            onClick={() => navigate("/admin/customers")}
          >
            <ArrowLeft size={16} /> <span>Back to Customers</span>
          </button>
          <button
            type="button"
            className="btn-refresh"
            onClick={fetchCustomerDetail}
            disabled={loading}
            title="Refresh Customer Details"
          >
            <RefreshCcw size={16} className={loading ? "spin-icon" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="detail-layout-grid">
        {/* Left Column: Profile Card & Status Control */}
        <div className="detail-left-column">
          {/* Profile Identity Card */}
          <div className="detail-card profile-card">
            <div className="profile-card-top">
              <div className="large-avatar-circle">
                {customer.avatar ? (
                  <img src={customer.avatar} alt={customer.name} />
                ) : (
                  <span className="avatar-initial">{initial}</span>
                )}
              </div>

              <div className="profile-identity-group">
                <h2 className="profile-full-name">{customer.name || "N/A"}</h2>
                <div className="profile-id-row">
                  <span className="mono-id">#{customer._id}</span>
                  <button
                    type="button"
                    className="copy-btn"
                    onClick={(e) => handleCopyId(customer._id, e)}
                    title="Copy Customer ID"
                  >
                    {copiedId === customer._id ? (
                      <Check size={13} className="text-success" />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                </div>
                <div className="profile-badges-row">
                  <CustomerStatusBadge status={currentStatus} />
                  {customer.emailVerified ? (
                    <span className="verification-tag verified">
                      <CheckCircle size={12} /> Email Verified
                    </span>
                  ) : (
                    <span className="verification-tag unverified">
                      <AlertTriangle size={12} /> Email Unverified
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="profile-details-list">
              <div className="detail-field">
                <Mail size={16} className="field-icon" />
                <div className="field-content">
                  <span className="field-label">Email Address</span>
                  <span className="field-value">{customer.email || "N/A"}</span>
                </div>
              </div>

              <div className="detail-field">
                <Calendar size={16} className="field-icon" />
                <div className="field-content">
                  <span className="field-label">Registration Date</span>
                  <span className="field-value">{formatDate(customer.createdAt)}</span>
                </div>
              </div>

              <div className="detail-field">
                <Clock size={16} className="field-icon" />
                <div className="field-content">
                  <span className="field-label">Last Account Update</span>
                  <span className="field-value">{formatDate(customer.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Status Control Card */}
          <div className="detail-card status-control-card">
            <div className="card-header">
              <h3 className="card-title">
                <ShieldCheck size={18} /> Account Status Control
              </h3>
              <span className="current-status-tag">
                Current: <strong>{currentStatus}</strong>
              </span>
            </div>

            <div className="status-control-body">
              <p className="status-control-desc">
                Modifying the account status immediately updates login access and session enforcement for this customer.
              </p>

              <div className="status-button-group">
                {currentStatus === "ACTIVE" ? (
                  <>
                    <button
                      type="button"
                      className="btn-status-action btn-disable"
                      onClick={() => setConfirmStatusUpdate({ targetStatus: "DISABLED" })}
                      disabled={isUpdatingStatus}
                    >
                      <ShieldAlert size={16} /> Disable Account
                    </button>
                    <button
                      type="button"
                      className="btn-status-action btn-suspend"
                      onClick={() => setConfirmStatusUpdate({ targetStatus: "SUSPENDED" })}
                      disabled={isUpdatingStatus}
                    >
                      <AlertTriangle size={16} /> Suspend Account
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="btn-status-action btn-activate"
                    onClick={() => setConfirmStatusUpdate({ targetStatus: "ACTIVE" })}
                    disabled={isUpdatingStatus}
                  >
                    <CheckCircle2 size={16} /> Reactivate Account
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Statistics, Addresses & Orders */}
        <div className="detail-right-column">
          {/* Purchase Metrics Grid */}
          <div className="customer-stats-grid">
            <div className="stat-card">
              <div className="stat-icon-box stat-blue">
                <ShoppingBag size={22} />
              </div>
              <div className="stat-details">
                <span className="stat-label">Total Orders</span>
                <span className="stat-value">{stats.totalOrders}</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-box stat-emerald">
                <CheckCircle2 size={22} />
              </div>
              <div className="stat-details">
                <span className="stat-label">Delivered Orders</span>
                <span className="stat-value">{stats.deliveredOrders}</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-box stat-red">
                <XCircle size={22} />
              </div>
              <div className="stat-details">
                <span className="stat-label">Cancelled Orders</span>
                <span className="stat-value">{stats.cancelledOrders}</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-box stat-indigo">
                <TrendingUp size={22} />
              </div>
              <div className="stat-details">
                <span className="stat-label">Total Spent</span>
                <span className="stat-value">{formatCurrency(stats.totalSpent)}</span>
              </div>
            </div>
          </div>

          {/* Stored Addresses Section */}
          <div className="detail-card">
            <div className="card-header">
              <h3 className="card-title">
                <MapPin size={18} /> Stored Shipping Addresses ({addresses.length})
              </h3>
            </div>

            <div className="addresses-grid">
              {addresses.length === 0 ? (
                <div className="empty-sub-card">
                  <MapPin size={28} className="empty-sub-icon" />
                  <p>No saved shipping addresses</p>
                </div>
              ) : (
                addresses.map((addr, idx) => (
                  <div key={addr._id || idx} className="address-card">
                    <div className="address-card-header">
                      <span className="address-recipient-name">{addr.fullName || customer.name}</span>
                      {addr.isDefault && <span className="default-address-tag">Default</span>}
                    </div>
                    {addr.phone && (
                      <span className="address-phone">
                        <Phone size={12} /> {addr.phone}
                      </span>
                    )}
                    <p className="address-street">{addr.street}</p>
                    <p className="address-location">
                      {addr.city}, {addr.state} — {addr.pincode}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Orders Section */}
          <div className="detail-card">
            <div className="card-header">
              <h3 className="card-title">
                <ShoppingBag size={18} /> Recent Order History ({recentOrders.length})
              </h3>
            </div>

            {recentOrders.length === 0 ? (
              <div className="empty-sub-card">
                <PackageSearch size={28} className="empty-sub-icon" />
                <p>No orders placed yet</p>
              </div>
            ) : (
              <div className="recent-orders-table-wrapper">
                <table className="recent-orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((ord) => (
                      <tr key={ord._id}>
                        <td className="mono-id-cell">#{ord._id.slice(-6)}</td>
                        <td>{formatDate(ord.createdAt)}</td>
                        <td>
                          <CustomerStatusBadge status={ord.orderStatus} />
                        </td>
                        <td>{ord.itemsCount} {ord.itemsCount === 1 ? "item" : "items"}</td>
                        <td className="font-medium">{formatCurrency(ord.totalAmount)}</td>
                        <td className="text-right">
                          <button
                            type="button"
                            className="btn-view-order-small"
                            onClick={() => handleInspectOrder(ord._id)}
                            disabled={loadingOrderModal}
                            title="Inspect Order Details"
                          >
                            <Eye size={14} /> <span>Inspect</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal Overlay for Account Status Changes */}
      {confirmStatusUpdate && (
        <div className="confirm-dialog-overlay" onClick={() => setConfirmStatusUpdate(null)}>
          <div className="confirm-dialog-box" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-dialog-header">
              <AlertTriangle size={24} className="confirm-warning-icon" />
              <h4>Confirm Account Status Modification</h4>
            </div>

            <div className="confirm-dialog-body">
              {confirmStatusUpdate.targetStatus === "DISABLED" && (
                <p>
                  Disable this customer account? The customer will immediately be blocked from logging in or using any authenticated customer resources.
                </p>
              )}
              {confirmStatusUpdate.targetStatus === "SUSPENDED" && (
                <p>
                  Suspend this customer account? The customer will immediately be blocked from logging in or placing orders.
                </p>
              )}
              {confirmStatusUpdate.targetStatus === "ACTIVE" && (
                <p>
                  Reactivate this customer account? The customer will regain full access to log in and place purchases.
                </p>
              )}
            </div>

            <div className="confirm-dialog-actions">
              <button
                type="button"
                className="btn-confirm-cancel"
                onClick={() => setConfirmStatusUpdate(null)}
              >
                Back
              </button>
              <button
                type="button"
                className={`btn-confirm-submit ${confirmStatusUpdate.targetStatus === "ACTIVE" ? "primary" : "danger"}`}
                onClick={() => handleExecuteStatusUpdate(confirmStatusUpdate.targetStatus)}
              >
                Confirm {confirmStatusUpdate.targetStatus}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reused OrderDetailsModal for Order Inspection */}
      {selectedOrderDoc && (
        <OrderDetailsModal
          order={selectedOrderDoc}
          onClose={() => setSelectedOrderDoc(null)}
          onStatusUpdate={() => {}}
          isUpdatingStatus={false}
          error={null}
        />
      )}
    </div>
  );
}
