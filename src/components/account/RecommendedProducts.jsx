import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import ProductCard from "../ProductCard";

export default function RecommendedProducts({ products = [] }) {
  return (
    <section className="recommended-section">
      <div className="dash-section-header">
        <div>
          <h2>Recommended For You</h2>
          <p>Handpicked products based on your browsing history.</p>
        </div>

        <Link to="/mobiles" className="dash-view-all">
          View All
          <ArrowRight size={18} />
        </Link>
      </div>

      {products.length === 0 ? (
        /* ── Empty State ── */
        <div className="dash-state">
          <div className="dash-state__icon bg-blue-50 text-blue-600">
            <Sparkles size={26} />
          </div>
          <h2>No recommendations yet</h2>
          <p>
            Browse our latest products — recommendations will appear here as you
            explore.
          </p>
          <Link to="/mobiles" className="dash-state__btn">
            Explore Products
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="recommended-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
