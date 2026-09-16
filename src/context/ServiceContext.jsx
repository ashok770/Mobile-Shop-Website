import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const ServiceContext = createContext();

export const useServices = () => {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error("useServices must be used within a ServiceProvider");
  }
  return context;
};

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const ServiceProvider = ({ children }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = useCallback(async (isMounted = { current: true }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/services`);
      if (!res.ok) {
        throw new Error("Failed to fetch services");
      }
      const data = await res.json();
      if (isMounted.current) {
        setServices(Array.isArray(data) ? data : data.services || []);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err.message || "An error occurred while fetching services");
        setServices([]);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const isMounted = { current: true };
    fetchServices(isMounted);
    return () => {
      isMounted.current = false;
    };
  }, [fetchServices]);

  const refreshServices = useCallback(() => {
    return fetchServices({ current: true });
  }, [fetchServices]);

  const value = {
    services,
    loading,
    error,
    refreshServices,
  };

  return <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>;
};

export default ServiceContext;
