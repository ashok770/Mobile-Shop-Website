import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  RefreshCcw,
  AlertCircle,
  CheckCircle2,
  X,
  UserCheck,
  Eye,
  User,
  Copy,
  Check,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import { adminFetch } from "../../utils/adminFetch";
import { formatDate } from "../../utils/formatDate";
import CustomerStatusBadge from "./CustomerStatusBadge";
import "./CustomersPage.css";

const PAGE_SIZE = 20;

export default function CustomersPage() {
  const navigate = useNavigate();

  // Data state
  const [customers, setCustomers] = useState([]);
  const [pageSize, setPageSize] = useState(20);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [accountStatus, setAccountStatus] = useState("ALL");
  const [page, setPage] = useState(1);

  // Notification state
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

  // Fetch customer list using GET /api/admin/customers
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: String(pageSize),
      });

      if (debouncedSearch.trim()) query.append("search", debouncedSearch.trim());
      if (accountStatus && accountStatus !== "ALL") query.append("accountStatus", accountStatus);

      const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await adminFetch(`${API}/api/admin/customers?${query.toString()}`);

      if (!res.ok) {
        if (res.status === 401) {
          navigate("/admin/login", { replace: true });
          return;
        }
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to load customer accounts");
      }

      const data = await res.json();
      setCustomers(data.customers || []);
      setPagination({
        page: data.page || page,
        limit: data.limit || pageSize,
        total: data.total || 0,
        totalPages: data.totalPages || 1,
      });
    } catch (err) {
      setError(err.message || "Unable to load customer accounts");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, accountStatus, navigate]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setAccountStatus("ALL");
    setPage(1);
  };

  // Copy Customer ID helper
  const handleCopyId = (id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isFilterActive = search.trim() || accountStatus !== "ALL";

  return (
    <div className="admin-customers-page">
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
      <div className="admin-customers-header">
        <div className="header-text-group">
          <span className="header-breadcrumbs">ADMIN / CUSTOMER MANAGEMENT</span>
          <h1 className="header-title">Customer Management</h1>
          <p className="header-subtitle">
            Manage customer accounts, inspect registration details, and monitor account status.
          </p>
        </div>

        <button
          type="button"
          className="btn-refresh"
          onClick={fetchCustomers}
          disabled={loading}
          title="Refresh Customer List"
        >
          <RefreshCcw size={16} className={loading ? "spin-icon" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Bar Section */}
      <div className="customers-filter-container">
        <div className="filter-top-row">
          {/* Search Input */}
          <div className="customers-search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by customer name, email, or Customer ID..."
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
          {[
            { id: "ALL", label: "All Statuses" },
            { id: "ACTIVE", label: "Active" },
            { id: "DISABLED", label: "Disabled" },
            { id: "SUSPENDED", label: "Suspended" },
          ].map((st) => (
            <button
              key={st.id}
              type="button"
              className={`status-tab-btn ${accountStatus === st.id ? "active" : ""}`}
              onClick={() => {
                setAccountStatus(st.id);
                setPage(1);
              }}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table Section */}
      <div className="customers-table-wrapper">
        {error ? (
          <div className="customers-error-state">
            <AlertCircle size={36} />
            <p>{error}</p>
            <button type="button" className="btn-retry" onClick={fetchCustomers}>
              Retry Loading
            </button>
          </div>
        ) : loading ? (
          <div className="customers-skeleton-wrapper">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-row" />
            ))}
          </div>
        ) : customers.length === 0 ? (
          <div className="customers-empty-state">
            <UserCheck size={48} className="empty-icon" />
            <h3>No customers found</h3>
            <p>No customer accounts match your current search or filter criteria.</p>
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
          <table className="customers-main-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Addresses</th>
                <th>Orders</th>
                <th>Account Status</th>
                <th>Joined Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((cust) => {
                const initial = (cust.name || "C").charAt(0).toUpperCase();

                return (
                  <tr key={cust._id} className="customer-table-row">
                    {/* Customer Info (Avatar/Initial, Name, ID) */}
                    <td className="customer-cell">
                      <div className="customer-flex">
                        <div className="avatar-circle">
                          {cust.avatar ? (
                            <img src={cust.avatar} alt={cust.name} />
                          ) : (
                            <span className="initial-text">{initial}</span>
                          )}
                        </div>
                        <div className="customer-text-group">
                          <span className="customer-name">{cust.name || "N/A"}</span>
                          <div className="id-flex">
                            <span className="mono-id">#{cust._id.slice(-6)}</span>
                            <button
                              type="button"
                              className="copy-btn"
                              onClick={(e) => handleCopyId(cust._id, e)}
                              title="Copy Full Customer ID"
                            >
                              {copiedId === cust._id ? (
                                <Check size={13} className="text-success" />
                              ) : (
                                <Copy size={13} />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="email-cell">
                      <span className="email-text">{cust.email || "N/A"}</span>
                    </td>

                    {/* Addresses Count */}
                    <td className="addresses-cell">
                      <span className="count-badge">
                        <MapPin size={13} /> {cust.addressesCount || 0} {cust.addressesCount === 1 ? "address" : "addresses"}
                      </span>
                    </td>

                    {/* Orders Count */}
                    <td className="orders-cell">
                      <span className="count-badge order-badge-count">
                        <ShoppingBag size={13} /> {cust.ordersCount || 0} {cust.ordersCount === 1 ? "order" : "orders"}
                      </span>
                    </td>

                    {/* Account Status Badge */}
                    <td className="status-cell">
                      <CustomerStatusBadge status={cust.accountStatus || "ACTIVE"} />
                    </td>

                    {/* Joined Date */}
                    <td className="date-cell">
                      {formatDate(cust.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="actions-cell text-right">
                      <button
                        type="button"
                        className="btn-action-view"
                        onClick={() => navigate(`/admin/customers/${cust._id}`)}
                        title="View Full Customer Profile"
                      >
                        <Eye size={16} /> <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      {!loading && !error && customers.length > 0 && (
        <div className="customers-pagination-footer">
          <div className="page-size-selector">
            <label htmlFor="page-size-select">Per page:</label>
            <select
              id="page-size-select"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="page-size-select"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <span className="pagination-info">
            Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.total} total customers)
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
    </div>
  );
}
