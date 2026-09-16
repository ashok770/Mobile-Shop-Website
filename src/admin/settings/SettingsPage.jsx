import React, { useState, useEffect } from "react";
import { adminFetch } from "../../utils/adminFetch";
import "./SettingsPage.css";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(null);

  const [form, setForm] = useState({
    storeName: "",
    storeTagline: "",
    storeDescription: "",
    contactEmail: "",
    contactPhone: "",
    whatsappNumber: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    mapEmbedUrl: "",
    directionsUrl: "",
    weekdayHours: "",
    weekendHours: "",
    facebookUrl: "",
    instagramUrl: "",
    youtubeUrl: "",
    freeShippingThreshold: 500,
    baseShippingCharge: 49,
    codEnabled: true,
  });

  const [initialForm, setInitialForm] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = import.meta.env?.VITE_API_URL || "http://localhost:5000";
      const res = await adminFetch(`${baseUrl}/api/admin/settings`);
      if (!res.ok) {
        throw new Error("Failed to load settings");
      }
      const data = await res.json();
      if (data.success && data.settings) {
        setForm(data.settings);
        setInitialForm(data.settings);
      } else {
        throw new Error("Invalid format");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load settings");
    } finally {
      setLoading(false);
    }
  };

  const isDirty = () => {
    if (!initialForm) return false;
    return JSON.stringify(form) !== JSON.stringify(initialForm);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
    setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    setSaveSuccess(null);
  };

  const handleSave = async () => {
    setValidationErrors({});
    setError(null);
    setSaveSuccess(null);
    
    if (!form.storeName?.trim()) {
      setValidationErrors({ storeName: "Store Name is required" });
      return;
    }

    setSaving(true);
    try {
      const baseUrl = import.meta.env?.VITE_API_URL || "http://localhost:5000";
      const res = await adminFetch(`${baseUrl}/api/admin/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to save settings");
      }
      
      setForm(data.settings);
      setInitialForm(data.settings);
      setSaveSuccess("Settings saved successfully");
      
      // Auto-hide success message
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred while saving settings");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (isDirty()) {
      setShowCancelModal(true);
    } else {
      // Nothing to cancel, already clean
      // Actually we just stay on the page or do we navigate back? 
      // It's a settings page, so typically cancel just resets changes.
      fetchSettings(); 
    }
  };

  const confirmCancel = () => {
    setShowCancelModal(false);
    setForm(initialForm);
    setValidationErrors({});
    setError(null);
    setSaveSuccess(null);
  };

  if (loading) {
    return (
      <div className="admin-settings-container">
        <div className="settings-header">
          <h2>Store Settings</h2>
        </div>
        <div className="settings-skeleton">
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
        </div>
      </div>
    );
  }

  if (error && !initialForm) {
    return (
      <div className="admin-settings-container">
        <div className="settings-header">
          <h2>Store Settings</h2>
        </div>
        <div className="settings-error-state">
          <p>{error}</p>
          <button className="settings-btn settings-btn-primary" onClick={fetchSettings}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-settings-container">
      <div className="settings-header">
        <h2>Store Settings</h2>
        <div className="settings-header-actions">
          {isDirty() && (
            <button
              className="settings-btn settings-btn-secondary"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>
          )}
          <button
            className="settings-btn settings-btn-primary"
            onClick={handleSave}
            disabled={saving || !isDirty()}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {error && <div className="settings-global-error">{error}</div>}
      {saveSuccess && <div className="settings-global-success">{saveSuccess}</div>}

      <div className="settings-content">
        {/* SECTION 1: GENERAL / STORE IDENTITY */}
        <div className="settings-card">
          <h3>General / Store Identity</h3>
          <p className="settings-card-desc">Configure your store's brand identity.</p>
          
          <div className="settings-field-row">
            <div className="settings-field">
              <label htmlFor="storeName">Store Name *</label>
              <input
                type="text"
                id="storeName"
                name="storeName"
                value={form.storeName || ""}
                onChange={handleChange}
                className={validationErrors.storeName ? "input-error" : ""}
              />
              {validationErrors.storeName && (
                <span className="field-error">{validationErrors.storeName}</span>
              )}
            </div>
            <div className="settings-field">
              <label htmlFor="storeTagline">Store Tagline</label>
              <input
                type="text"
                id="storeTagline"
                name="storeTagline"
                value={form.storeTagline || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="settings-field">
            <label htmlFor="storeDescription">Store Description</label>
            <textarea
              id="storeDescription"
              name="storeDescription"
              value={form.storeDescription || ""}
              onChange={handleChange}
              rows="3"
            />
          </div>
        </div>

        {/* SECTION 2: CONTACT & LOCATION */}
        <div className="settings-card">
          <h3>Contact & Location</h3>
          <p className="settings-card-desc">Update this with your real store information.</p>
          
          <div className="settings-field-row">
            <div className="settings-field">
              <label htmlFor="contactEmail">Contact Email</label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={form.contactEmail || ""}
                onChange={handleChange}
              />
            </div>
            <div className="settings-field">
              <label htmlFor="contactPhone">Contact Phone</label>
              <input
                type="text"
                id="contactPhone"
                name="contactPhone"
                value={form.contactPhone || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="settings-field-row">
            <div className="settings-field">
              <label htmlFor="whatsappNumber">WhatsApp Number</label>
              <input
                type="text"
                id="whatsappNumber"
                name="whatsappNumber"
                value={form.whatsappNumber || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="settings-field">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={form.address || ""}
              onChange={handleChange}
            />
          </div>

          <div className="settings-field-row">
            <div className="settings-field">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={form.city || ""}
                onChange={handleChange}
              />
            </div>
            <div className="settings-field">
              <label htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={form.state || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="settings-field-row">
            <div className="settings-field">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={form.country || ""}
                onChange={handleChange}
              />
            </div>
            <div className="settings-field">
              <label htmlFor="postalCode">Postal Code</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={form.postalCode || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="settings-field-row settings-field-secondary">
            <div className="settings-field">
              <label htmlFor="mapEmbedUrl">Map Embed URL (Secondary)</label>
              <input
                type="url"
                id="mapEmbedUrl"
                name="mapEmbedUrl"
                value={form.mapEmbedUrl || ""}
                onChange={handleChange}
              />
            </div>
            <div className="settings-field">
              <label htmlFor="directionsUrl">Directions URL (Secondary)</label>
              <input
                type="url"
                id="directionsUrl"
                name="directionsUrl"
                value={form.directionsUrl || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: BUSINESS HOURS */}
        <div className="settings-card">
          <h3>Business Hours</h3>
          <p className="settings-card-desc">These fields are displayed publicly to your customers.</p>
          
          <div className="settings-field-row">
            <div className="settings-field">
              <label htmlFor="weekdayHours">Weekday Hours (Mon - Fri)</label>
              <input
                type="text"
                id="weekdayHours"
                name="weekdayHours"
                value={form.weekdayHours || ""}
                onChange={handleChange}
                placeholder="e.g. 9am - 6pm"
              />
            </div>
            <div className="settings-field">
              <label htmlFor="weekendHours">Weekend Hours (Sat - Sun)</label>
              <input
                type="text"
                id="weekendHours"
                name="weekendHours"
                value={form.weekendHours || ""}
                onChange={handleChange}
                placeholder="e.g. 10am - 4pm"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: SOCIAL LINKS */}
        <div className="settings-card">
          <h3>Social Links</h3>
          <div className="settings-field-row">
            <div className="settings-field">
              <label htmlFor="facebookUrl">Facebook URL</label>
              <input
                type="url"
                id="facebookUrl"
                name="facebookUrl"
                value={form.facebookUrl || ""}
                onChange={handleChange}
              />
            </div>
            <div className="settings-field">
              <label htmlFor="instagramUrl">Instagram URL</label>
              <input
                type="url"
                id="instagramUrl"
                name="instagramUrl"
                value={form.instagramUrl || ""}
                onChange={handleChange}
              />
            </div>
            <div className="settings-field">
              <label htmlFor="youtubeUrl">YouTube URL</label>
              <input
                type="url"
                id="youtubeUrl"
                name="youtubeUrl"
                value={form.youtubeUrl || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* SECTION 5: ORDERS & SHIPPING */}
        <div className="settings-card">
          <h3>Orders & Shipping</h3>
          <p className="settings-card-desc">Free shipping applies when subtotal reaches the configured threshold.</p>
          
          <div className="settings-field-row">
            <div className="settings-field">
              <label htmlFor="freeShippingThreshold">Free Shipping Threshold</label>
              <input
                type="number"
                id="freeShippingThreshold"
                name="freeShippingThreshold"
                value={form.freeShippingThreshold}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div className="settings-field">
              <label htmlFor="baseShippingCharge">Base Shipping Charge</label>
              <input
                type="number"
                id="baseShippingCharge"
                name="baseShippingCharge"
                value={form.baseShippingCharge}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>
          
          <div className="settings-toggle-field">
            <label className="toggle-label" htmlFor="codEnabled">
              <input
                type="checkbox"
                id="codEnabled"
                name="codEnabled"
                checked={!!form.codEnabled}
                onChange={handleChange}
              />
              <span className="toggle-text">Allow Cash on Delivery</span>
            </label>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="settings-modal-overlay">
          <div className="settings-modal">
            <h3>Discard Changes?</h3>
            <p>You have unsaved changes. Are you sure you want to discard them?</p>
            <div className="settings-modal-actions">
              <button
                className="settings-btn settings-btn-secondary"
                onClick={() => setShowCancelModal(false)}
              >
                Keep Editing
              </button>
              <button
                className="settings-btn settings-btn-danger"
                onClick={confirmCancel}
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
