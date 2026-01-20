import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { getProducts } from "../api/api";
import { Link } from "react-router-dom";

function BelowThousandSection() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const allProducts = await getProducts();
      const filtered = allProducts.filter(p => 
        (p.finalPrice ?? p.price ?? p.originalPrice) <= 1000
      );
      setProducts(filtered);
    };
    fetchProducts();
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="home-section">
      <div className="section-header">
        <h2>Below ₹1,000</h2>
        <Link to="/offers/below-1000" className="view-all-btn">
          View All
        </Link>
      </div>

      <div className="mobile-list">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default BelowThousandSection;