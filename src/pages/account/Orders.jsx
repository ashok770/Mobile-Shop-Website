import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Calendar,
  Hash,
  RefreshCw,
  CreditCard,
  Search,
  X,
  Copy,
  Check,
  ChevronRight,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ShoppingBag,
  ExternalLink,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import "./Orders.css";

const statusIcons = {
  Pending: Clock,
  Confirmed: CheckCircle2,
  Packed: Package,
  Shipped: Truck,
  "Out for Delivery": Truck,
  Delivered: CheckCircle2,
  Cancelled: XCircle,
};

const statusClassKey = {
  Pending: "pending",
  Confirmed: "confirmed",
  Packed: "packed",
  Shipped: "shipped",
  "Out for Delivery": "out-for-delivery",
  Delivered: "delivered",
  Cancelled: "cancelled",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get("/orders/my-orders");
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load your orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCopyId = (id) => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Order ID copied to clipboard!", { id: "copy-order-id" });
    setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 2000);
  };

  // Compute stats
  const stats = useMemo(() => {
    const totalCount = orders.length;
    const inProgressCount = orders.filter((o) =>
      ["Pending", "Confirmed", "Packed", "Shipped", "Out for Delivery"].includes(o.orderStatus)
    ).length;
    const deliveredCount = orders.filter((o) => o.orderStatus === "Delivered").length;
    const totalSpent = orders
      .filter((o) => o.orderStatus !== "Cancelled")
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return { totalCount, inProgressCount, deliveredCount, totalSpent };
  }, [orders]);

  // Filter orders based on active tab and search query
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Tab filter
      if (activeTab === "IN_PROGRESS") {
        if (!["Pending", "Confirmed", "Packed", "Shipped", "Out for Delivery"].includes(order.orderStatus)) {
          return false;
        }
      } else if (activeTab === "DELIVERED") {
        if (order.orderStatus !== "Delivered") return false;
      } else if (activeTab === "CANCELLED") {
        if (order.orderStatus !== "Cancelled") return false;
      }

      // 2. Search query filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesId = order._id?.toLowerCase().includes(query);
        const matchesCustomer = order.customerName?.toLowerCase().includes(query);
        const matchesItems = order.items?.some((item) =>
          item.name?.toLowerCase().includes(query)
        );

        if (!matchesId && !matchesCustomer && !matchesItems) {
          return false;
        }
      }

      return true;
    });
  }, [orders, activeTab, searchTerm]);

  return (
    <main className="orders-page-shell">
      <div className="orders-container">
        {/* ── Breadcrumb Navigation ── */}
        <nav className="orders-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="orders-breadcrumb-separator">/</span>
          <Link to="/profile">My Account</Link>
          <span className="orders-breadcrumb-separator">/</span>
          <span className="orders-breadcrumb-current">My Orders</span>
        </nav>

        {/* ── Page Header ── */}
        <div className="orders-header-row">
          <div>
            <h1 className="orders-header-title">
              My Orders
              {!loading && (
                <span className="orders-count-badge">
                  {orders.length} {orders.length === 1 ? "order" : "orders"}
                </span>
              )}
            </h1>
            <p className="orders-header-subtitle">
              Track status, download invoices, review purchases and request returns.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchOrders}
              className="btn-order-secondary"
              title="Refresh orders"
              disabled={loading}
            >
              <RefreshCw size={15} className={loading ? "animate-spin text-blue-600" : ""} />
              Refresh
            </button>
            <Link to="/mobiles" className="btn-order-primary">
              <ShoppingBag size={15} />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* ── Top Summary Stats Bar ── */}
        {!loading && orders.length > 0 && (
          <div className="orders-stats-bar">
            <div className="order-stat-card">
              <div className="order-stat-icon blue">
                <Package size={20} />
              </div>
              <div className="order-stat-info">
                <div className="order-stat-value">{stats.totalCount}</div>
                <div className="order-stat-label">Total Orders</div>
              </div>
            </div>

            <div className="order-stat-card">
              <div className="order-stat-icon amber">
                <Truck size={20} />
              </div>
              <div className="order-stat-info">
                <div className="order-stat-value">{stats.inProgressCount}</div>
                <div className="order-stat-label">In Progress</div>
              </div>
            </div>

            <div className="order-stat-card">
              <div className="order-stat-icon green">
                <CheckCircle2 size={20} />
              </div>
              <div className="order-stat-info">
                <div className="order-stat-value">{stats.deliveredCount}</div>
                <div className="order-stat-label">Delivered</div>
              </div>
            </div>

            <div className="order-stat-card">
              <div className="order-stat-icon purple">
                <Sparkles size={20} />
              </div>
              <div className="order-stat-info">
                <div className="order-stat-value">{formatCurrency(stats.totalSpent)}</div>
                <div className="order-stat-label">Total Purchases</div>
              </div>
            </div>
          </div>
        )}

        {/* ── Search & Filter Controls ── */}
        {!loading && orders.length > 0 && (
          <div className="orders-filter-container">
            <div className="orders-filter-tabs">
              <button
                type="button"
                className={`orders-tab-btn ${activeTab === "ALL" ? "active" : ""}`}
                onClick={() => setActiveTab("ALL")}
              >
                All Orders
                <span className="orders-tab-count">{orders.length}</span>
              </button>

              <button
                type="button"
                className={`orders-tab-btn ${activeTab === "IN_PROGRESS" ? "active" : ""}`}
                onClick={() => setActiveTab("IN_PROGRESS")}
              >
                In Progress
                <span className="orders-tab-count">{stats.inProgressCount}</span>
              </button>

              <button
                type="button"
                className={`orders-tab-btn ${activeTab === "DELIVERED" ? "active" : ""}`}
                onClick={() => setActiveTab("DELIVERED")}
              >
                Delivered
                <span className="orders-tab-count">{stats.deliveredCount}</span>
              </button>

              <button
                type="button"
                className={`orders-tab-btn ${activeTab === "CANCELLED" ? "active" : ""}`}
                onClick={() => setActiveTab("CANCELLED")}
              >
                Cancelled
                <span className="orders-tab-count">
                  {orders.filter((o) => o.orderStatus === "Cancelled").length}
                </span>
              </button>
            </div>

            <div className="orders-search-wrapper">
              <Search size={15} className="orders-search-icon" />
              <input
                type="text"
                placeholder="Search by Order ID or item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="orders-search-input"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="orders-search-clear"
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Content States ── */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm py-24 px-8 text-center my-6">
            <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">Loading your orders...</h3>
            <p className="text-sm text-slate-500 mt-1">Retrieving your latest order status and history.</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl border border-red-200 shadow-sm py-16 px-8 text-center max-w-lg mx-auto my-8">
            <div className="h-14 w-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={30} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Failed to load orders</h2>
            <p className="text-sm text-slate-500 mt-2 mb-6">{error}</p>
            <button onClick={fetchOrders} className="btn-order-primary mx-auto">
              <RefreshCw size={15} />
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          /* Empty orders state */
          <div className="orders-empty-state">
            <div className="orders-empty-icon">
              <Package size={34} />
            </div>
            <h2 className="orders-empty-title">No orders placed yet</h2>
            <p className="orders-empty-desc">
              Looks like you haven't placed any orders with us yet. Discover the latest smartphones, genuine accessories, and exclusive festival discounts today!
            </p>
            <Link to="/mobiles" className="btn-order-primary mx-auto">
              <ShoppingBag size={16} />
              Explore Smartphones
            </Link>
          </div>
        ) : filteredOrders.length === 0 ? (
          /* No filter match state */
          <div className="orders-empty-state">
            <div className="orders-empty-icon" style={{ backgroundColor: "#fef3c7", color: "#d97706" }}>
              <Search size={32} />
            </div>
            <h2 className="orders-empty-title">No matching orders found</h2>
            <p className="orders-empty-desc">
              We couldn't find any orders matching "{searchTerm}". Try checking for spelling errors or clear your active filters.
            </p>
            <button
              onClick={() => {
                setActiveTab("ALL");
                setSearchTerm("");
              }}
              className="btn-order-secondary mx-auto"
            >
              <RotateCcw size={15} />
              Reset All Filters
            </button>
          </div>
        ) : (
          /* ── Orders List ── */
          <div className="space-y-5">
            {filteredOrders.map((order) => {
              const status = order.orderStatus || "Pending";
              const StatusIcon = statusIcons[status] || Clock;
              const badgeKey = statusClassKey[status] || "pending";
              const items = order.items || [];
              const firstItem = items[0] || {};
              const shortId = order._id?.slice(-8).toUpperCase() || "N/A";
              const isCopied = copiedId === order._id;

              return (
                <article key={order._id} className="order-card">
                  {/* Card Header Strip */}
                  <div className="order-card-header">
                    {/* 1. Date */}
                    <div className="order-header-block">
                      <span className="order-header-label">Order Placed</span>
                      <span className="order-header-value">
                        <Calendar size={14} className="text-slate-400 shrink-0" />
                        {formatDate(order.createdAt)}
                      </span>
                    </div>

                    {/* 2. Order ID */}
                    <div className="order-header-block">
                      <span className="order-header-label">Order Reference</span>
                      <div className="order-header-value">
                        <span className="font-mono font-bold text-slate-800">
                          #{shortId}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyId(order._id)}
                          className="order-id-copy-btn"
                          title="Copy Full Order ID"
                        >
                          {isCopied ? (
                            <>
                              <Check size={12} className="text-emerald-600" />
                              <span className="text-emerald-600 font-semibold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* 3. Total & Payment */}
                    <div className="order-header-block">
                      <span className="order-header-label">Total Amount</span>
                      <div className="order-header-value">
                        <span className="text-base font-extrabold text-slate-900">
                          {formatCurrency(order.totalAmount)}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {order.paymentMethod === "COD" ? "Cash on Delivery" : "Online"}
                        </span>
                      </div>
                    </div>

                    {/* 4. Status Pill */}
                    <div className="order-header-block sm:items-end">
                      <span className="order-header-label">Delivery Status</span>
                      <span className={`order-status-badge ${badgeKey}`}>
                        <StatusIcon size={14} />
                        {status}
                      </span>
                    </div>
                  </div>

                  {/* Card Body - Products In Order */}
                  <div className="order-card-body">
                    {items.map((item, idx) => (
                      <div key={item._id || item.productId || idx} className="order-item-row">
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
                              <span>Qty: <strong>{item.quantity}</strong></span>
                              <span>•</span>
                              <span>{formatCurrency(item.price)} each</span>
                              {item.metadata?.offerType && (
                                <span className="order-item-badge">
                                  {item.metadata.offerType === "BOGO"
                                    ? "BOGO Special"
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
                          <div className="order-item-price-unit">
                            {item.quantity > 1 ? `${item.quantity} × ${formatCurrency(item.price)}` : "Standard Price"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="order-card-footer">
                    <div className="order-card-tracking-summary">
                      {status === "Delivered" ? (
                        <>
                          <CheckCircle2 size={16} className="text-emerald-600" />
                          <span className="font-semibold text-emerald-700">
                            Delivered successfully to {order.customerName}
                          </span>
                        </>
                      ) : status === "Cancelled" ? (
                        <>
                          <XCircle size={16} className="text-red-600" />
                          <span className="font-semibold text-red-700">
                            Order was cancelled
                          </span>
                        </>
                      ) : (
                        <>
                          <Truck size={16} className="text-blue-600" />
                          <span>
                            Current Status: <strong className="text-slate-800">{status}</strong> • Delivery in progress
                          </span>
                        </>
                      )}
                    </div>

                    <div className="order-card-actions">
                      {firstItem.productId && (
                        <Link
                          to={`/mobiles/${firstItem.productId}`}
                          className="btn-order-secondary"
                        >
                          Buy Again
                        </Link>
                      )}

                      <Link
                        to={`/profile/orders/${order._id}`}
                        className="btn-order-primary"
                      >
                        View Order Details
                        <ChevronRight size={15} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
