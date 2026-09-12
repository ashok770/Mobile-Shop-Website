import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

function HomeProductRail({
  title,
  description,
  products,
  viewAllLink,
  viewAllLabel = "View All",
  variant,
}) {
  const visibleProducts = products.slice(0, 4);

  if (visibleProducts.length === 0) return null;

  return (
    <section
      className={`home-section home-product-section home-product-section--${variant}`}
      data-product-count={visibleProducts.length}
    >
      <div className="section-header">
        <div>
          <h2>{title}</h2>
          {description && <p className="section-header__description">{description}</p>}
        </div>
        {viewAllLink && (
          <Link to={viewAllLink} className="view-all-btn">
            {viewAllLabel}
          </Link>
        )}
      </div>

      <div
        className="home-product-rail"
        data-product-count={visibleProducts.length}
      >
        {visibleProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default HomeProductRail;
