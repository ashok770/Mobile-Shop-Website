import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { getOfferProducts } from "../api/api";
import { Link } from "react-router-dom";

function OfferSection({ title, offerType, viewAllLink }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (offerType) {
      getOfferProducts(offerType).then(setProducts);
    }
  }, [offerType]);

  if (products.length === 0) return null;

  return (
    <section className="home-section">
      <div className="section-header">
        <h2>{title}</h2>
        {viewAllLink && (
          <Link to={viewAllLink} className="view-all-btn">
            View All
          </Link>
        )}
      </div>

      <div className="mobile-list">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default OfferSection;
