import { createContext, useContext, useEffect, useState, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SettingsContext = createContext({
  settings: null,
  loading: true,
  error: null,
  refreshSettings: () => {}
});

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/settings`);
      if (!res.ok) {
        throw new Error("Failed to fetch settings");
      }
      const data = await res.json();
      setSettings(data.settings || data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const refreshSettings = () => {
    fetchSettings();
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, error, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
