import React, { useState, useEffect, useCallback } from "react";
import {
  Search, Plus, Edit2, Trash2, AlertTriangle, CheckCircle2, X,
  Wrench, Smartphone, ShieldCheck, Wifi, Headphones, Package,
  Monitor, Battery, Cpu, HardDrive, Settings, Zap, RefreshCcw,
  BatteryCharging, Cable, Bluetooth, Signal, Shield, LifeBuoy,
  PhoneCall, Mail, MapPin, Clock, Star, Heart, Layers, Grid3X3,
  Plug, Aperture, CircuitBoard, Hammer, ScanLine, Flashlight,
  Image as ImageIcon
} from "lucide-react";
import { adminFetch } from "../../utils/adminFetch";
import ServiceModal from "./ServiceModal";
import "./ServicesPage.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const PAGE_SIZE = 20;

// ── Human-readable category labels ──────────────────────────────────
export const CATEGORY_LABELS = {
  DEVICE_SALES:     "Device Sales & Upgrades",
  REPAIRS:          "Repairs & Maintenance",
  ACCESSORIES:      "Accessories & Add-Ons",
  NETWORK_DATA:     "Network & Data Services",
  WARRANTY_SUPPORT: "Warranty & Support",
};

export const getCategoryLabel = (raw) => CATEGORY_LABELS[raw] || raw;

// ── Safe Lucide icon map ────────────────────────────────────────────
const ICON_MAP = {
  Wrench, Smartphone, ShieldCheck, Wifi, Headphones, Package,
  Monitor, Battery, Cpu, HardDrive, Settings, Zap, RefreshCcw,
  BatteryCharging, Cable, Bluetooth, Signal, Shield, LifeBuoy,
  PhoneCall, Mail, MapPin, Clock, Star, Heart, Layers, Grid3X3,
  Plug, Aperture, CircuitBoard, Hammer, ScanLine, Flashlight,
};

const ServiceIcon = ({ name, size = 18 }) => {
  const IconComponent = ICON_MAP[name];
  if (IconComponent) return <IconComponent size={size} />;
  return <Package size={size} />;
};

