import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  RefreshCcw,
  AlertCircle,
  CheckCircle2,
  X,
  PackageSearch,
  Eye,
  Calendar,
  Filter,
  ShoppingBag,
  Clock,
  TrendingUp,
  Copy,
  Check,
} from "lucide-react";
import { adminFetch } from "../../utils/adminFetch";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderDetailsModal from "./OrderDetailsModal";
import "./OrdersPage.css";

const PAGE_SIZE = 20;

const ALLOWED_TRANSITIONS = {
  Pending: ["Confirmed", "Cancelled"],
  Confirmed: ["Packed", "Cancelled"],
  Packed: ["Shipped", "Cancelled"],
  Shipped: ["Out for Delivery", "Cancelled"],
  "Out for Delivery": ["Delivered", "Cancelled"],
  Delivered: [],
  Cancelled: [],
};

export default function OrdersPage() {
  // Data state
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
  });

  // Filters & Search state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [paymentStatus, setPaymentStatus] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);

  // Modal & Notification state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Auto-clear feedback notification
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => {
      setFeedback(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [feedback]);

  // Fetch summary stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await adminFetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/orders/stats`);
      if (res.ok) {
        const data = await res.json();
        setStats({
          totalOrders: data.totalOrders || 0,
          pendingOrders: data.pendingOrders || 0,
          deliveredOrders: data.deliveredOrders || 0,
          totalRevenue: data.totalRevenue || 0,
        });
      }
    } catch (err) {
      console.error("Failed to fetch order stats:", err);
    }
  }, []);

  // Fetch orders list
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
      });

      if (debouncedSearch.trim()) query.append("search", debouncedSearch.trim());
      if (status && status !== "ALL") query.append("status", status);
      if (paymentStatus && paymentStatus !== "ALL") query.append("paymentStatus", paymentStatus);
      if (startDate) query.append("startDate", startDate);
      if (endDate) query.append("endDate", endDate);

      const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await adminFetch(`${API}/api/orders?${query.toString()}`);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to load orders");
      }

      const data = await res.json();
      setOrders(data.orders || []);
      setPagination({
        page: data.page || page,
        limit: PAGE_SIZE,
        total: data.total || 0,
        totalPages: data.totalPages || 1,
      });
    } catch (err) {
      setError(err.message || "Unable to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, status, paymentStatus, startDate, endDate]);

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [fetchOrders, fetchStats]);

  // Update order status
  const handleUpdateStatus = async (orderId, newStatus) => {
    setIsUpdatingStatus(true);
    setModalError(null);
    try {
      const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await adminFetch(`${API}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update order status");
      }

      setFeedback({
        type: "success",
        message: `Order status updated to "${newStatus}" successfully.`,
      });

      // If modal is open for this order, update local selected order
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(data.order);
      }

      fetchOrders();
      fetchStats();
    } catch (err) {
      setModalError(err.message);
      setFeedback({ type: "error", message: err.message });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatus("ALL");
    setPaymentStatus("ALL");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  // Copy order ID helper
  const handleCopyId = (id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isFilterActive =
    search.trim() || status !== "ALL" || paymentStatus !== "ALL" || startDate || endDate;

  return (
    <div className="admin-orders-page">
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
      <div className="admin-orders-header">
        <div className="header-text-group">
          <span className="header-breadcrumbs">ADMIN / ORDERS MANAGEMENT</span>
          <h1 className="header-title">Order Management</h1>
          <p className="header-subtitle">
            Track customer purchases, manage fulfillment lifecycles, and inspect payment records.
          </p>
        </div>

        <button
          type="button"
          className="btn-refresh"
          onClick={() => {
            fetchOrders();
            fetchStats();
          }}
          disabled={loading}
          title="Refresh Data"
        >
          <RefreshCcw size={16} className={loading ? "spin-icon" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Summary Cards Grid */}
      <div className="orders-stats-grid">
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
          <div className="stat-icon-box stat-amber">
            <Clock size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Pending Fulfillment</span>
            <span className="stat-value">{stats.pendingOrders}</span>
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
          <div className="stat-icon-box stat-indigo">
            <TrendingUp size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">{formatCurrency(stats.totalRevenue)}</span>
          </div>
        </div>
      </div>

      {/* Filter Bar Section */}
      <div className="orders-filter-container">
        <div className="filter-top-row">
          {/* Search Input */}
          <div className="orders-search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by customer, phone, or Order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            {search && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearch("")}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Payment Status Selector */}
          <div className="filter-select-group">
            <label htmlFor="payment-status-filter" className="sr-only">Payment Status</label>
            <select
              id="payment-status-filter"
              value={paymentStatus}
              onChange={(e) => {
                setPaymentStatus(e.target.value);
                setPage(1);
              }}
              className="filter-select"
            >
              <option value="ALL">All Payment Statuses</option>
              <option value="Pending">Payment: Pending</option>
              <option value="Paid">Payment: Paid</option>
              <option value="Failed">Payment: Failed</option>
              <option value="Refunded">Payment: Refunded</option>
            </select>
          </div>

          {/* Date Range Controls */}
          <div className="date-filter-group">
            <div className="date-input-wrapper">
              <Calendar size={14} className="date-icon" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(1);
                }}
                className="date-input"
                title="Start Date"
              />
            </div>
            <span className="date-sep">to</span>
            <div className="date-input-wrapper">
              <Calendar size={14} className="date-icon" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(1);
                }}
                className="date-input"
                title="End Date"
              />
            </div>
          </div>

          {/* Reset Filters Button */}
          {isFilterActive && (
            <button
              type="button"
              className="btn-reset-filters"
              onClick={handleResetFilters}
            >
              <RefreshCcw size={14} /> Reset Filters
            </button>
          )}
        </div>

        {/* Horizontal Status Pill Tabs */}
        <div className="status-tabs-row">
          {["ALL", "Pending", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"].map(
            (st) => (
              <button
                key={st}
                type="button"
                className={`status-tab-btn ${status === st ? "active" : ""}`}
                onClick={() => {
                  setStatus(st);
                  setPage(1);
                }}
              >
                {st === "ALL" ? "All Orders" : st}
              </button>
            )
          )}
        </div>
      </div>

      {/* Main Table Section */}
      <div className="orders-table-wrapper">
        {error ? (
          <div className="orders-error-state">
            <AlertCircle size={36} />
            <p>{error}</p>
            <button type="button" className="btn-retry" onClick={fetchOrders}>
              Retry Loading
            </button>
          </div>
        ) : loading ? (
          <div className="orders-skeleton-wrapper">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-row" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="orders-empty-state">
            <PackageSearch size={48} className="empty-icon" />
            <h3>No orders found</h3>
            <p>No customer orders match your current search or filter criteria.</p>
            {isFilterActive && (
              <button
                type="button"
                className="btn-reset-filters-empty"
                onClick={handleResetFilters}
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <table className="orders-main-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items Snapshot</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Order Status</th>
                <th>Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const currentSt = order.orderStatus || "Pending";
                const allowedNext = ALLOWED_TRANSITIONS[currentSt] || [];
                const isTerminal = allowedNext.length === 0;

                const primaryItem = (order.items && order.items[0]) || { name: "Item", quantity: 1 };
                const extraItemsCount = (order.items || []).length - 1;

                return (
                  <tr key={order._id} className="order-table-row">
                    {/* Order ID */}
                    <td className="id-cell">
                      <div className="id-flex">
                        <span className="mono-id">#{order._id.slice(-6)}</span>
                        <button
                          type="button"
                          className="copy-btn"
                          onClick={(e) => handleCopyId(order._id, e)}
                          title="Copy Full Order ID"
                        >
                          {copiedId === order._id ? <Check size={13} className="text-success" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="customer-cell">
                      <span className="customer-name">{order.customerName || "N/A"}</span>
                      <span className="customer-phone">{order.phone || ""}</span>
                    </td>

                    {/* Items */}
                    <td className="items-cell">
                      <span className="primary-item-name">{primaryItem.name}</span>
                      {extraItemsCount > 0 && (
                        <span className="extra-items-badge">+{extraItemsCount} more</span>
                      )}
                    </td>

                    {/* Total */}
                    <td className="total-cell font-medium">
                      {formatCurrency(order.totalAmount ?? 0)}
                    </td>

                    {/* Payment */}
                    <td className="payment-cell">
                      <div className="payment-cell-flex">
                        <span className="pay-method">{order.paymentMethod || "COD"}</span>
                        <OrderStatusBadge status={order.paymentStatus || "Pending"} type="payment" />
                      </div>
                    </td>

                    {/* Order Status Badge */}
                    <td className="status-cell">
                      <OrderStatusBadge status={currentSt} />
                    </td>

                    {/* Date */}
                    <td className="date-cell">
                      {formatDate(order.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="actions-cell text-right">
                      <div className="actions-flex">
                        {/* Quick inline transition select */}
                        <select
                          className="inline-status-select"
                          value={currentSt}
                          onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                          disabled={isTerminal || isUpdatingStatus}
                          title={isTerminal ? "Terminal State — Cannot transition" : "Quick status transition"}
                        >
                          <option value={currentSt}>{currentSt}</option>
                          {allowedNext.map((st) => (
                            <option key={st} value={st}>
                              ➔ {st}
                            </option>
                          ))}
                        </select>

                        {/* Details Modal Trigger */}
                        <button
                          type="button"
                          className="btn-action-view"
                          onClick={() => setSelectedOrder(order)}
                          title="View Full Order Details"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      {!loading && !error && orders.length > 0 && (
        <div className="orders-pagination-footer">
          <span className="pagination-info">
            Showing Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.total} total orders)
          </span>

          <div className="pagination-buttons">
            <button
              type="button"
              className="btn-page"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page <= 1}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn-page"
              onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
              disabled={page >= pagination.totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Order Details Modal Drawer */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={handleUpdateStatus}
          isUpdatingStatus={isUpdatingStatus}
          error={modalError}
        />
      )}
    </div>
  );
}
