import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, AlertTriangle } from "lucide-react";
import { useServices } from "../context/ServiceContext";
import { ServiceIcon } from "../utils/serviceIcons";
import "./Services.css";

const CATEGORY_TABS = [
  { value: "", label: "All Services" },
  { value: "DEVICE_SALES", label: "Device Sales & Upgrades" },
  { value: "REPAIRS", label: "Repairs & Maintenance" },
  { value: "ACCESSORIES", label: "Accessories & Add-Ons" },
  { value: "NETWORK_DATA", label: "Network & Data Services" },
  { value: "WARRANTY_SUPPORT", label: "Warranty & Support" },
];

function Services() {
  const { services, loading, error, refreshServices } = useServices();
  const [activeTab, setActiveTab] = useState("");

  // Ensure page scrolls to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredServices = useMemo(() => {
    if (!activeTab) return services;
    return services.filter(s => s.category === activeTab);
  }, [services, activeTab]);

  const getCategoryCount = (categoryValue) => {
    if (!categoryValue) return services.length;
    return services.filter(s => s.category === categoryValue).length;
  };

  // WhatsApp number fallback (should be from env or config eventually)
  const WHATSAPP_NUMBER = "919876543210";

  return (
    <div className="svcs-page">
      {/* Hero Section */}
      <section className="svcs-hero">
        <span className="svcs-hero-eyebrow">Expert Mobile Services</span>
        <h1 className="svcs-hero-title">More than a store.<br/>We keep you connected.</h1>
        <p className="svcs-hero-sub">
          From screen repairs and trade-ins to network unlocking and warranty support — all your device needs, one place.
        </p>
        <div className="svcs-hero-actions">
          <Link to="/contact" className="svcs-btn-primary">
            Contact Us <ArrowRight size={18} />
          </Link>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="svcs-btn-secondary">
            WhatsApp Us <MessageCircle size={18} />
          </a>
        </div>
      </section>

      {/* Main Content */}
      <main className="svcs-container">
        
        {/* Category Tabs */}
        {!loading && !error && services.length > 0 && (
          <div className="svcs-tabs-wrapper">
            <div className="svcs-tabs">
              {CATEGORY_TABS.map(tab => (
                <button
                  key={tab.value}
                  className={`svcs-tab ${activeTab === tab.value ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.value)}
                >
                  {tab.label}
                  <span className="svcs-tab-count">{getCategoryCount(tab.value)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Services Grid */}
        <div className="svcs-grid">
          
          {loading && (
            // Loading Skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="svcs-skeleton-card">
                <div className="svcs-skeleton-icon"></div>
                <div className="svcs-skeleton-title"></div>
                <div className="svcs-skeleton-desc"></div>
                <div className="svcs-skeleton-btn"></div>
              </div>
            ))
          )}

          {error && !loading && (
            // Error State
            <div className="svcs-empty">
              <AlertTriangle size={48} style={{ margin: "0 auto", color: "#ef4444" }} />
              <h3>Unable to load services</h3>
              <p>Please check your connection and try again.</p>
              <button onClick={refreshServices} style={{ marginTop: "16px", padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "white", cursor: "pointer" }}>
                Retry
              </button>
            </div>
          )}

          {!loading && !error && services.length === 0 && (
            // Empty State
            <div className="svcs-empty">
              <Package size={48} style={{ margin: "0 auto", color: "#94a3b8" }} />
              <h3>No services available</h3>
              <p>We are currently updating our service offerings. Please check back later.</p>
              <Link to="/contact" style={{ display: "inline-block", marginTop: "16px", color: "#2563eb", fontWeight: "600", textDecoration: "none" }}>
                Contact Support
              </Link>
            </div>
          )}

          {!loading && !error && filteredServices.map((service) => {
            const ctaLabel = service.ctaLabel || "Contact Us";
            const ctaTarget = service.ctaTarget || "/contact";
            const isExternal = ctaTarget.startsWith("http");

            return (
              <div key={service._id} className="svcs-card">
                <div className="svcs-card-icon">
                  <ServiceIcon name={service.icon} size={28} />
                </div>
                <h3 className="svcs-card-title">{service.name}</h3>
                <p className="svcs-card-desc">{service.shortDescription}</p>
                
                {isExternal ? (
                  <a href={ctaTarget} target="_blank" rel="noreferrer" className="svcs-card-cta">
                    {ctaLabel} <ArrowRight size={16} />
                  </a>
                ) : (
                  <Link to={ctaTarget} className="svcs-card-cta">
                    {ctaLabel} <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default Services;
