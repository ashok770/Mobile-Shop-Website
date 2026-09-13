const API = import.meta.env?.VITE_API_URL || "http://localhost:5000";

/**
 * Reusable fetch wrapper for admin requests.
 * Automatically attaches Authorization: Bearer <adminToken> if present.
 * If response is 401, clears adminToken and redirects to /admin/login.
 * Does not swallow non-401 errors or redirect on 403.
 */
export const adminFetch = async (url, options = {}) => {
  const token = localStorage.getItem("adminToken");
  const headers = new Headers(options.headers || {});

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem("adminToken");
    if (window.location.pathname !== "/admin/login") {
      window.location.href = "/admin/login";
    }
  }

  return response;
};

/**
 * Performs admin logout:
 * 1. Calls POST /api/admin/logout with admin Bearer token.
 * 2. Clears localStorage adminToken.
 * 3. Redirects to /admin/login regardless of whether backend request succeeds or fails.
 */
export const performAdminLogout = async () => {
  const token = localStorage.getItem("adminToken");
  try {
    if (token) {
      await fetch(`${API}/api/admin/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } catch {
    // Ignore network/server errors during logout
  } finally {
    localStorage.removeItem("adminToken");
    if (window.location.pathname !== "/admin/login") {
      window.location.href = "/admin/login";
    }
  }
};
