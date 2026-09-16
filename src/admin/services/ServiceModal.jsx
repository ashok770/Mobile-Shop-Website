import React, { useState, useEffect } from "react";
import {
  X, Package,
  Wrench, Smartphone, ShieldCheck, Wifi, Headphones,
  Monitor, Battery, Cpu, HardDrive, Settings, Zap,
  BatteryCharging, Cable, Bluetooth, Signal, Shield, LifeBuoy,
  PhoneCall, Clock, Layers, Hammer, ScanLine
} from "lucide-react";
import { adminFetch } from "../../utils/adminFetch";
import "./ServiceModal.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ── Human-readable category labels ────────────────────────── */
const CATEGORY_OPTIONS = [
  { value: "DEVICE_SALES",     label: "Device Sales & Upgrades" },
  { value: "REPAIRS",          label: "Repairs & Maintenance" },
  { value: "ACCESSORIES",      label: "Accessories & Add-Ons" },
  { value: "NETWORK_DATA",     label: "Network & Data Services" },
  { value: "WARRANTY_SUPPORT", label: "Warranty & Support" },
];

/* ── Controlled icon options (safe — no dynamic execution) ──── */
const ICON_OPTIONS = [
  { value: "",              label: "— None —" },
  { value: "Smartphone",   label: "Smartphone" },
  { value: "Wrench",       label: "Wrench" },
  { value: "Hammer",       label: "Hammer" },
  { value: "Settings",     label: "Settings" },
  { value: "ShieldCheck",  label: "Shield Check" },
  { value: "Shield",       label: "Shield" },
  { value: "LifeBuoy",     label: "Life Buoy" },
  { value: "Wifi",         label: "Wifi" },
  { value: "Signal",       label: "Signal" },
  { value: "Bluetooth",    label: "Bluetooth" },
  { value: "Cable",        label: "Cable" },
  { value: "Headphones",   label: "Headphones" },
  { value: "Monitor",      label: "Monitor" },
  { value: "Battery",      label: "Battery" },
  { value: "BatteryCharging", label: "Battery Charging" },
  { value: "Cpu",          label: "CPU" },
  { value: "HardDrive",    label: "Hard Drive" },
  { value: "Zap",          label: "Zap / Fast Service" },
  { value: "Package",      label: "Package" },
  { value: "Layers",       label: "Layers" },
  { value: "PhoneCall",    label: "Phone Call" },
  { value: "Clock",        label: "Clock" },
  { value: "ScanLine",     label: "Scan Line" },
];

/* ── Safe icon map ───────────────────────────────────────────── */
const ICON_MAP = {
  Wrench, Smartphone, ShieldCheck, Wifi, Headphones, Package,
  Monitor, Battery, Cpu, HardDrive, Settings, Zap,
  BatteryCharging, Cable, Bluetooth, Signal, Shield, LifeBuoy,
  PhoneCall, Clock, Layers, Hammer, ScanLine,
};

