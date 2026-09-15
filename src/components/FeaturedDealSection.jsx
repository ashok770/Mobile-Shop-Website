import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/api";
import { 
  offerLabels, 
  getPrice, 
  formatPrice, 
  selectFeaturedProduct 
} from "../utils/featuredDealAlgorithm";

function FeaturedDealSection({ featuredDealProductId }) {
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let isCurrent = true;

    const fetchFeaturedProduct = async () => {
      try {
        const catalog = await getProducts();

        if (isCurrent) {
          let selected = null;
          
          if (featuredDealProductId) {
            const manualProduct = catalog.find(p => p._id === featuredDealProductId);
            // Validate manual product
            if (manualProduct && manualProduct.stock > 0 && manualProduct.status === "ACTIVE") {
              const price = Number(getPrice(manualProduct));
              if (Number.isFinite(price) && price > 0) {
                selected = manualProduct;
              }
            }
          }

          if (!selected) {
            selected = selectFeaturedProduct(catalog);
          }

          setFeaturedProduct(selected);
          setStatus("ready");
        }
      } catch {
        if (isCurrent) setStatus("error");
      }
    };

    fetchFeaturedProduct();

    return () => {
      isCurrent = false;
    };
  }, [featuredDealProductId]);

  if (status === "error") return null;

  if (status === "loading" || !featuredProduct) {
    return (
      <section className="featured-deal home-section" aria-busy="true">
        <div className="section-header">
          <div>
            <h2>FEATURED DEAL</h2>
          </div>
        </div>
        <div className="featured-deal__card skeleton-card">
          <div className="featured-deal__info">
            <div className="skeleton-title short skeleton-shimmer" style={{ height: '14px', width: '30%', marginBottom: '16px' }}></div>
            <div className="skeleton-title skeleton-shimmer" style={{ height: '28px', width: '90%', marginBottom: '12px' }}></div>
            <div className="skeleton-title skeleton-shimmer" style={{ height: '28px', width: '60%', marginBottom: '24px' }}></div>
            <div className="skeleton-title skeleton-shimmer" style={{ height: '12px', width: '80%', marginBottom: '8px' }}></div>
            <div className="skeleton-title skeleton-shimmer" style={{ height: '12px', width: '70%', marginBottom: '8px' }}></div>
          </div>
          <div className="featured-deal__visual skeleton-shimmer" style={{ background: '#f1f5f9' }}></div>
          <div className="featured-deal__purchase">
            <div className="skeleton-title short skeleton-shimmer" style={{ height: '20px', width: '40%', marginBottom: '16px', marginLeft: 'auto' }}></div>
            <div className="skeleton-price-block" style={{ justifyContent: 'flex-end' }}>
              <div className="skeleton-price skeleton-shimmer" style={{ height: '36px', width: '70%', marginBottom: '8px' }}></div>
            </div>
            <div className="skeleton-title short skeleton-shimmer" style={{ height: '14px', width: '50%', marginBottom: '24px', marginLeft: 'auto' }}></div>
            <div className="skeleton-btn skeleton-shimmer" style={{ height: '48px', width: '100%', borderRadius: '24px' }}></div>
          </div>
        </div>
      </section>
    );
  }

  const image = featuredProduct.images?.[0] || featuredProduct.image;
  const price = getPrice(featuredProduct);
  const originalPrice = featuredProduct.originalPrice;
  const offerLabel = offerLabels[featuredProduct.offerType];
  const hasDiscount = featuredProduct.discountPercent > 0;
  const savings = (hasDiscount && originalPrice && originalPrice > price) ? (originalPrice - price) : 0;
  
  // Try to find any features/specs
  // If product model doesn't have an explicit 'specs' array, we might use 'features'
  // Only use it if it's an array and actually exists
  const features = Array.isArray(featuredProduct.specs) ? featuredProduct.specs : 
                   Array.isArray(featuredProduct.features) ? featuredProduct.features : [];

  return (
    <section className="featured-deal home-section reveal-fade">
      <div className="section-header">
        <div>
          <h2>FEATURED DEAL</h2>
        </div>
        <Link to="/offers" className="view-all-btn">View All Deals →</Link>
      </div>

      <div className="featured-deal__card">
        {/* LEFT ZONE: INFO */}
        <div className="featured-deal__info">
          {offerLabel && <p className="featured-deal__offer-label">{offerLabel}</p>}
          <h3 className="featured-deal__title">{featuredProduct.name}</h3>
          
          {features.length > 0 && (
            <ul className="featured-deal__specs">
              {features.slice(0, 4).map((spec, idx) => (
                 <li key={idx}>• {spec}</li>
              ))}
            </ul>
          )}
        </div>

        {/* CENTER ZONE: VISUAL */}
        <div className="featured-deal__visual">
          <img src={image} alt={featuredProduct.name} />
        </div>

        {/* RIGHT ZONE: PURCHASE */}
        <div className="featured-deal__purchase">
          {hasDiscount && (
             <div className="featured-deal__discount-badge">
               {featuredProduct.discountPercent}% OFF
             </div>
          )}
          
          <div className="featured-deal__pricing">
            <span className="featured-deal__price">{formatPrice(price)}</span>
            {hasDiscount && originalPrice && (
               <span className="featured-deal__original-price">
                 MRP {formatPrice(originalPrice)}
               </span>
            )}
          </div>

          {savings > 0 && (
             <p className="featured-deal__savings">
               SAVE {formatPrice(savings)}
             </p>
          )}

          <Link
            to={`/mobiles/${featuredProduct._id}`}
            className="featured-deal__cta"
          >
            Shop This Deal →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedDealSection;
