import { createElement } from "react";
import { TRUST_ITEMS } from "../constants/trustItems";
import "../styles/main.css";

function TrustStrip() {
  return (
    <section 
      className="trust-strip-section" 
      aria-label="Purchase Assurance"
    >
      <div className="trust-strip-container">
        <div className="trust-strip-grid">
          {TRUST_ITEMS.map((item) => (
            <div key={item.label} className="trust-strip-item">
              <div 
                className="trust-strip-icon-wrapper" 
                aria-hidden="true"
              >
                {createElement(item.Icon, { size: 22, strokeWidth: 2 })}
              </div>
              <div className="trust-strip-content">
                <h3 className="trust-strip-title">{item.label}</h3>
                <p className="trust-strip-desc">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustStrip;
