import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCcw,
  Tag,
  X,
  PackageSearch,
  ArrowRight
} from "lucide-react";
import { adminFetch } from "../../utils/adminFetch";
import { formatCurrency } from "../../utils/formatCurrency";
import "./PromotionsPage.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const PAGE_SIZE = 20;

const OFFER_TABS = [
  { id: "PROMOTED", label: "All Promotions" },
  { id: "MEGA_FLASH_SALE", label: "Mega Flash Sale" },
  { id: "BUY_1_GET_1", label: "Buy 1 Get 1" },
  { id: "DAILY_SPECIAL", label: "Daily Special" },
  { id: "NONE", label: "No Offer" },
];

export default function PromotionsPage() {
  const navigate = useNavigate();

  // Data state
  const [products, setProducts] = useState([]);
  const [summaryCounts, setSummaryCounts] = useState({
    ALL: 0,
    MEGA_FLASH_SALE: 0,
    BUY_1_GET_1: 0,
    DAILY_SPECIAL: 0,
    NONE: 0,
  });
  const [pagination, setPagination] = useState({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [stock, setStock] = useState("");
  const [offerTypeTab, setOfferTypeTab] = useState("PROMOTED");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  // Selection state
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Modal & Notification state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [offerToAssign, setOfferToAssign] = useState("MEGA_FLASH_SALE");
  const [targetProducts, setTargetProducts] = useState([]); // Array of product objects being operated on
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on search change
      setSelectedIds(new Set());
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Handle generic filter change -> reset to page 1
  const handleFilterChange = (setter, value) => {
    setter(value);
    setPage(1);
    setSelectedIds(new Set());
  };

  const handleTabChange = (tabId) => {
    setOfferTypeTab(tabId);
    setPage(1);
    setSelectedIds(new Set());
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
    setSelectedIds(new Set());
  };

  // Clear feedback message automatically
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => {
      setFeedback(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [feedback]);

  // Fetch summary counts
  const fetchSummary = useCallback(async () => {
    try {
      const res = await adminFetch(`${API}/api/products/offers/summary`);
      if (res.ok) {
        const data = await res.json();
        setSummaryCounts(data);
      }
    } catch (err) {
      console.error("Failed to load offer summary", err);
    }
  }, []);

  // Fetch products with pagination and filters
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: String(pageSize),
      });

      if (debouncedSearch.trim()) query.append("search", debouncedSearch.trim());
      if (brand) query.append("brand", brand);
      if (category) query.append("category", category);
      if (status) query.append("status", status);
      if (stock) query.append("stock", stock);
      if (offerTypeTab) query.append("offerType", offerTypeTab);

      const res = await adminFetch(`${API}/api/products?${query.toString()}`);

      if (!res.ok) {
        if (res.status === 401) {
          navigate("/admin/login", { replace: true });
          return;
        }
        throw new Error("Unable to load promotions");
      }

      const data = await res.json();
      setProducts(data.products || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      setError(err.message || "Unable to load promotions");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, brand, category, status, stock, offerTypeTab, navigate]);

  useEffect(() => {
    fetchSummary();
    fetchProducts();
  }, [fetchProducts, fetchSummary]);

  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setBrand("");
    setCategory("");
    setStatus("");
    setStock("");
    setPage(1);
    setSelectedIds(new Set());
  };

  // Selection Handlers
  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      const allVisibleIds = products.map((p) => p._id);
      setSelectedIds(new Set(allVisibleIds));
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleSelectRow = (id) => {
    const nextSet = new Set(selectedIds);
    if (nextSet.has(id)) {
      nextSet.delete(id);
    } else {
      nextSet.add(id);
    }
    setSelectedIds(nextSet);
  };

  // Bulk Actions
  const openBulkAssign = () => {
    const selectedProducts = products.filter(p => selectedIds.has(p._id));
    setTargetProducts(selectedProducts);
    setOfferToAssign("MEGA_FLASH_SALE");
    setIsAssignModalOpen(true);
  };

  const openBulkRemove = () => {
    const selectedProducts = products.filter(p => selectedIds.has(p._id));
    setTargetProducts(selectedProducts);
    setIsRemoveModalOpen(true);
  };

  const openSingleAssign = (product) => {
    setTargetProducts([product]);
    setOfferToAssign(product.offerType !== "NONE" ? product.offerType : "MEGA_FLASH_SALE");
    setIsAssignModalOpen(true);
  };

  // Submit Mutations
  const submitOfferUpdate = async (type) => {
    setIsSubmitting(true);
    try {
      const pIds = targetProducts.map(p => p._id);
      const res = await adminFetch(`${API}/api/products/bulk-offer`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productIds: pIds,
          offerType: type
        })
      });

      if (!res.ok) {
        throw new Error("Unable to update promotion. Please try again.");
      }

      setFeedback({
        type: "success",
        message: "Promotion updated successfully.",
      });

      setIsAssignModalOpen(false);
      setIsRemoveModalOpen(false);
      setSelectedIds(new Set());
      fetchProducts();
      fetchSummary();
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Computed state
  const hasReplacementWarning = isAssignModalOpen && targetProducts.some(p => p.offerType !== "NONE" && p.offerType !== offerToAssign);
  
  // Format helpers
  const getStockUI = (qty) => {
    const stockCount = typeof qty === "number" ? qty : 0;
    if (stockCount === 0) return { class: "stock-out", label: "0 (Out of Stock)" };
    if (stockCount <= 5) return { class: "stock-low", label: `${stockCount} (Low Stock)` };
    return { class: "stock-in", label: `${stockCount} in stock` };
  };

  const getOfferLabel = (offer) => {
    switch (offer) {
      case "MEGA_FLASH_SALE": return "Mega Flash Sale";
      case "BUY_1_GET_1": return "Buy 1 Get 1";
      case "DAILY_SPECIAL": return "Daily Special";
      case "NONE": default: return "No Offer";
    }
  };

  const isFilterActive = Boolean(search.trim() || brand || category || status || stock);

  return (
    <div className="admin-promotions-page">
      {/* Toast Feedback */}
      {feedback && (
        <div className={`admin-alert-banner ${feedback.type}`}>
          <div className="admin-alert-content">
            {feedback.type === "success" ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            <span>{feedback.message}</span>
          </div>
          <button className="admin-alert-close" onClick={() => setFeedback(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="promotions-header">
        <div>
          <div className="breadcrumb">ADMIN / PROMOTIONS</div>
          <h1>Promotion Management</h1>
          <div className="subtitle">Manage promotional offers across your product catalog.</div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/admin/products/new")}>
          <Tag size={16} style={{ marginRight: "4px" }} /> Assign Promotion
        </button>
      </div>

      {/* Summary Cards */}
      <div className="promotions-summary-grid">
        <div className="summary-card">
          <div className="summary-title">All Promoted Products</div>
          <div className="summary-value">{summaryCounts.ALL}</div>
        </div>
        <div className="summary-card">
          <div className="summary-title">Mega Flash Sale</div>
          <div className="summary-value">{summaryCounts.MEGA_FLASH_SALE}</div>
        </div>
        <div className="summary-card">
          <div className="summary-title">Buy 1 Get 1</div>
          <div className="summary-value">{summaryCounts.BUY_1_GET_1}</div>
        </div>
        <div className="summary-card">
          <div className="summary-title">Daily Special</div>
          <div className="summary-value">{summaryCounts.DAILY_SPECIAL}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="promotions-tabs">
        {OFFER_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`promotion-tab ${offerTypeTab === tab.id ? "active" : ""}`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters (Reusing logic/styles from AdminProductsList) */}
      <div className="admin-products-toolbar card">
        <div className="toolbar-search">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search products by name or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="toolbar-filters">
          <select value={brand} onChange={(e) => handleFilterChange(setBrand, e.target.value)}>
            <option value="">All Brands</option>
            <option value="Samsung">Samsung</option>
            <option value="Apple">Apple</option>
            <option value="OnePlus">OnePlus</option>
            <option value="Xiaomi">Xiaomi</option>
            <option value="Realme">Realme</option>
          </select>

          <select value={category} onChange={(e) => handleFilterChange(setCategory, e.target.value)}>
            <option value="">All Categories</option>
            <option value="mobile">Mobiles</option>
            <option value="accessory">Accessories</option>
          </select>

          <select value={status} onChange={(e) => handleFilterChange(setStatus, e.target.value)}>
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="DRAFT">Draft</option>
          </select>

          <select value={stock} onChange={(e) => handleFilterChange(setStock, e.target.value)}>
            <option value="">All Stock</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>

          {isFilterActive && (
            <button className="btn btn-secondary btn-clear" onClick={resetFilters}>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Bulk Action Toolbar */}
      {selectedIds.size > 0 && (
        <div className="bulk-action-bar">
          <span>{selectedIds.size} products selected</span>
          <div className="bulk-actions">
            <button className="btn btn-secondary" onClick={openBulkRemove}>Remove Promotion</button>
            <button className="btn btn-primary" onClick={openBulkAssign}>Assign Promotion</button>
          </div>
        </div>
      )}

      {/* Table Area */}
      <div className="promotions-table-container">
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
            <RefreshCcw className="rotating" style={{ marginBottom: "16px" }} />
            <p>Loading promotions...</p>
          </div>
        ) : error ? (
          <div className="admin-empty-state">
            <AlertTriangle size={48} />
            <h3>Unable to load promotions</h3>
            <p>{error}</p>
            <button className="btn btn-primary mt-4" onClick={fetchProducts}>
              Retry
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="admin-empty-state">
            <PackageSearch size={48} />
            {isFilterActive ? (
              <>
                <h3>No matching products</h3>
                <p>Try changing your search or filters.</p>
                <button className="btn btn-secondary mt-4" onClick={resetFilters}>
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <h3>No products in this promotion</h3>
                <p>Assign products to this promotion to start building your offer.</p>
              </>
            )}
          </div>
        ) : (
          <table className="promotions-table">
            <thead>
              <tr>
                <th className="checkbox-cell">
                  <input
                    type="checkbox"
                    checked={products.length > 0 && selectedIds.size === products.length}
                    onChange={toggleSelectAll}
                    aria-label="Select all products"
                  />
                </th>
                <th>Product</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Promotion</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const stockUI = getStockUI(product.stock);
                return (
                  <tr key={product._id}>
                    <td className="checkbox-cell">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(product._id)}
                        onChange={() => toggleSelectRow(product._id)}
                        aria-label={`Select ${product.name}`}
                      />
                    </td>
                    <td>
                      <div className="admin-product-cell">
                        <img
                          src={product.image || "/api/placeholder/40/40"}
                          alt={product.name}
                          className="admin-product-thumb"
                        />
                        <div className="admin-product-info">
                          <span className="admin-product-name">{product.name}</span>
                        </div>
                      </div>
                    </td>
                    <td>{product.brand}</td>
                    <td style={{ textTransform: "capitalize" }}>{product.category}</td>
                    <td>{formatCurrency(product.finalPrice || product.price)}</td>
                    <td>
                      <span className={`admin-stock-badge ${stockUI.class}`}>
                        {stockUI.label}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-status-badge status-${product.status?.toLowerCase()}`}>
                        {product.status}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        display: "inline-block",
                        padding: "4px 8px",
                        backgroundColor: product.offerType === "NONE" ? "#f1f5f9" : "#e0e7ff",
                        color: product.offerType === "NONE" ? "#64748b" : "#4338ca",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "500"
                      }}>
                        {getOfferLabel(product.offerType)}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="flex-row" style={{ justifyContent: "flex-end" }}>
                        <button
                          className="btn-secondary"
                          style={{ padding: "4px 8px", fontSize: "12px" }}
                          onClick={() => openSingleAssign(product)}
                        >
                          Change Offer
                        </button>
                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          className="btn-secondary"
                          style={{ padding: "4px 8px", fontSize: "12px", display: "flex", alignItems: "center" }}
                        >
                          View <ArrowRight size={12} style={{ marginLeft: "4px" }} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination (Reusing styling pattern) */}
      {!loading && !error && products.length > 0 && (
        <div className="admin-pagination card">
          <div className="pagination-info">
            Showing {(page - 1) * pageSize + 1}–
            {Math.min(page * pageSize, pagination.total)} of {pagination.total} products
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              style={{ marginLeft: "16px", padding: "4px 8px", borderRadius: "4px", border: "1px solid #e2e8f0" }}
            >
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
          </div>
          <div className="pagination-controls">
            <button
              className="btn btn-secondary"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              Previous
            </button>
            <span className="pagination-current">
              Page {page} of {pagination.totalPages}
            </span>
            <button
              className="btn btn-secondary"
              disabled={page === pagination.totalPages || pagination.totalPages === 0}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {isAssignModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: "500px" }}>
            <h2>Assign Promotion</h2>
            <p style={{ color: "#64748b", margin: "8px 0 20px" }}>
              Select the promotional campaign for the {targetProducts.length} selected product(s).
            </p>

            <div className="form-group" style={{ marginBottom: "20px" }}>
              <label>Select Offer</label>
              <select 
                value={offerToAssign}
                onChange={(e) => setOfferToAssign(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
              >
                <option value="MEGA_FLASH_SALE">Mega Flash Sale</option>
                <option value="BUY_1_GET_1">Buy 1 Get 1 Free</option>
                <option value="DAILY_SPECIAL">Daily Special</option>
                <option value="NONE">No Offer (Remove)</option>
              </select>
            </div>

            {hasReplacementWarning && (
              <div style={{ backgroundColor: "#fffbeb", border: "1px solid #fef3c7", padding: "12px", borderRadius: "6px", color: "#b45309", fontSize: "14px", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>Some selected products already have another promotion. Assigning this promotion will replace their current promotion.</span>
              </div>
            )}

            <div className="modal-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => setIsAssignModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => submitOfferUpdate(offerToAssign)}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Assign Promotion"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isRemoveModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: "450px" }}>
            <h2>Remove Promotion</h2>
            <p style={{ margin: "12px 0 24px", color: "#475569" }}>
              Remove the promotion from the {targetProducts.length} selected product(s)? They will no longer appear in offer sections.
            </p>
            <div className="modal-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => setIsRemoveModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => submitOfferUpdate("NONE")}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
