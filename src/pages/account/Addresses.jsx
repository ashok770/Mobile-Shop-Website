import { useEffect, useState } from "react";
import { MapPin, Plus, Pencil, Trash2, Star, RefreshCw, X } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

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
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
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
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    try {
      if (editingId) {
        const { data } = await axiosInstance.put(`/address/${editingId}`, form);
        setAddresses(data.addresses || []);
      } else {
        const { data } = await axiosInstance.post("/address", form);
        setAddresses(data.addresses || []);
      }
      closeForm();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      const { data } = await axiosInstance.delete(`/address/${id}`);
      setAddresses(data.addresses || []);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete address");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const { data } = await axiosInstance.put(`/address/${id}`, {
        isDefault: true,
      });
      setAddresses(data.addresses || []);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to set default address");
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <header className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-blue-600 font-semibold uppercase tracking-[0.25em] text-xs sm:text-sm">
              My Account
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold mt-2 text-gray-900">
              Saved Addresses
            </h1>
            <p className="text-gray-500 mt-3">
              Manage your delivery addresses.
            </p>
          </div>

          <button
            onClick={openAdd}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 font-semibold transition-colors"
          >
            <Plus size={18} />
            Add Address
          </button>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-16 px-8 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900">
              Something went wrong
            </h2>
            <p className="text-gray-500 mt-3">{error}</p>
            <button
              onClick={fetchAddresses}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-semibold transition-colors"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        ) : addresses.length === 0 && !showForm ? (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-16 px-8 text-center">
            <div className="h-16 w-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-5">
              <MapPin size={28} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              No saved addresses
            </h2>
            <p className="text-gray-500 mt-3 max-w-sm mx-auto">
              Add a delivery address to make checkout faster.
            </p>
            <button
              onClick={openAdd}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-semibold transition-colors"
            >
              <Plus size={16} />
              Add Address
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div
                key={address._id}
                className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {address.fullName}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {address.phone}
                      </p>
                    </div>
                  </div>

                  {address.isDefault && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-semibold">
                      <Star size={12} />
                      Default
                    </span>
                  )}
                </div>

                <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                  {address.street}, {address.city}, {address.state} -{" "}
                  {address.pincode}
                </p>

                <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-3">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address._id)}
                      className="inline-flex items-center gap-1.5 text-blue-600 font-semibold text-sm hover:underline"
                    >
                      <Star size={14} />
                      Set Default
                    </button>
                  )}

                  <button
                    onClick={() => openEdit(address)}
                    className="inline-flex items-center gap-1.5 text-gray-600 font-semibold text-sm hover:text-blue-600 transition-colors"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(address._id)}
                    className="inline-flex items-center gap-1.5 text-red-600 font-semibold text-sm hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit form modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingId ? "Edit Address" : "Add Address"}
                </h2>
                <button
                  onClick={closeForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
                {formError && (
                  <div className="rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">
                    {formError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    pattern="[6-9][0-9]{9}"
                    title="Enter a valid 10-digit Indian phone number"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10-digit phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Street / Address
                  </label>
                  <textarea
                    name="street"
                    value={form.street}
                    onChange={handleChange}
                    required
                    rows={2}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="House no, street, area"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="State"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    PIN Code
                  </label>
                  <input
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{6}"
                    title="Enter a valid 6-digit PIN code"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="6-digit PIN code"
                  />
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={form.isDefault}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Set as default address
                </label>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="flex-1 rounded-xl border border-gray-300 text-gray-700 py-3 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold transition-colors disabled:opacity-60"
                  >
                    {saving
                      ? "Saving..."
                      : editingId
                        ? "Update Address"
                        : "Save Address"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
