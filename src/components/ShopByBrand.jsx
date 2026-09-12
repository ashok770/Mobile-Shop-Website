import { useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "../styles/main.css";

// Use real logo assets (renamed to .png since they are binary PNG files disguised as SVGs)
import appleLogo from "../assets/images/brands/apple.png";
import samsungLogo from "../assets/images/brands/samsung.png";
import redmiLogo from "../assets/images/brands/redmi.png";
import motorolaLogo from "../assets/images/brands/motorola.png";
import noiseLogo from "../assets/images/brands/noise.png";
import boatLogo from "../assets/images/brands/boat.png";

const CATALOG_BRANDS = [
  {
    id: "apple",
    name: "Apple",
    path: "/mobiles?brand=Apple",
    logoSrc: appleLogo,
  },
  {
    id: "samsung",
    name: "Samsung",
    path: "/mobiles?brand=Samsung",
    logoSrc: samsungLogo,
  },
  {
    id: "redmi",
    name: "Redmi",
    path: "/mobiles?brand=Redmi",
    logoSrc: redmiLogo,
  },
  {
    id: "motorola",
    name: "Motorola",
    path: "/mobiles?brand=moto",
    logoSrc: motorolaLogo,
  },
  {
    id: "noise",
    name: "Noise",
    path: "/accessories?brand=Noise",
    logoSrc: noiseLogo,
  },
  {
    id: "boat",
    name: "boAt",
    path: "/accessories?brand=boAt",
    logoSrc: boatLogo,
  },
];

function ShopByBrand() {
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

          <Link to="/mobiles" className="shop-by-brand-view-all">
            View all
            <ArrowRight size={16} className="shop-by-brand-view-all-arrow" />
          </Link>
        </div>

        {/* Brand Grid */}
        <div className="shop-by-brand-grid">
          {CATALOG_BRANDS.map((brand) => (
            <button
              key={brand.id}
              type="button"
              onClick={() => navigate(brand.path)}
              aria-label={`Shop products from ${brand.name}`}
              className="shop-by-brand-tile"
            >
              <div className="shop-by-brand-logo-container">
                <img 
                  src={brand.logoSrc} 
                  alt="" 
                  aria-hidden="true"
                  className={`shop-by-brand-logo shop-by-brand-logo-${brand.id}`}
                />
              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}

export default ShopByBrand;
