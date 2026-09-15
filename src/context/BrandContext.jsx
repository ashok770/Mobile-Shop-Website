import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const BrandContext = createContext();

export const useBrands = () => {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error("useBrands must be used within a BrandProvider");
  }
  return context;
};

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const BrandProvider = ({ children }) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBrands = useCallback(async (isMounted = { current: true }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/brands`);
      if (!res.ok) {
        throw new Error("Failed to fetch brands");
      }
      const data = await res.json();
      if (isMounted.current) {
        setBrands(data || []);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err.message || "An error occurred while fetching brands");
        setBrands([]);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const isMounted = { current: true };
    fetchBrands(isMounted);
    return () => {
      isMounted.current = false;
    };
  }, [fetchBrands]);

  const refreshBrands = useCallback(() => {
    return fetchBrands({ current: true });
  }, [fetchBrands]);

  const value = {
    brands,
    loading,
    error,
    refreshBrands,
  };

  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
};

export default BrandContext;
