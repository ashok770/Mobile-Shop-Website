import { useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useBrands } from "../context/BrandContext";
import "../styles/main.css";

function ShopByBrand() {
  const { brands, loading, error } = useBrands();
  const navigate = useNavigate();

  return (
    <section className="shop-by-brand-section" aria-labelledby="shop-by-brand-title">
      <div className="shop-by-brand-container">
        
        {/* Section Header */}
        <div className="shop-by-brand-header">
          <div className="shop-by-brand-title-group">
            <h2 id="shop-by-brand-title" className="shop-by-brand-heading">
              Shop by Brand
            </h2>
            <p className="shop-by-brand-desc">
              Explore trusted brands we carry
            </p>
          </div>

          <Link to="/products" className="shop-by-brand-view-all">
            View all
            <ArrowRight size={16} className="shop-by-brand-view-all-arrow" />
          </Link>
        </div>

        {/* Brand Grid */}
        <div className="shop-by-brand-grid">
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="shop-by-brand-tile" style={{ opacity: 0.6 }}>
                <div className="shop-by-brand-logo-container" style={{ background: '#f1f5f9', width: '100%', height: '100%', borderRadius: '8px' }}></div>
              </div>
            ))
          ) : error ? (
            <div style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              Unable to load brands at this time.
            </div>
          ) : (
            brands.map((brand) => (
              <button
                key={brand._id}
                type="button"
                onClick={() => navigate(`/products?brand=${brand.name}`)}
                aria-label={`Shop products from ${brand.name}`}
                className="shop-by-brand-tile"
              >
                <div className="shop-by-brand-logo-container">
                  {brand.logo ? (
                    <img 
                      src={brand.logo} 
                      alt="" 
                      aria-hidden="true"
                      className="shop-by-brand-logo"
                      style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                    />
                  ) : (
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                      {brand.name}
                    </div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>

      </div>
    </section>
  );
}

export default ShopByBrand;