// ── Category filter options ─────────────────────────────────────────
const CATEGORY_FILTER_OPTIONS = [
  { value: "",                label: "All Categories" },
  { value: "DEVICE_SALES",   label: CATEGORY_LABELS.DEVICE_SALES },
  { value: "REPAIRS",        label: CATEGORY_LABELS.REPAIRS },
  { value: "ACCESSORIES",    label: CATEGORY_LABELS.ACCESSORIES },
  { value: "NETWORK_DATA",   label: CATEGORY_LABELS.NETWORK_DATA },
  { value: "WARRANTY_SUPPORT", label: CATEGORY_LABELS.WARRANTY_SUPPORT },
];

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination & Filtering
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalServices, setTotalServices] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // empty = All
  const [categoryFilter, setCategoryFilter] = useState(""); // empty = All

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingService, setDeletingService] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Notification
  const [feedback, setFeedback] = useState(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Clear feedback after timeout
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 4500);
    return () => clearTimeout(timer);
  }, [feedback]);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
      });
      if (debouncedSearch.trim()) query.append("search", debouncedSearch.trim());
      if (statusFilter) query.append("status", statusFilter);
      if (categoryFilter) query.append("category", categoryFilter);

      const res = await adminFetch(`${API}/api/admin/services?${query.toString()}`);
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Unauthorized to access services");
        }
        const data = await res.json();
        throw new Error(data.message || "Unable to load services");
      }
      const data = await res.json();
      setServices(data.services || []);
      if (data.pagination) {
        setPage(data.pagination.page || 1);
        setTotalPages(data.pagination.totalPages || 1);
        setTotalServices(data.pagination.total || 0);
      }
    } catch (err) {
      setError(err.message || "Unable to load services");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, categoryFilter]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleFilterChange = (setter, value) => {
    setter(value);
    setPage(1);
  };

  // Add / Edit handlers
  const handleAddService = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleModalSuccess = (msg) => {
    setFeedback({ type: "success", message: msg });
    setIsModalOpen(false);
    fetchServices();
  };

  // Delete handlers
  const handleDeleteClick = (service) => {
    setDeletingService(service);
    setDeleteError("");
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    setDeleteError("");
    try {
      const res = await adminFetch(`${API}/api/admin/services/${deletingService._id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete service");
      }
      setFeedback({ type: "success", message: "Service deleted successfully" });
      setIsDeleteModalOpen(false);
      if (services.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        fetchServices();
      }
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const isFilterActive = Boolean(search.trim() || statusFilter || categoryFilter);

  return (
    <div className="admin-services-page">
      {/* Toast Feedback */}
      {feedback && (
        <div className={`admin-alert-banner ${feedback.type}`}>
          <div className="admin-alert-content">
            {feedback.type === "success" ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            <span>{feedback.message}</span>
          </div>
          <button className="admin-alert-close" onClick={() => setFeedback(null)}><X size={16} /></button>
        </div>
      )}

      {/* Header */}
      <div className="services-header">
        <div>
          <div className="breadcrumb">ADMIN / SERVICES</div>
          <h1>Service Catalog Management</h1>
          <div className="subtitle">Create, edit, and organize the service offerings you provide.</div>
        </div>
        <button className="btn-primary" onClick={handleAddService}>
          <Plus size={16} /> Add Service
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="admin-filters-bar" style={{ marginBottom: "24px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <div className="admin-search-wrapper" style={{ flex: 1, minWidth: "200px", position: "relative", display: "flex", alignItems: "center" }}>
          <Search size={18} className="admin-search-icon" style={{ position: "absolute", left: "12px", color: "#94a3b8" }} />
          <input
            type="text"
            className="admin-search-input"
            style={{ width: "100%", padding: "10px 10px 10px 36px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
            placeholder="Search services by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select className="admin-filter-select" value={statusFilter} onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", minWidth: "150px" }}>
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="DISABLED">Disabled</option>
        </select>

        <select className="admin-filter-select" value={categoryFilter} onChange={(e) => handleFilterChange(setCategoryFilter, e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", minWidth: "200px" }}>
          {CATEGORY_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {isFilterActive && (
          <button className="admin-reset-btn" onClick={() => {
            setSearch("");
            setDebouncedSearch("");
            setStatusFilter("");
            setCategoryFilter("");
            setPage(1);
          }}>Clear Filters</button>
        )}
      </div>

      {/* Table Area */}
      <div className="services-table-container">
        {loading ? (
          <div className="admin-empty-state">
            <Search className="rotating" size={32} style={{ marginBottom: "16px" }} />
            <p>Loading services...</p>
          </div>
        ) : error ? (
          <div className="admin-empty-state">
            <AlertTriangle size={48} color="#ef4444" />
            <h3>Unable to load services</h3>
            <p>{error}</p>
            <button className="btn-primary" style={{ marginTop: "16px" }} onClick={fetchServices}>Retry</button>
          </div>
        ) : services.length === 0 ? (
          <div className="admin-empty-state">
            <ImageIcon size={48} color="#94a3b8" />
            <h3>No services found</h3>
            <p>Try adjusting your search or add a new service.</p>
          </div>
        ) : (
          <table className="services-table">
            <thead>
              <tr>
                <th className="col-icon">Icon</th>
                <th className="col-service">Service</th>
                <th className="col-category">Category</th>
                <th className="col-order">Order</th>
                <th className="col-status">Status</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((svc) => (
                <tr key={svc._id}>
                  {/* Icon */}
                  <td>
                    <div className="svc-icon-cell">
                      <ServiceIcon name={svc.icon} size={18} />
                    </div>
                  </td>
                  {/* Service Name + Short Description */}
                  <td>
                    <div className="svc-name-cell">
                      <span className="svc-name">{svc.name}</span>
                      {svc.shortDescription && (
                        <span className="svc-short-desc">{svc.shortDescription}</span>
                      )}
                    </div>
                  </td>
                  {/* Category */}
                  <td>
                    <span className="svc-category-label">{getCategoryLabel(svc.category)}</span>
                  </td>
                  {/* Display Order */}
                  <td>{svc.displayOrder}</td>
                  {/* Status */}
                  <td>
                    <span className={`admin-status-badge status-${svc.status.toLowerCase()}`}>
                      {svc.status === "ACTIVE" ? "Active" : "Disabled"}
                    </span>
                  </td>
                  {/* Actions */}
                  <td style={{ textAlign: "right" }}>
                    <div className="flex-row" style={{ justifyContent: "flex-end" }}>
                      <button className="btn-secondary" style={{ padding: "6px", display: "flex" }} onClick={() => handleEditService(svc)} title="Edit Service"><Edit2 size={16} /></button>
                      <button className="btn-danger" style={{ padding: "6px", display: "flex", background: "white", color: "#ef4444", borderColor: "#e2e8f0", marginLeft: "4px" }} onClick={() => handleDeleteClick(svc)} title="Delete Service"><Trash2 size={16} /></button>
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
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalServices)} of {totalServices} services
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button className="btn-secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button>
            <span style={{ fontSize: "14px", fontWeight: "500" }}>Page {page} of {totalPages}</span>
            <button className="btn-secondary" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        </div>
      )}

      {/* Service Modal */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        initialData={editingService}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && deletingService && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: "450px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444" }}>
                <AlertTriangle size={24} />
              </div>
              <h2 style={{ margin: 0 }}>Delete Service</h2>
            </div>
            {deleteError && (
              <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", padding: "12px", borderRadius: "6px", color: "#991b1b", fontSize: "14px", marginBottom: "16px" }}>{deleteError}</div>
            )}
            <p style={{ margin: "0 0 24px", color: "#475569", lineHeight: "1.5" }}>
              Are you sure you want to delete <strong>{deletingService.name}</strong>? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>Cancel</button>
              <button className="btn-danger" onClick={confirmDelete} disabled={isDeleting} style={{ opacity: isDeleting ? 0.5 : 1, cursor: isDeleting ? "not-allowed" : "pointer" }}>
                {isDeleting ? "Deleting..." : "Delete Service"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
