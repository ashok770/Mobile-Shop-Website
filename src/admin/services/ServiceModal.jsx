import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { adminFetch } from "../../utils/adminFetch";
import "./ServiceModal.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CATEGORY_OPTIONS = [
  { value: "DEVICE_SALES", label: "Device Sales" },
  { value: "REPAIRS", label: "Repairs" },
  { value: "ACCESSORIES", label: "Accessories" },
  { value: "NETWORK_DATA", label: "Network Data" },
  { value: "WARRANTY_SUPPORT", label: "Warranty Support" },
];

const INITIAL_FORM = {
  name: "",
  slug: "",
  category: "DEVICE_SALES",
  shortDescription: "",
  description: "",
  icon: "",
  image: "",
  displayOrder: 0,
  status: "ACTIVE",
  ctaLabel: "",
  ctaTarget: "",
};

export default function ServiceModal({ isOpen, onClose, onSuccess, initialData = null }) {
  const [formData, setFormData] = useState({ ...INITIAL_FORM });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill form when editing or reset when creating
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        slug: initialData.slug || "",
        category: initialData.category || "DEVICE_SALES",
        shortDescription: initialData.shortDescription || "",
        description: initialData.description || "",
        icon: initialData.icon || "",
        image: initialData.image || "",
        displayOrder: initialData.displayOrder ?? 0,
        status: initialData.status || "ACTIVE",
        ctaLabel: initialData.ctaLabel || "",
        ctaTarget: initialData.ctaTarget || "",
      });
    } else {
      setFormData({ ...INITIAL_FORM });
    }
    setError("");
  }, [initialData, isOpen]);

  // Auto-generate slug from name when creating
  useEffect(() => {
    if (!initialData && formData.name) {
      const generatedSlug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.name, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "displayOrder" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!formData.name.trim()) {
      setError("Service Name is required");
      return;
    }
    if (!formData.shortDescription.trim()) {
      setError("Short Description is required");
      return;
    }
    if (formData.displayOrder < 0) {
      setError("Display Order must be 0 or greater");
      return;
    }

    setIsSubmitting(true);
    try {
      const url = initialData
        ? `${API}/api/admin/services/${initialData._id}`
        : `${API}/api/admin/services`;

      const method = initialData ? "PUT" : "POST";

      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        category: formData.category,
        shortDescription: formData.shortDescription.trim(),
        description: formData.description.trim(),
        icon: formData.icon.trim(),
        image: formData.image.trim(),
        displayOrder: formData.displayOrder,
        status: formData.status,
        ctaLabel: formData.ctaLabel.trim(),
        ctaTarget: formData.ctaTarget.trim(),
      };

      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save service");
      }

      onSuccess(initialData ? "Service updated successfully" : "Service created successfully");
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal" style={{ maxWidth: "600px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ margin: 0 }}>{initialData ? "Edit Service" : "Add New Service"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ marginBottom: "16px", padding: "10px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "6px", color: "#991b1b", fontSize: "14px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="service-modal-form">
          {/* Name */}
          <div className="form-group">
            <label>Service Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Screen Replacement" />
          </div>

          {/* Slug */}
          <div className="form-group">
            <label>Slug</label>
            <input type="text" name="slug" value={formData.slug} onChange={handleChange} placeholder="auto-generated-from-name" />
          </div>

          {/* Category & Status row */}
          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="ACTIVE">Active</option>
                <option value="DISABLED">Disabled</option>
              </select>
            </div>
          </div>

          {/* Short Description */}
          <div className="form-group">
            <label>Short Description *</label>
            <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows={2} placeholder="Brief summary of the service" />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Detailed description (optional)" />
          </div>

          {/* Icon & Display Order row */}
          <div className="form-row">
            <div className="form-group">
              <label>Icon</label>
              <input type="text" name="icon" value={formData.icon} onChange={handleChange} placeholder="e.g. Wrench" />
            </div>
            <div className="form-group">
              <label>Display Order</label>
              <input type="number" name="displayOrder" value={formData.displayOrder} onChange={handleChange} min="0" />
            </div>
          </div>

          {/* Image URL */}
          <div className="form-group">
            <label>Image URL</label>
            <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="https://..." />
          </div>

          {/* CTA Label & CTA Target row */}
          <div className="form-row">
            <div className="form-group">
              <label>CTA Label</label>
              <input type="text" name="ctaLabel" value={formData.ctaLabel} onChange={handleChange} placeholder="e.g. Learn More" />
            </div>
            <div className="form-group">
              <label>CTA Target</label>
              <input type="text" name="ctaTarget" value={formData.ctaTarget} onChange={handleChange} placeholder="e.g. /contact" />
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : initialData ? "Update Service" : "Create Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
