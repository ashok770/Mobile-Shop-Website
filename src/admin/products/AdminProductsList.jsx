import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  PackageSearch,
  AlertCircle,
  RefreshCcw,
  CheckCircle2,
  X,
  AlertTriangle,
} from "lucide-react";
import { adminFetch } from "../../utils/adminFetch";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
import "./AdminProductsList.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const PAGE_SIZE = 20;

export default function AdminProductsList() {
  const navigate = useNavigate();

  // Data state
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [offerType, setOfferType] = useState("");
  const [stock, setStock] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  // Modal & Notification state
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on search change
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Handle generic filter change -> reset to page 1
  const handleFilterChange = (setter, value) => {
    setter(value);
    setPage(1);
  };

  // Clear feedback message automatically
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => {
      setFeedback(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [feedback]);

  // Fetch products with pagination and filters
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
      });

      if (debouncedSearch.trim()) query.append("search", debouncedSearch.trim());
      if (brand) query.append("brand", brand);
      if (category) query.append("category", category);
      if (status) query.append("status", status);
      if (offerType) query.append("offerType", offerType);
      if (stock) query.append("stock", stock);

      const res = await adminFetch(`${API}/api/products?${query.toString()}`);

      if (!res.ok) {
        if (res.status === 401) {
          navigate("/admin/login", { replace: true });
          return;
        }
        throw new Error("Failed to load products");
      }

      const data = await res.json();
      setProducts(data.products || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      setError(err.message || "Unable to load products");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, brand, category, status, offerType, stock, navigate]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset all filters and sorting to defaults
  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setBrand("");
    setCategory("");
    setStatus("");
    setOfferType("");
    setStock("");
    setSortBy("newest");
    setPage(1);
  };

  // Perform delete product
  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      const res = await adminFetch(`${API}/api/products/${productToDelete._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setFeedback({
          type: "success",
          message: `Product "${productToDelete.name}" was successfully deleted.`,
        });
        setProductToDelete(null);
        fetchProducts();
      } else {
        const errData = await res.json().catch(() => ({}));
        setFeedback({
          type: "error",
          message: errData.message || "Failed to delete product. Please try again.",
        });
        setProductToDelete(null);
      }
    } catch {
      setFeedback({
        type: "error",
        message: "An error occurred while deleting the product.",
      });
      setProductToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Format stock UI indicator
  const getStockUI = (qty) => {
    const stockCount = typeof qty === "number" ? qty : 0;
    if (stockCount === 0) {
      return { class: "stock-out", label: "0 (Out of Stock)" };
    }
    if (stockCount <= 5) {
      return { class: "stock-low", label: `${stockCount} (Low Stock)` };
    }
    return { class: "stock-in", label: `${stockCount} in stock` };
  };

  // Map offer type to human label
  const getOfferLabel = (offer) => {
    switch (offer) {
      case "MEGA_FLASH_SALE":
        return "Mega Flash Sale";
      case "BUY_1_GET_1":
        return "Buy 1 Get 1";
      case "DAILY_SPECIAL":
        return "Daily Special";
      case "NONE":
      default:
        return "No Offer";
    }
  };

  const isFilterActive = Boolean(
    search.trim() || brand || category || status || offerType || stock
  );

  return (
    <div className="admin-products-page">
      {/* Toast Feedback Notification */}
      {feedback && (
        <div className={`admin-alert-banner ${feedback.type}`}>
          <div className="admin-alert-content">
            {feedback.type === "success" ? (
              <CheckCircle2 size={20} className="admin-alert-icon" />
            ) : (
              <AlertCircle size={20} className="admin-alert-icon" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            className="admin-alert-close"
            onClick={() => setFeedback(null)}
            aria-label="Dismiss message"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="admin-products-header">
        <div className="header-text-group">
          <div className="header-breadcrumbs">Products / All Products</div>
          <h1 className="header-title">All Products</h1>
          <p className="header-subtitle">
            Manage your store catalog, inventory, pricing, offers and visibility.
          </p>
        </div>
        <Link to="/admin/products/new" className="btn-add-product">
          <Plus size={18} />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="admin-filters-bar">
        {/* Search */}
        <div className="admin-search-wrapper">
          <Search className="admin-search-icon" />
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Brand */}
        <select
          className="admin-filter-select"
          value={brand}
          onChange={(e) => handleFilterChange(setBrand, e.target.value)}
          aria-label="Filter by brand"
        >
          <option value="">All Brands</option>
          <option value="Apple">Apple</option>
          <option value="Samsung">Samsung</option>
          <option value="Redmi">Redmi</option>
          <option value="Motorola">Motorola</option>
          <option value="Noise">Noise</option>
          <option value="boAt">boAt</option>
        </select>

        {/* Category */}
        <select
          className="admin-filter-select"
          value={category}
          onChange={(e) => handleFilterChange(setCategory, e.target.value)}
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          <option value="mobile">Mobile</option>
          <option value="accessory">Accessory</option>
        </select>

        {/* Status */}
        <select
          className="admin-filter-select"
          value={status}
          onChange={(e) => handleFilterChange(setStatus, e.target.value)}
          aria-label="Filter by status"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="DRAFT">Draft</option>
        </select>

        {/* Offer */}
        <select
          className="admin-filter-select"
          value={offerType}
          onChange={(e) => handleFilterChange(setOfferType, e.target.value)}
          aria-label="Filter by offer"
        >
          <option value="">All Offers</option>
          <option value="NONE">None</option>
          <option value="MEGA_FLASH_SALE">Mega Flash Sale</option>
          <option value="BUY_1_GET_1">Buy 1 Get 1</option>
          <option value="DAILY_SPECIAL">Daily Special</option>
        </select>

        {/* Stock */}
        <select
          className="admin-filter-select"
          value={stock}
          onChange={(e) => handleFilterChange(setStock, e.target.value)}
          aria-label="Filter by stock"
        >
          <option value="">All Stock</option>
          <option value="in_stock">In Stock</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>

        {/* Sort Control */}
        <select
          className="admin-filter-select sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort products"
        >
          <option value="newest">Newest First</option>
        </select>

        {/* Reset Action */}
        {isFilterActive && (
          <button className="admin-reset-btn" onClick={resetFilters} title="Reset all filters">
            <RefreshCcw size={15} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Main Table Container */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Offer</th>
              <th>Status</th>
              <th>Created</th>
              <th className="th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Skeleton loading state
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="skeleton-row">
                  <td>
                    <div className="product-cell">
                      <div className="skeleton-thumb skeleton"></div>
                      <div className="skeleton-box skeleton" style={{ width: "160px" }}></div>
                    </div>
                  </td>
                  <td><div className="skeleton-box skeleton" style={{ width: "70px" }}></div></td>
                  <td><div className="skeleton-box skeleton" style={{ width: "65px" }}></div></td>
                  <td><div className="skeleton-box skeleton" style={{ width: "80px" }}></div></td>
                  <td><div className="skeleton-box skeleton" style={{ width: "90px" }}></div></td>
                  <td><div className="skeleton-box skeleton" style={{ width: "85px" }}></div></td>
                  <td><div className="skeleton-box skeleton" style={{ width: "65px" }}></div></td>
                  <td><div className="skeleton-box skeleton" style={{ width: "85px" }}></div></td>
                  <td><div className="skeleton-box skeleton" style={{ width: "60px" }}></div></td>
                </tr>
              ))
            ) : error ? (
              // Error State
              <tr>
                <td colSpan="9">
                  <div className="admin-empty-state">
                    <AlertCircle className="admin-empty-icon error-icon" />
                    <h3>Unable to load products</h3>
                    <p>Please try again.</p>
                    <button className="btn-retry" onClick={fetchProducts}>
                      <RefreshCcw size={16} /> Retry
                    </button>
                  </div>
                </td>
              </tr>
            ) : products.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan="9">
                  <div className="admin-empty-state">
                    <PackageSearch className="admin-empty-icon" />
                    {isFilterActive ? (
                      <>
                        <h3>No products found</h3>
                        <p>Try changing your search or filters.</p>
                        <button className="btn-clear-filters" onClick={resetFilters}>
                          Clear Filters
                        </button>
                      </>
                    ) : (
                      <>
                        <h3>Your catalog is empty</h3>
                        <p>Add your first product to get started.</p>
                        <Link to="/admin/products/new" className="btn-add-product">
                          <Plus size={18} /> Add Product
                        </Link>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              // Data Rows
              products.map((p) => {
                const stockData = getStockUI(p.stock);
                const hasDiscount = (p.discountPercent || 0) > 0 && p.originalPrice > (p.finalPrice ?? p.price);
                const displayFinalPrice = p.finalPrice ?? p.price ?? p.originalPrice ?? 0;
                const displayImage = p.image || (p.images && p.images[0]) || "";
                const displayStatus = p.status === "DRAFT" ? "Draft" : "Active";

                return (
                  <tr key={p._id}>
                    <td>
                      <div className="product-cell" title={p.name}>
                        {displayImage ? (
                          <img
                            src={displayImage}
                            alt={p.name}
                            className="product-thumb"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="product-thumb-placeholder">
                            <PackageSearch size={20} />
                          </div>
                        )}
                        <div className="product-info">
                          <span className="product-name" title={p.name}>
                            {p.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td><span className="brand-badge">{p.brand || "—"}</span></td>
                    <td className="category-cell">{p.category || "—"}</td>
                    <td>
                      <div className="price-cell">
                        <span className="price-final">
                          {formatCurrency(displayFinalPrice)}
                        </span>
                        {hasDiscount && (
                          <div className="price-discount-row">
                            <span className="price-old">{formatCurrency(p.originalPrice)}</span>
                            <span className="price-percent">-{p.discountPercent}%</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className={`stock-indicator ${stockData.class}`}>
                        <div className="stock-dot"></div>
                        <span>{stockData.label}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          p.offerType && p.offerType !== "NONE"
                            ? "badge-offer"
                            : "badge-outline"
                        }`}
                      >
                        {getOfferLabel(p.offerType)}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          displayStatus === "Draft" ? "badge-draft" : "badge-active"
                        }`}
                      >
                        {displayStatus}
                      </span>
                    </td>
                    <td className="date-cell">{formatDate(p.createdAt)}</td>
                    <td>
                      <div className="action-cell">
                        <button
                          className="action-btn edit"
                          title="Edit product"
                          aria-label={`Edit ${p.name}`}
                          onClick={() => navigate(`/admin/products/edit/${p._id}`)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="action-btn delete"
                          title="Delete product"
                          aria-label={`Delete ${p.name}`}
                          onClick={() => setProductToDelete(p)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination Bar */}
        {products.length > 0 && !loading && (
          <div className="admin-pagination">
            <div className="pagination-info">
              Showing page <span>{pagination.page}</span> of <span>{pagination.totalPages || 1}</span> ({pagination.total} total products)
            </div>
            <div className="pagination-controls">
              <button
                className="pagination-btn"
                disabled={pagination.page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                Previous
              </button>
              <div className="pagination-page-indicator">
                {pagination.page} / {pagination.totalPages || 1}
              </div>
              <button
                className="pagination-btn"
                disabled={pagination.page >= (pagination.totalPages || 1)}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal Dialog for Delete */}
      {productToDelete && (
        <div className="admin-modal-overlay" role="dialog" aria-modal="true">
          <div className="admin-modal-card">
            <div className="admin-modal-header">
              <div className="admin-modal-icon-wrapper">
                <AlertTriangle size={24} className="admin-modal-icon" />
              </div>
              <div>
                <h3 className="admin-modal-title">Delete Product</h3>
                <p className="admin-modal-subtitle">This action cannot be undone.</p>
              </div>
            </div>
            <div className="admin-modal-body">
              <p>
                Are you sure you want to permanently delete{" "}
                <strong>"{productToDelete.name}"</strong> from your store catalog?
              </p>
            </div>
            <div className="admin-modal-actions">
              <button
                className="modal-btn-cancel"
                disabled={isDeleting}
                onClick={() => setProductToDelete(null)}
              >
                Cancel
              </button>
              <button
                className="modal-btn-delete"
                disabled={isDeleting}
                onClick={confirmDeleteProduct}
              >
                {isDeleting ? "Deleting..." : "Delete Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
