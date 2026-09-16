import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useServices } from "../context/ServiceContext";
import { ServiceIcon } from "../utils/serviceIcons";
import "../styles/main.css";

function ServicesSection() {
  const { services, loading, error } = useServices();

  // If there's an error, fail silently on the homepage
  if (error && !loading) {
    return null;
  }

  // Get up to 4 active services sorted by displayOrder (already sorted by API)
  const displayServices = services.slice(0, 4);

  // If no services and not loading, hide section
  if (!loading && displayServices.length === 0) {
    return null;
  }

  return (
    <section className="why-ommastra-section" aria-labelledby="why-ommastra-heading">
      <div className="why-ommastra-container">
        
        {/* Editorial Header & CTA */}
        <div className="why-ommastra-header">
          <div className="why-ommastra-title-group">
            <span className="why-ommastra-eyebrow">WHY OMMASTRA</span>
            <h2 id="why-ommastra-heading" className="why-ommastra-heading">
              Care beyond the purchase
            </h2>
            <p className="why-ommastra-desc">
              Expert care for your devices, from certified repair to ongoing dedicated customer support.
            </p>
          </div>
          
          <div className="why-ommastra-cta-wrapper">
            <Link to="/services" className="why-ommastra-cta">
              View All Services
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Services Grid */}
        <div className="why-ommastra-grid">
          {loading ? (
            // Skeleton loaders for 4 cards
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="why-ommastra-card" style={{ minHeight: "220px", display: "flex", flexDirection: "column", animation: "shimmer 1.5s infinite" }}>
                <div style={{ width: "36px", height: "36px", background: "#f1f5f9", borderRadius: "8px", marginBottom: "24px" }} />
                <div style={{ height: "20px", background: "#f1f5f9", borderRadius: "4px", marginBottom: "12px", width: "70%" }} />
                <div style={{ height: "16px", background: "#f1f5f9", borderRadius: "4px", marginBottom: "8px", width: "90%" }} />
                <div style={{ height: "16px", background: "#f1f5f9", borderRadius: "4px", marginBottom: "24px", width: "80%" }} />
                <div style={{ height: "20px", background: "#f1f5f9", borderRadius: "4px", width: "40%", marginTop: "auto" }} />
              </div>
            ))
          ) : (
            displayServices.map((service) => {
              const ctaLabel = service.ctaLabel || "Explore service";
              const ctaTarget = service.ctaTarget || "/services";
              const isExternal = ctaTarget.startsWith("http");

              return (
                <div key={service._id} className="why-ommastra-card">
                  <div className="why-ommastra-card-icon" aria-hidden="true">
                    <ServiceIcon name={service.icon} size={36} />
                  </div>
                  <h3 className="why-ommastra-card-title">{service.name}</h3>
                  <p className="why-ommastra-card-desc">{service.shortDescription}</p>
                  
                  {isExternal ? (
                    <a href={ctaTarget} target="_blank" rel="noreferrer" className="why-ommastra-card-link">
                      {ctaLabel}
                      <ArrowRight size={16} className="why-ommastra-card-arrow" />
                    </a>
                  ) : (
                    <Link to={ctaTarget} className="why-ommastra-card-link">
                      {ctaLabel}
                      <ArrowRight size={16} className="why-ommastra-card-arrow" />
                    </Link>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
}

export default ServicesSection;
