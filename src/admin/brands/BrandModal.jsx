import React, { useState, useEffect, useRef } from "react";
import { UploadCloud, X } from "lucide-react";
import { adminFetch } from "../../utils/adminFetch";
import "./BrandModal.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function BrandModal({ isOpen, onClose, onSuccess, initialData = null }) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    displayOrder: 0,
    status: "ACTIVE",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const fileInputRef = useRef(null);

  // Pre-fill form when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        slug: initialData.slug || "",
        displayOrder: initialData.displayOrder ?? 0,
        status: initialData.status || "ACTIVE",
      });
      setLogoPreview(initialData.logo || "");
      setLogoFile(null);
    } else {
      setFormData({
        name: "",
        slug: "",
        displayOrder: 0,
        status: "ACTIVE",
      });
      setLogoPreview("");
      setLogoFile(null);
    }
    setError("");
  }, [initialData, isOpen]);

  // Auto-generate slug from name if creating new or if slug matches name pattern
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Brand Name is required");
      return;
    }

    if (formData.displayOrder < 0) {
      setError("Display Order must be 0 or greater");
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append("name", formData.name.trim());
      submitData.append("slug", formData.slug.trim());
      submitData.append("displayOrder", formData.displayOrder);
      submitData.append("status", formData.status);
      
      if (logoFile) {
        submitData.append("logo", logoFile);
      }

      const url = initialData 
        ? `${API}/api/admin/brands/${initialData._id}`
        : `${API}/api/admin/brands`;
        
      const method = initialData ? "PUT" : "POST";

      const res = await adminFetch(url, {
        method,
        body: submitData,
        // Don't set Content-Type header for FormData, browser sets it with boundary
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save brand");
      }

      onSuccess(initialData ? "Brand updated successfully" : "Brand created successfully");
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <h2>{initialData ? "Edit Brand" : "Add New Brand"}</h2>
        
        {error && <div className="form-error" style={{ marginBottom: "16px", padding: "10px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "6px" }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Brand Logo</label>
            <div 
              className="logo-upload-area" 
              onClick={() => fileInputRef.current?.click()}
            >
              {logoPreview ? (
                <div className="logo-preview">
                  <img src={logoPreview} alt="Brand Logo Preview" />
                  <span style={{ fontSize: "12px", color: "#64748b" }}>Click to change image</span>
                </div>
              ) : (
                <div className="logo-preview">
                  <UploadCloud size={32} color="#94a3b8" />
                  <span style={{ fontSize: "14px", color: "#475569" }}>Click to upload logo</span>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>JPG, PNG, WEBP allowed</span>
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/jpeg, image/png, image/webp" 
              style={{ display: "none" }} 
            />
          </div>

          <div className="form-group">
            <label>Brand Name *</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="e.g. Apple" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Slug</label>
            <input 
              type="text" 
              name="slug" 
              value={formData.slug} 
              onChange={handleChange} 
              placeholder="e.g. apple" 
            />
            <span style={{ fontSize: "12px", color: "#64748b", marginTop: "4px", display: "block" }}>
              Leave blank to auto-generate from name. Used in URLs.
            </span>
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Display Order</label>
              <input 
                type="number" 
                name="displayOrder" 
                value={formData.displayOrder} 
                onChange={handleChange} 
                min="0" 
              />
            </div>
            
            <div className="form-group" style={{ flex: 1 }}>
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="ACTIVE">Active</option>
                <option value="DISABLED">Disabled</option>
              </select>
            </div>
          </div>

          {initialData && formData.status === "DISABLED" && initialData.status === "ACTIVE" && (
            <div style={{ backgroundColor: "#fffbeb", border: "1px solid #fef3c7", padding: "12px", borderRadius: "6px", color: "#b45309", fontSize: "13px", marginTop: "8px", marginBottom: "16px" }}>
              <strong>Note:</strong> Disabling this brand will hide it from public brand surfaces. Its products will remain active and purchasable.
            </div>
          )}

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Brand"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
