import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminFetch } from "../../utils/adminFetch";
import "./EditProduct.css";

const BRAND_OPTIONS = ["Apple", "Samsung", "Redmi", "Motorola", "Noise", "boAt"];
const CATEGORY_OPTIONS = ["Mobile", "Accessory"];
const STATUS_OPTIONS = ["ACTIVE", "DRAFT"];
const OFFER_OPTIONS = [
  { label: "No Offer", value: "NONE" },
  { label: "Mega Flash Sale", value: "MEGA_FLASH_SALE" },
  { label: "Buy 1 Get 1", value: "BUY_1_GET_1" },
  { label: "Daily Special", value: "DAILY_SPECIAL" },
];

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    description: "",
    status: "ACTIVE",
    offerType: "NONE",
    originalPrice: "",
    discountPercent: 0,
    stock: "",
  });

  const [initialForm, setInitialForm] = useState(null);
  const [retainedImages, setRetainedImages] = useState([]);
  const [initialRetainedImages, setInitialRetainedImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [globalMessage, setGlobalMessage] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Fetch existing product by ID
  const fetchProduct = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const baseUrl = import.meta.env?.VITE_API_URL || "http://localhost:5000";
      const res = await adminFetch(`${baseUrl}/api/products/${id}`);
      if (res.status === 404) {
        setFetchError("404");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setFetchError("fetch_failed");
        setLoading(false);
        return;
      }
      const data = await res.json();
      
      // Normalize category capitalization for UI dropdown selection
      let catFormatted = data.category || "";
      if (catFormatted.toLowerCase() === "mobile") catFormatted = "Mobile";
      else if (catFormatted.toLowerCase() === "accessory") catFormatted = "Accessory";

      const loadedForm = {
        name: data.name || "",
        brand: data.brand || "",
        category: catFormatted,
        description: data.description || "",
        status: data.status || "ACTIVE",
        offerType: data.offerType || "NONE",
        originalPrice: data.originalPrice !== undefined ? String(data.originalPrice) : "",
        discountPercent: data.discountPercent !== undefined ? data.discountPercent : 0,
        stock: data.stock !== undefined ? String(data.stock) : "",
      };

      const loadedImages = Array.isArray(data.images) && data.images.length > 0
        ? data.images
        : (data.image ? [data.image] : []);

      setForm(loadedForm);
      setInitialForm(loadedForm);
      setRetainedImages(loadedImages);
      setInitialRetainedImages(loadedImages);
      setNewImages([]);
    } catch (err) {
      setFetchError("fetch_failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const finalPrice = useMemo(() => {
    const orig = Number(form.originalPrice) || 0;
    const disc = Number(form.discountPercent) || 0;
    return Math.max(0, orig - (orig * disc) / 100).toFixed(2);
  }, [form.originalPrice, form.discountPercent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleNewImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const availableSlots = 5 - (retainedImages.length + newImages.length);

    if (availableSlots <= 0) {
      setErrors((prev) => ({ ...prev, images: "Maximum 5 total images allowed" }));
      return;
    }

    if (files.length > availableSlots) {
      setErrors((prev) => ({ ...prev, images: `You can only add ${availableSlots} more image(s)` }));
    } else {
      setErrors((prev) => ({ ...prev, images: undefined }));
    }

    const allowedFiles = files.slice(0, availableSlots);
    setNewImages((prev) => [...prev, ...allowedFiles]);
  };

  const removeRetainedImage = (idx) => {
    setRetainedImages((prev) => prev.filter((_, i) => i !== idx));
    setErrors((prev) => ({ ...prev, images: undefined }));
  };

  const removeNewImage = (idx) => {
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
    setErrors((prev) => ({ ...prev, images: undefined }));
  };

  const isDirty = () => {
    if (!initialForm) return false;
    if (form.name !== initialForm.name) return true;
    if (form.brand !== initialForm.brand) return true;
    if (form.category !== initialForm.category) return true;
    if (form.description !== initialForm.description) return true;
    if (form.status !== initialForm.status) return true;
    if (form.offerType !== initialForm.offerType) return true;
    if (String(form.originalPrice) !== String(initialForm.originalPrice)) return true;
    if (Number(form.discountPercent) !== Number(initialForm.discountPercent)) return true;
    if (String(form.stock) !== String(initialForm.stock)) return true;
    if (retainedImages.length !== initialRetainedImages.length) return true;
    if (retainedImages.some((img, idx) => img !== initialRetainedImages[idx])) return true;
    if (newImages.length > 0) return true;
    return false;
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (!form.brand) newErrors.brand = "Brand is required";
    if (!form.category) newErrors.category = "Category is required";

    const totalImages = retainedImages.length + newImages.length;
    if (totalImages === 0) newErrors.images = "At least one image is required";
    if (totalImages > 5) newErrors.images = "Maximum 5 total images allowed";

    const origPrice = Number(form.originalPrice);
    if (form.originalPrice === "" || isNaN(origPrice) || origPrice < 0)
      newErrors.originalPrice = "Original price must be a non‑negative number";

    const discount = Number(form.discountPercent);
    if (isNaN(discount) || discount < 0 || discount > 100)
      newErrors.discountPercent = "Discount must be between 0 and 100";

    const stockNum = Number(form.stock);
    if (form.stock === "" || !Number.isInteger(stockNum) || stockNum < 0)
      newErrors.stock = "Stock must be a non‑negative integer";

    if (!STATUS_OPTIONS.includes(form.status)) newErrors.status = "Invalid status";
    if (!OFFER_OPTIONS.map((o) => o.value).includes(form.offerType))
      newErrors.offerType = "Invalid offer type";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!validate()) return;

    setSubmitting(true);
    setGlobalMessage(null);
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("brand", form.brand);
      fd.append("category", form.category.toLowerCase());
      fd.append("description", form.description);
      fd.append("status", form.status);
      fd.append("offerType", form.offerType);
      fd.append("originalPrice", form.originalPrice);
      fd.append("discountPercent", form.discountPercent);
      fd.append("stock", form.stock);

      // Send list of retained existing image URLs
      fd.append("retainedImages", JSON.stringify(retainedImages));

      // Append new image File objects
      newImages.forEach((file) => fd.append("images", file));

      const baseUrl = import.meta.env?.VITE_API_URL || "http://localhost:5000";
      const res = await adminFetch(`${baseUrl}/api/products/${id}`, {
        method: "PUT",
        body: fd,
      });

      if (!res.ok) {
        const err = await res.json();
        setGlobalMessage({ type: "error", text: err.message || "Unable to update product. Please try again." });
      } else {
        setGlobalMessage({ type: "success", text: "Product updated successfully." });
        navigate("/admin/products");
      }
    } catch (err) {
      setGlobalMessage({ type: "error", text: "Unable to update product. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isDirty()) {
      setShowCancelModal(true);
    } else {
      navigate("/admin/products");
    }
  };

  const confirmDiscard = () => {
    setShowCancelModal(false);
    navigate("/admin/products");
  };

  const keepEditing = () => {
    setShowCancelModal(false);
  };

  // 1. Loading Skeleton State
  if (loading) {
    return (
      <div className="add-product-page">
        <div className="add-product-header">
          <div className="header-text-group">
            <div className="header-breadcrumbs">Products / Edit Product</div>
            <h1 className="header-title">Edit Product</h1>
            <p className="header-subtitle">Loading product information...</p>
          </div>
        </div>
        <div className="form-grid">
          <div className="card skeleton-card" style={{ height: "280px" }} />
          <div className="card skeleton-card" style={{ height: "200px" }} />
          <div className="card skeleton-card" style={{ height: "220px" }} />
          <div className="card skeleton-card" style={{ height: "240px" }} />
        </div>
      </div>
    );
  }

  // 2. 404 Product Not Found State
  if (fetchError === "404") {
    return (
      <div className="add-product-page">
        <div className="error-state-card">
          <div className="error-state-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2>Product Not Found</h2>
          <p>The product you are trying to edit does not exist or has been deleted.</p>
          <button type="button" className="btn-primary-action" onClick={() => navigate("/admin/products")}>
            Return to Products
          </button>
        </div>
      </div>
    );
  }

  // 3. Fetch Failed Error State
  if (fetchError) {
    return (
      <div className="add-product-page">
        <div className="error-state-card">
          <div className="error-state-icon warning">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2>Unable to Load Product</h2>
          <p>We could not fetch the product details from the server. Please check your connection and try again.</p>
          <button type="button" className="btn-primary-action" onClick={fetchProduct}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="add-product-page">
      {/* Header */}
      <div className="add-product-header">
        <div className="header-text-group">
          <div className="header-breadcrumbs">Products / Edit Product</div>
          <h1 className="header-title">Edit Product</h1>
          <p className="header-subtitle">Update product information, pricing, inventory and visibility.</p>
        </div>
        <div className="header-actions">
          <button type="button" className="btn-cancel" onClick={handleCancel} disabled={submitting}>
            Cancel
          </button>
          <button type="button" className="btn-save" onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <>
                <span className="spinner" /> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>

      {globalMessage && (
        <div className={`admin-alert-banner ${globalMessage.type}`}>
          <div className="admin-alert-content">
            <span>{globalMessage.text}</span>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <div className="admin-modal-header">
              <div className="admin-modal-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M9.172 16.828a4 4 0 115.656 0M12 2a10 10 0 0110 10c0 5.523-4.477 10-10 10S2 17.523 2 12a10 10 0 0110-10z" />
                </svg>
              </div>
              <div>
                <h2 className="admin-modal-title">Discard changes?</h2>
                <p className="admin-modal-subtitle">You have unsaved product information. Are you sure you want to leave?</p>
              </div>
            </div>
            <div className="admin-modal-actions">
              <button type="button" className="modal-btn-cancel" onClick={keepEditing}>
                Keep Editing
              </button>
              <button type="button" className="modal-btn-delete" onClick={confirmDiscard}>
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      <form className="add-product-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Row 1 Left: Basic Information Card */}
          <section className="card basic-info-card">
            <h2>Basic Information</h2>
            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. iPhone 15 Pro Max"
                className={errors.name ? "error" : ""}
              />
              {errors.name && <div className="error-msg">{errors.name}</div>}
            </div>

            <div className="form-row-2col">
              <div className="form-group">
                <label htmlFor="brand">Brand *</label>
                <select id="brand" name="brand" value={form.brand} onChange={handleChange} className={errors.brand ? "error" : ""}>
                  <option value="">Select brand</option>
                  {BRAND_OPTIONS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                {errors.brand && <div className="error-msg">{errors.brand}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select id="category" name="category" value={form.category} onChange={handleChange} className={errors.category ? "error" : ""}>
                  <option value="">Select category</option>
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.category && <div className="error-msg">{errors.category}</div>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                maxLength={2000}
                value={form.description}
                onChange={handleChange}
                placeholder="Detailed description of product specs, key features..."
              />
            </div>
          </section>

          {/* Row 1 Right: Product Status & Offers Card */}
          <section className="card status-offer-card">
            <h2>Product Status &amp; Offers</h2>
            <div className="form-group">
              <label>Status *</label>
              <div className="status-segmented-control">
                <button
                  type="button"
                  className={`segmented-btn ${form.status === "ACTIVE" ? "active" : ""}`}
                  onClick={() => {
                    setForm((prev) => ({ ...prev, status: "ACTIVE" }));
                    setErrors((prev) => ({ ...prev, status: undefined }));
                  }}
                >
                  Active
                </button>
                <button
                  type="button"
                  className={`segmented-btn ${form.status === "DRAFT" ? "active" : ""}`}
                  onClick={() => {
                    setForm((prev) => ({ ...prev, status: "DRAFT" }));
                    setErrors((prev) => ({ ...prev, status: undefined }));
                  }}
                >
                  Draft
                </button>
              </div>
              {errors.status && <div className="error-msg">{errors.status}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="offerType">Offer Type</label>
              <select id="offerType" name="offerType" value={form.offerType} onChange={handleChange} className={errors.offerType ? "error" : ""}>
                {OFFER_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              {errors.offerType && <div className="error-msg">{errors.offerType}</div>}
            </div>
          </section>

          {/* Row 2 Left: Product Images Card */}
          <section className="card images-card">
            <h2>Product Images</h2>
            
            {/* Existing Retained Images */}
            {retainedImages.length > 0 && (
              <div className="image-section-block">
                <label className="section-sublabel">Existing Images ({retainedImages.length})</label>
                <div className="image-preview-grid">
                  {retainedImages.map((url, idx) => (
                    <div key={`retained-${idx}`} className="image-thumb-wrapper">
                      <img src={url} alt={`retained-${idx}`} className="image-thumb" />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => removeRetainedImage(idx)}
                        aria-label="Remove existing image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Dropzone for New Images */}
            {retainedImages.length + newImages.length < 5 && (
              <div className="form-group">
                <div
                  className={`upload-dropzone ${errors.images ? "error" : ""}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
                      const availableSlots = 5 - (retainedImages.length + newImages.length);
                      const allowedFiles = files.slice(0, availableSlots);
                      setNewImages((prev) => [...prev, ...allowedFiles]);
                      setErrors((prev) => ({ ...prev, images: undefined }));
                    }
                  }}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    id="images"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleNewImageSelect}
                    style={{ display: "none" }}
                  />
                  <div className="dropzone-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                  <div className="dropzone-text">
                    <span className="dropzone-primary-text">+ Add New Images</span>
                    <span className="dropzone-secondary-text">or drag and drop</span>
                  </div>
                  <div className="dropzone-hint">
                    PNG, JPG, WEBP · {5 - (retainedImages.length + newImages.length)} slot(s) remaining
                  </div>
                </div>
              </div>
            )}

            {/* New Uploaded Images Preview */}
            {newImages.length > 0 && (
              <div className="image-section-block">
                <label className="section-sublabel">New Images to Upload ({newImages.length})</label>
                <div className="image-preview-grid">
                  {newImages.map((file, idx) => (
                    <div key={`new-${idx}`} className="image-thumb-wrapper new-thumb">
                      <img src={URL.createObjectURL(file)} alt={`new-${idx}`} className="image-thumb" />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => removeNewImage(idx)}
                        aria-label="Remove new image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errors.images && <div className="error-msg">{errors.images}</div>}
          </section>

          {/* Row 2 Right: Pricing & Inventory Card */}
          <section className="card pricing-inventory-card">
            <h2>Pricing &amp; Inventory</h2>
            <div className="form-row-2col">
              <div className="form-group">
                <label htmlFor="originalPrice">Original Price *</label>
                <div className="input-with-prefix">
                  <span className="prefix">₹</span>
                  <input
                    type="number"
                    id="originalPrice"
                    name="originalPrice"
                    min="0"
                    step="0.01"
                    value={form.originalPrice}
                    onChange={handleChange}
                    placeholder="0"
                    className={errors.originalPrice ? "error" : ""}
                  />
                </div>
                {errors.originalPrice && <div className="error-msg">{errors.originalPrice}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="discountPercent">Discount Percent</label>
                <div className="input-with-suffix">
                  <input
                    type="number"
                    id="discountPercent"
                    name="discountPercent"
                    min="0"
                    max="100"
                    step="1"
                    value={form.discountPercent}
                    onChange={handleChange}
                    placeholder="0"
                    className={errors.discountPercent ? "error" : ""}
                  />
                  <span className="suffix">%</span>
                </div>
                {errors.discountPercent && <div className="error-msg">{errors.discountPercent}</div>}
              </div>
            </div>

            <div className="form-row-2col">
              <div className="form-group read-only">
                <label>Final Price (INR)</label>
                <div className="input-with-prefix">
                  <span className="prefix">₹</span>
                  <output className="final-price-output">{finalPrice}</output>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="stock">Stock Quantity *</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="0"
                  className={errors.stock ? "error" : ""}
                />
                {errors.stock && <div className="error-msg">{errors.stock}</div>}
              </div>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}
