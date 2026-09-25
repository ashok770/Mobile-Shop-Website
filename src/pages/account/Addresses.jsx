import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Star,
  RefreshCw,
  X,
  CheckCircle2,
  LoaderCircle,
  Phone,
  User,
  Building,
  Navigation,
  Hash,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  Truck,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import "./Addresses.css";

const emptyForm = {
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
};

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [defaultingId, setDefaultingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const fetchAddresses = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get("/address");
      setAddresses(data.addresses || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const openAdd = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      isDefault: addresses.length === 0, // auto default if first address
    });
    setFormError(null);
    setFieldErrors({});
    setShowForm(true);
  };

  const openEdit = (address) => {
    setEditingId(address._id);
    setForm({
      fullName: address.fullName || "",
      phone: address.phone || "",
      street: address.street || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      isDefault: address.isDefault || false,
    });
    setFormError(null);
    setFieldErrors({});
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
    setFieldErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (form.fullName.trim().length < 2) errors.fullName = "Please enter your full name.";
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) errors.phone = "Enter a valid 10-digit Indian mobile number.";
    if (!form.street.trim()) errors.street = "Please enter house/flat, street, or landmark.";
    if (!form.city.trim()) errors.city = "Please enter your city/town.";
    if (!form.state.trim()) errors.state = "Please enter your state.";
    if (!/^\d{6}$/.test(form.pincode.trim())) errors.pincode = "Enter a valid 6-digit postal PIN code.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSaving(true);
    setFormError(null);

    try {
      if (editingId) {
        const { data } = await axiosInstance.put(`/address/${editingId}`, form);
        setAddresses(data.addresses || []);
        toast.success(data.message || "Address updated successfully.");
      } else {
        const { data } = await axiosInstance.post("/address", form);
        setAddresses(data.addresses || []);
        toast.success(data.message || "Address added successfully.");
      }
      closeForm();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const { data } = await axiosInstance.delete(`/address/${deleteTarget._id}`);
      setAddresses(data.addresses || []);
      setDeleteTarget(null);
      toast.success(data.message || "Address removed successfully.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove address");
    } finally {
      setDeleting(false);
    }
  };

  const handleSetDefault = async (id) => {
    setDefaultingId(id);
    try {
      const { data } = await axiosInstance.put(`/address/${id}`, {
        isDefault: true,
      });
      setAddresses(data.addresses || []);
      toast.success(data.message || "Primary delivery address updated.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to set default address");
    } finally {
      setDefaultingId(null);
    }
  };

  const handleCopyAddress = (address) => {
    const text = `${address.fullName}, ${address.street}, ${address.city}, ${address.state} - ${address.pincode}, Phone: ${address.phone}`;
    navigator.clipboard.writeText(text);
    setCopiedId(address._id);
    toast.success("Address copied to clipboard!");
    setTimeout(() => {
      setCopiedId((prev) => (prev === address._id ? null : prev));
    }, 2000);
  };

  const defaultAddress = useMemo(() => {
    return addresses.find((a) => a.isDefault) || addresses[0];
  }, [addresses]);

  return (
    <main className="addresses-page-shell">
      <div className="addresses-container">
        {/* ── Breadcrumb Navigation ── */}
        <nav className="addresses-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="addresses-breadcrumb-separator">/</span>
          <Link to="/profile">My Account</Link>
          <span className="addresses-breadcrumb-separator">/</span>
          <span className="addresses-breadcrumb-current">Saved Addresses</span>
        </nav>

        {/* ── Page Header ── */}
        <div className="addresses-header-row">
          <div>
            <h1 className="addresses-header-title">
              Saved Addresses
              {!loading && (
                <span className="addresses-count-badge">
                  {addresses.length} {addresses.length === 1 ? "location" : "locations"}
                </span>
              )}
            </h1>
            <p className="addresses-header-subtitle">
              Manage your residential and work addresses for fast, 1-click doorstep delivery.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openAdd}
              className="btn-order-primary"
            >
              <Plus size={16} />
              Add New Address
            </button>
          </div>
        </div>

        {/* ── Top Summary Stats Bar ── */}
        {!loading && addresses.length > 0 && (
          <div className="addresses-stats-bar">
            <div className="address-stat-card">
              <div className="address-stat-icon blue">
                <MapPin size={22} />
              </div>
              <div className="address-stat-info">
                <div className="address-stat-value">
                  {addresses.length} {addresses.length === 1 ? "Saved Address" : "Saved Addresses"}
                </div>
                <div className="address-stat-label">Available for Delivery</div>
              </div>
            </div>

            <div className="address-stat-card">
              <div className="address-stat-icon green">
                <Star size={22} />
              </div>
              <div className="address-stat-info">
                <div className="address-stat-value truncate max-w-[200px]">
                  {defaultAddress?.city ? `${defaultAddress.city}, ${defaultAddress.state}` : "Default Delivery"}
                </div>
                <div className="address-stat-label">
                  Primary: {defaultAddress?.fullName || "Not Selected"}
                </div>
              </div>
            </div>

            <div className="address-stat-card">
              <div className="address-stat-icon purple">
                <Truck size={22} />
              </div>
              <div className="address-stat-info">
                <div className="address-stat-value">Pan-India Delivery</div>
                <div className="address-stat-label">Standard & Express Shipping</div>
              </div>
            </div>
          </div>
        )}

        {/* ── Content States ── */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm py-24 px-8 text-center my-6">
            <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">Loading saved addresses...</h3>
            <p className="text-sm text-slate-500 mt-1">Retrieving your saved delivery destinations.</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl border border-red-200 shadow-sm py-16 px-8 text-center max-w-lg mx-auto my-8">
            <div className="h-14 w-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={30} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Failed to load addresses</h2>
            <p className="text-sm text-slate-500 mt-2 mb-6">{error}</p>
            <button onClick={fetchAddresses} className="btn-order-primary mx-auto">
              <RefreshCw size={15} />
              Try Again
            </button>
          </div>
        ) : addresses.length === 0 ? (
          /* Empty state */
          <div className="addresses-empty-card">
            <div className="addresses-empty-icon">
              <MapPin size={34} />
            </div>
            <h2 className="addresses-empty-title">No saved addresses yet</h2>
            <p className="addresses-empty-desc">
              Add your delivery address now to enjoy effortless, accelerated checkouts on your future smartphone and accessory purchases.
            </p>
            <button onClick={openAdd} className="btn-order-primary mx-auto">
              <Plus size={16} />
              Add Delivery Address
            </button>
          </div>
        ) : (
          /* ── Addresses Grid ── */
          <div className="addresses-grid">
            {/* Quick Add Card */}
            <button
              type="button"
              onClick={openAdd}
              className="add-address-card-btn"
            >
              <div className="add-address-card-icon">
                <Plus size={26} />
              </div>
              <span className="add-address-card-title">Add New Address</span>
              <span className="add-address-card-desc">
                Save a new home, office, or family delivery destination
              </span>
            </button>

            {/* Address Cards */}
            {addresses.map((address) => {
              const isDefault = address.isDefault;
              const isCopied = copiedId === address._id;

              return (
                <div
                  key={address._id}
                  className={`address-card ${isDefault ? "is-default" : ""}`}
                >
                  {/* Top Bar */}
                  <div className="address-card-top-bar">
                    <span className="address-type-tag">
                      <MapPin size={13} className="text-blue-600" />
                      Delivery Address
                    </span>

                    {isDefault ? (
                      <span className="address-default-badge">
                        <Star size={11} className="fill-blue-600 text-blue-600" />
                        Default Address
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(address._id)}
                        disabled={defaultingId === address._id}
                        className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors inline-flex items-center gap-1"
                      >
                        {defaultingId === address._id ? (
                          <LoaderCircle size={12} className="animate-spin text-blue-600" />
                        ) : (
                          <Star size={12} />
                        )}
                        Make Default
                      </button>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="address-card-content">
                    <div className="address-recipient-name">
                      <User size={16} className="text-slate-400" />
                      <span>{address.fullName}</span>
                    </div>

                    <div className="address-phone-row">
                      <Phone size={14} className="text-slate-400" />
                      <span className="font-medium">+91 {address.phone}</span>
                    </div>

                    <div className="address-text-body">
                      <MapPin size={15} className="pin-icon" />
                      <div>
                        <p className="font-normal text-slate-700">{address.street}</p>
                        <p className="font-semibold text-slate-900 mt-1">
                          {address.city}, {address.state} - <span className="font-mono">{address.pincode}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="address-card-footer">
                    <button
                      type="button"
                      onClick={() => handleCopyAddress(address)}
                      className="btn-address-action"
                      title="Copy full address"
                    >
                      {isCopied ? (
                        <>
                          <Check size={13} className="text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <div className="address-actions-left">
                      <button
                        type="button"
                        onClick={() => openEdit(address)}
                        className="btn-address-action"
                        title="Edit address"
                      >
                        <Pencil size={13} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(address)}
                        className="btn-address-action delete"
                        title="Delete address"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Add / Edit Address Modal ── */}
        {showForm && (
          <div
            className="modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="address-modal-title"
          >
            <div className="modal-dialog">
              {/* Header */}
              <div className="modal-header">
                <div className="modal-title-group">
                  <div className="modal-icon-badge">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h2 id="address-modal-title" className="modal-title">
                      {editingId ? "Edit Address" : "Add New Delivery Address"}
                    </h2>
                    <p className="modal-subtitle">
                      Please enter your accurate address details for safe doorstep dispatch.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeForm}
                  className="modal-close-btn"
                  title="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {formError && (
                    <div className="rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm flex items-center gap-2 border border-red-200">
                      <AlertCircle size={16} className="shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Full Name */}
                  <div className="form-group">
                    <label className="form-label">
                      <User size={14} className="text-slate-400" />
                      Recipient Full Name *
                    </label>
                    <div className="form-input-wrapper">
                      <User size={16} className="form-input-icon" />
                      <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                        className={`form-input ${fieldErrors.fullName ? "error" : ""}`}
                        placeholder="e.g. Ashok Kumar"
                      />
                    </div>
                    {fieldErrors.fullName && (
                      <p className="form-error-msg">{fieldErrors.fullName}</p>
                    )}
                  </div>

                  {/* Phone Number with +91 */}
                  <div className="form-group">
                    <label className="form-label">
                      <Phone size={14} className="text-slate-400" />
                      Mobile Phone Number *
                    </label>
                    <div className="form-input-wrapper">
                      <Phone size={16} className="form-input-icon" />
                      <span className="form-input-phone-prefix">+91</span>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        maxLength={10}
                        className={`form-input phone-input ${fieldErrors.phone ? "error" : ""}`}
                        placeholder="10-digit mobile number"
                      />
                    </div>
                    {fieldErrors.phone && (
                      <p className="form-error-msg">{fieldErrors.phone}</p>
                    )}
                  </div>

                  {/* Street Address */}
                  <div className="form-group">
                    <label className="form-label">
                      <MapPin size={14} className="text-slate-400" />
                      Street, Building, Flat & Landmark *
                    </label>
                    <div className="form-input-wrapper">
                      <MapPin size={16} className="form-input-icon" style={{ top: "14px" }} />
                      <textarea
                        name="street"
                        value={form.street}
                        onChange={handleChange}
                        required
                        rows={2}
                        className={`form-textarea ${fieldErrors.street ? "error" : ""}`}
                        placeholder="e.g. Flat 402, Green Valley Apts, Near Metro Station"
                      />
                    </div>
                    {fieldErrors.street && (
                      <p className="form-error-msg">{fieldErrors.street}</p>
                    )}
                  </div>

                  {/* City & State (2 columns) */}
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">
                        <Building size={14} className="text-slate-400" />
                        City / Town *
                      </label>
                      <div className="form-input-wrapper">
                        <Building size={16} className="form-input-icon" />
                        <input
                          type="text"
                          name="city"
                          value={form.city}
                          onChange={handleChange}
                          required
                          className={`form-input ${fieldErrors.city ? "error" : ""}`}
                          placeholder="e.g. Coimbatore"
                        />
                      </div>
                      {fieldErrors.city && (
                        <p className="form-error-msg">{fieldErrors.city}</p>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <Navigation size={14} className="text-slate-400" />
                        State *
                      </label>
                      <div className="form-input-wrapper">
                        <Navigation size={16} className="form-input-icon" />
                        <input
                          type="text"
                          name="state"
                          value={form.state}
                          onChange={handleChange}
                          required
                          className={`form-input ${fieldErrors.state ? "error" : ""}`}
                          placeholder="e.g. Tamil Nadu"
                        />
                      </div>
                      {fieldErrors.state && (
                        <p className="form-error-msg">{fieldErrors.state}</p>
                      )}
                    </div>
                  </div>

                  {/* PIN Code */}
                  <div className="form-group">
                    <label className="form-label">
                      <Hash size={14} className="text-slate-400" />
                      PIN Code (Postal Code) *
                    </label>
                    <div className="form-input-wrapper">
                      <Hash size={16} className="form-input-icon" />
                      <input
                        type="text"
                        name="pincode"
                        value={form.pincode}
                        onChange={handleChange}
                        required
                        maxLength={6}
                        className={`form-input ${fieldErrors.pincode ? "error" : ""}`}
                        placeholder="6-digit PIN code (e.g. 641202)"
                      />
                    </div>
                    {fieldErrors.pincode && (
                      <p className="form-error-msg">{fieldErrors.pincode}</p>
                    )}
                  </div>

                  {/* Default Address Checkbox Card */}
                  <label className="form-default-checkbox-card">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="isDefault"
                        checked={form.isDefault}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <div>
                        <div className="text-sm font-bold text-slate-800">
                          Set as default delivery address
                        </div>
                        <div className="text-xs text-slate-500">
                          Future orders will automatically be sent to this location.
                        </div>
                      </div>
                    </div>
                    <Star size={16} className={form.isDefault ? "text-amber-500 fill-amber-500" : "text-slate-300"} />
                  </label>
                </div>

                {/* Footer Buttons */}
                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="btn-order-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-order-primary"
                  >
                    {saving ? (
                      <>
                        <LoaderCircle size={16} className="animate-spin" />
                        Saving Address...
                      </>
                    ) : editingId ? (
                      "Update Address"
                    ) : (
                      "Save Address"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Delete Confirmation Dialog ── */}
        {deleteTarget && (
          <div
            className="modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-address-title"
          >
            <div className="modal-dialog max-w-md">
              <div className="p-6 sm:p-8">
                <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                  <Trash2 size={24} />
                </div>
                <h2 id="delete-address-title" className="text-xl font-bold text-slate-900">
                  Delete this address?
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Are you sure you want to remove the address for{" "}
                  <strong className="text-slate-800">{deleteTarget.fullName}</strong> in{" "}
                  <strong>{deleteTarget.city}</strong>? This action cannot be undone.
                </p>

                <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3">
                  <button
                    type="button"
                    disabled={deleting}
                    onClick={() => setDeleteTarget(null)}
                    className="btn-order-secondary flex-1 justify-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={deleting}
                    onClick={handleDelete}
                    className="btn-order-primary flex-1 justify-center"
                    style={{ backgroundColor: "#dc2626" }}
                  >
                    {deleting ? (
                      <>
                        <LoaderCircle size={16} className="animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete Address"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
