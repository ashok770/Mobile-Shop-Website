import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

function HomeProductRail({
  title,
  description,
  products,
  viewAllLink,
  viewAllLabel = "View All",
  variant,
  isLoading = false,
  skeletonCount = 4,
}) {
  const visibleProducts = products ? products.slice(0, 4) : [];

  if (!isLoading && visibleProducts.length === 0) return null;

  return (
    <section
      className={`home-section home-product-section home-product-section--${variant}`}
      data-product-count={isLoading ? skeletonCount : visibleProducts.length}
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
        className={`home-product-rail ${!isLoading ? "reveal-fade" : ""}`}
        data-product-count={isLoading ? skeletonCount : visibleProducts.length}
      >
        {isLoading
          ? Array.from({ length: skeletonCount }).map((_, i) => (
              <ProductCardSkeleton key={`skeleton-${i}`} />
            ))
          : visibleProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
      </div>
    </section>
  );
}

export default HomeProductRail;
