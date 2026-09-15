import React, { useState, useEffect, useCallback } from "react";
import { Search, Plus, Edit2, Trash2, AlertTriangle, CheckCircle2, X, Image as ImageIcon } from "lucide-react";
import { adminFetch } from "../../utils/adminFetch";
import BrandModal from "./BrandModal";
import "./BrandsPage.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const PAGE_SIZE = 20;

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination & Filtering
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBrands, setTotalBrands] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // empty means All
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingBrand, setDeletingBrand] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Notification
  const [feedback, setFeedback] = useState(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Clear feedback after 4.5s
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => {
      setFeedback(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [feedback]);

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
      });

      if (debouncedSearch.trim()) query.append("search", debouncedSearch.trim());
      if (statusFilter) query.append("status", statusFilter);

      const res = await adminFetch(`${API}/api/admin/brands?${query.toString()}`);
      
      if (!res.ok) {
        if (res.status === 401) {
          // Handled by adminFetch natively or App router if not authenticated
          throw new Error("Unauthorized to access brands");
        }
        throw new Error("Unable to load brands");
      }

      const data = await res.json();
      setBrands(data.brands || []);
      
      if (data.pagination) {
        setPage(data.pagination.page || 1);
        setTotalPages(data.pagination.totalPages || 1);
        setTotalBrands(data.pagination.total || 0);
      }
    } catch (err) {
      setError(err.message || "Unable to load brands");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleFilterChange = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  // Create & Edit Handlers
  const handleAddBrand = () => {
    setEditingBrand(null);
    setIsModalOpen(true);
  };

  const handleEditBrand = (brand) => {
    setEditingBrand(brand);
    setIsModalOpen(true);
  };

  const handleModalSuccess = (message) => {
    setFeedback({ type: "success", message });
    setIsModalOpen(false);
    fetchBrands();
  };

  // Delete Handlers
  const handleDeleteClick = (brand) => {
    setDeletingBrand(brand);
    setDeleteError("");
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    setDeleteError("");
    try {
      const res = await adminFetch(`${API}/api/admin/brands/${deletingBrand._id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete brand");
      }

      setFeedback({ type: "success", message: "Brand deleted successfully" });
      setIsDeleteModalOpen(false);
      
      // If we deleted the last item on the page, go back a page
      if (brands.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        fetchBrands();
      }
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="admin-brands-page">
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
      <div className="brands-header">
        <div>
          <div className="breadcrumb">ADMIN / BRANDS</div>
          <h1>Brand Management</h1>
          <div className="subtitle">Manage the canonical list of brands used across your catalog.</div>
        </div>
        <button className="btn-primary" onClick={handleAddBrand}>
          <Plus size={16} /> Add Brand
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="admin-filters-bar" style={{ marginBottom: "24px", display: "flex", gap: "16px" }}>
        <div className="admin-search-wrapper" style={{ flex: 1, position: "relative", display: "flex", alignItems: "center" }}>
          <Search size={18} className="admin-search-icon" style={{ position: "absolute", left: "12px", color: "#94a3b8" }} />
          <input
            type="text"
            className="admin-search-input"
            style={{ width: "100%", padding: "10px 10px 10px 36px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
            placeholder="Search brands by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select 
          className="admin-filter-select" 
          value={statusFilter} 
          onChange={(e) => handleFilterChange(e.target.value)}
          style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", minWidth: "150px" }}
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="DISABLED">Disabled</option>
        </select>
      </div>

      {/* Table Area */}
      <div className="brands-table-container">
        {loading ? (
          <div className="admin-empty-state">
            <Search className="rotating" size={32} style={{ marginBottom: "16px" }} />
            <p>Loading brands...</p>
          </div>
        ) : error ? (
          <div className="admin-empty-state">
            <AlertTriangle size={48} color="#ef4444" />
            <h3>Unable to load brands</h3>
            <p>{error}</p>
            <button className="btn-primary" style={{ marginTop: "16px" }} onClick={fetchBrands}>
              Retry
            </button>
          </div>
        ) : brands.length === 0 ? (
          <div className="admin-empty-state">
            <ImageIcon size={48} color="#94a3b8" />
            <h3>No brands found</h3>
            <p>Try adjusting your search filters or add a new brand.</p>
          </div>
        ) : (
          <table className="brands-table">
            <thead>
              <tr>
                <th>Logo</th>
                <th>Brand Name</th>
                <th>Products</th>
                <th>Display Order</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand._id}>
                  <td>
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="admin-brand-thumb"
                      />
                    ) : (
                      <div className="admin-brand-thumb" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <ImageIcon size={20} color="#cbd5e1" />
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="admin-brand-name">{brand.name}</div>
                    <div className="admin-brand-slug">/{brand.slug}</div>
                  </td>
                  <td>{brand.productCount || 0}</td>
                  <td>{brand.displayOrder}</td>
                  <td>
                    <span 
                      style={{
                        display: "inline-block",
                        padding: "4px 8px",
                        backgroundColor: brand.status === "ACTIVE" ? "#dcfce7" : "#f1f5f9",
                        color: brand.status === "ACTIVE" ? "#166534" : "#475569",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "500"
                      }}
                    >
                      {brand.status}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div className="flex-row" style={{ justifyContent: "flex-end" }}>
                      <button
                        className="btn-secondary"
                        style={{ padding: "6px", display: "flex" }}
                        onClick={() => handleEditBrand(brand)}
                        title="Edit Brand"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn-danger"
                        style={{ padding: "6px", display: "flex", background: "white", color: "#ef4444", borderColor: "#e2e8f0" }}
                        onClick={() => handleDeleteClick(brand)}
                        title="Delete Brand"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", background: "white", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "14px", color: "#64748b" }}>
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalBrands)} of {totalBrands} brands
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              className="btn-secondary"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              Previous
            </button>
            <span style={{ fontSize: "14px", fontWeight: "500" }}>
              Page {page} of {totalPages}
            </span>
            <button
              className="btn-secondary"
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Brand Modal */}
      <BrandModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        initialData={editingBrand}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && deletingBrand && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: "450px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444" }}>
                <AlertTriangle size={24} />
              </div>
              <h2 style={{ margin: 0 }}>Delete Brand</h2>
            </div>
            
            {deleteError && (
              <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", padding: "12px", borderRadius: "6px", color: "#991b1b", fontSize: "14px", marginBottom: "16px" }}>
                {deleteError}
              </div>
            )}
            
            <p style={{ margin: "0 0 24px", color: "#475569", lineHeight: "1.5" }}>
              Are you sure you want to delete <strong>{deletingBrand.name}</strong>? 
              {deletingBrand.productCount > 0 ? (
                <span>
                  <br /><br />
                  <strong style={{ color: "#b45309" }}>Warning: This brand cannot be deleted while products are associated with it. You can disable it instead.</strong>
                </span>
              ) : (
                <span> This action cannot be undone.</span>
              )}
            </p>
            
            <div className="modal-actions">
              <button 
                className="btn-secondary" 
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                className="btn-danger"
                onClick={confirmDelete}
                disabled={isDeleting || deletingBrand.productCount > 0}
                style={{ opacity: deletingBrand.productCount > 0 ? 0.5 : 1, cursor: deletingBrand.productCount > 0 ? "not-allowed" : "pointer" }}
              >
                {isDeleting ? "Deleting..." : "Delete Brand"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
