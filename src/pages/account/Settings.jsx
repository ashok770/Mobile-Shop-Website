import { useEffect, useState } from "react";
import { Camera, LogOut, Mail, Save, RefreshCw, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import axiosInstance from "../../utils/axiosInstance";

export default function Settings() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [saving, setSaving] = useState(false);
  const [fieldError, setFieldError] = useState("");

  useEffect(() => {
    setName(user?.name || "");
    setAvatar(user?.avatar || "");
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setFieldError("Please enter a name with at least 2 characters.");
      return;
    }
    setFieldError("");

    try {
      const { data } = await axiosInstance.put("/profile", { name: trimmedName, avatar: avatar.trim() });
      setUser(data.user);
      toast.success(data.message || "Profile updated successfully.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const initials = (user?.name || "U").trim().charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <header className="mb-8 sm:mb-10">
          <p className="text-blue-600 font-semibold uppercase tracking-[0.25em] text-xs sm:text-sm">
            My Account
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold mt-2 text-gray-900">
            Account Settings
          </h1>
          <p className="text-gray-500 mt-3">
            Manage your personal information and account preferences.
          </p>
        </header>

        <div className="space-y-6">
          <section className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-400" />
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-7 mb-7 border-b border-gray-100">
                <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-100">
                  {avatar ? <img src={avatar} alt="Profile" className="h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} /> : initials}
                  <span className="absolute bottom-1 right-1 h-6 w-6 rounded-lg bg-white text-blue-600 flex items-center justify-center shadow"><Camera size={13} /></span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Profile Information</h2>
                  <p className="text-sm text-gray-500 mt-1">Keep your account details up to date.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    value={name}
                    onChange={(e) => { setName(e.target.value); setFieldError(""); }}
                    required
                    minLength={2}
                    className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your full name"
                  />
                </div>
                {fieldError && <p className="mt-1.5 text-sm text-red-600">{fieldError}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    value={user?.email || ""}
                    disabled
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-2.5 text-sm text-gray-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Email cannot be changed.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Avatar URL (optional)
                </label>
                <input
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-semibold transition-colors disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </form>
            </div>
          </section>

          {/* Password section - backend does not support this */}
          <section className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Security</h2>

            <div className="flex items-start gap-3 rounded-xl bg-yellow-50 px-4 py-3">
              <Lock
                size={18}
                className="text-yellow-600 flex-shrink-0 mt-0.5"
              />
              <div>
                <p className="text-sm font-semibold text-yellow-800">
                  Password change is not available yet
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  The backend does not currently provide a password change
                  endpoint. This feature will be available once the backend
                  supports it.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-lg font-bold text-gray-900">Account actions</h2>
            <p className="text-sm text-gray-500 mt-1">Sign out safely from this device.</p>
            <div className="mt-5 pt-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-gray-600">You can sign in again at any time.</p>
              <button onClick={handleLogout} className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-red-700 px-5 py-2.5 text-sm font-semibold hover:bg-red-100 transition-colors">
                <LogOut size={16} /> Sign out
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
