function ProductCardSkeleton() {
  return (
    <div className="product-card skeleton-card">
      <div className="skeleton-image skeleton-shimmer"></div>
      <div className="skeleton-title skeleton-shimmer"></div>
      <div className="skeleton-title short skeleton-shimmer"></div>
      
      <div className="skeleton-price-block">
        <div className="skeleton-price skeleton-shimmer"></div>
      </div>

      <div className="card-actions">
        <div className="btn skeleton-btn skeleton-shimmer"></div>
      </div>
    </div>
  );
}

export default ProductCardSkeleton;