const IconPreview = ({ name, size = 20 }) => {
  const Icon = ICON_MAP[name];
  if (Icon) return <Icon size={size} />;
  return <Package size={size} />;
};

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
  const [imageError, setImageError] = useState(false);

  /* ── Populate / reset form ─────────────────────────────────── */
  useEffect(() => {
    if (initialData) {
      setFormData({
        name:             initialData.name || "",
        slug:             initialData.slug || "",
        category:         initialData.category || "DEVICE_SALES",
        shortDescription: initialData.shortDescription || "",
        description:      initialData.description || "",
        icon:             initialData.icon || "",
        image:            initialData.image || "",
        displayOrder:     initialData.displayOrder ?? 0,
        status:           initialData.status || "ACTIVE",
        ctaLabel:         initialData.ctaLabel || "",
        ctaTarget:        initialData.ctaTarget || "",
      });
    } else {
      setFormData({ ...INITIAL_FORM });
    }
    setError("");
    setImageError(false);
  }, [initialData, isOpen]);

  /* ── Auto-generate slug from name (create mode only) ────────── */
  useEffect(() => {
    if (!initialData && formData.name) {
      const generated = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData((prev) => ({ ...prev, slug: generated }));
    }
  }, [formData.name, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "displayOrder" ? parseInt(value) || 0 : value,
    }));
    if (name === "image") setImageError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) { setError("Service Name is required"); return; }
    if (!formData.shortDescription.trim()) { setError("Short Description is required"); return; }
    if (formData.displayOrder < 0) { setError("Display Order must be 0 or greater"); return; }

    setIsSubmitting(true);
    try {
      const url = initialData
        ? `${API}/api/admin/services/${initialData._id}`
        : `${API}/api/admin/services`;
      const method = initialData ? "PUT" : "POST";

      const payload = {
        name:             formData.name.trim(),
        slug:             formData.slug.trim(),
        category:         formData.category,
        shortDescription: formData.shortDescription.trim(),
        description:      formData.description.trim(),
        icon:             formData.icon.trim(),
        image:            formData.image.trim(),
        displayOrder:     formData.displayOrder,
        status:           formData.status,
        ctaLabel:         formData.ctaLabel.trim(),
        ctaTarget:        formData.ctaTarget.trim(),
      };

      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save service");
      onSuccess(initialData ? "Service updated successfully" : "Service created successfully");
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedIconName = formData.icon || "";

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal service-modal">
        {/* Modal Header */}
        <div className="svc-modal-header">
          <h2>{initialData ? "Edit Service" : "Add New Service"}</h2>
          <button className="svc-modal-close" onClick={onClose} type="button" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="svc-modal-error">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="service-modal-form">

          {/* ── Section: Identity ─────────────────────────────── */}
          <div className="svc-form-section">
            <div className="svc-form-section-label">Identity</div>

            <div className="form-group">
              <label>Service Name <span className="required">*</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Screen Replacement"
              />
            </div>

            <div className="form-group">
              <label>Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="auto-generated-from-name"
              />
              <span className="field-hint">URL-safe identifier, auto-generated from name.</span>
            </div>
          </div>

          {/* ── Section: Classification ───────────────────────── */}
          <div className="svc-form-section">
            <div className="svc-form-section-label">Classification</div>

            <div className="form-row">
              <div className="form-group">
                <label>Category <span className="required">*</span></label>
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

            <div className="form-row">
              <div className="form-group">
                <label>Icon</label>
                <div className="icon-select-wrapper">
                  <div className="icon-preview-badge">
                    <IconPreview name={selectedIconName} size={18} />
                  </div>
                  <select name="icon" value={formData.icon} onChange={handleChange} className="icon-select">
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <span className="field-hint">Choose a Lucide icon to represent this service.</span>
              </div>
              <div className="form-group">
                <label>Display Order</label>
                <input
                  type="number"
                  name="displayOrder"
                  value={formData.displayOrder}
                  onChange={handleChange}
                  min="0"
                />
                <span className="field-hint">Lower numbers appear first.</span>
              </div>
            </div>
          </div>

          {/* ── Section: Content ──────────────────────────────── */}
          <div className="svc-form-section">
            <div className="svc-form-section-label">Content</div>

            <div className="form-group">
              <label>Short Description <span className="required">*</span></label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                rows={2}
                placeholder="One-line summary shown on the service card"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Detailed description of what the service covers (optional)"
              />
            </div>
          </div>

          {/* ── Section: Image ────────────────────────────────── */}
          <div className="svc-form-section">
            <div className="svc-form-section-label">Image</div>

            <div className="form-group">
              <label>Image URL <span className="optional">(optional)</span></label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://..."
              />
              <span className="field-hint">Paste a direct image URL to display on the service card.</span>
            </div>

            {/* Image preview if URL provided */}
            {formData.image && !imageError && (
              <div className="svc-image-preview">
                <img
                  src={formData.image}
                  alt="Service preview"
                  onError={() => setImageError(true)}
                />
              </div>
            )}
            {formData.image && imageError && (
              <div className="svc-image-error">Image could not be loaded — check the URL.</div>
            )}
          </div>

          {/* ── Section: CTA ──────────────────────────────────── */}
          <div className="svc-form-section">
            <div className="svc-form-section-label">Call to Action</div>

            <div className="form-row">
              <div className="form-group">
                <label>CTA Label</label>
                <input
                  type="text"
                  name="ctaLabel"
                  value={formData.ctaLabel}
                  onChange={handleChange}
                  placeholder="e.g. Learn More"
                />
                <span className="field-hint">Text shown on the service card button.</span>
              </div>
              <div className="form-group">
                <label>CTA Target</label>
                <input
                  type="text"
                  name="ctaTarget"
                  value={formData.ctaTarget}
                  onChange={handleChange}
                  placeholder="e.g. /contact"
                />
                <span className="field-hint">Destination when the button is clicked.</span>
              </div>
            </div>
          </div>

          {/* ── Actions ───────────────────────────────────────── */}
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
