import { useState } from "react";
import { User, Mail, Save, RefreshCw, Lock } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import axiosInstance from "../../utils/axiosInstance";

export default function Settings() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const { data } = await axiosInstance.put("/profile", { name, avatar });
      setUser(data.user);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
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
          {/* Profile form */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Profile Information
            </h2>

            {message && (
              <div className="rounded-xl bg-green-50 text-green-700 px-4 py-3 text-sm mb-4">
                {message}
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm mb-4">
                {error}
              </div>
            )}

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
                    onChange={(e) => setName(e.target.value)}
                    required
                    minLength={2}
                    className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your full name"
                  />
                </div>
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

          {/* Password section - backend does not support this */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Change Password
            </h2>

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
          </div>
        </div>
      </div>
    </main>
  );
}
