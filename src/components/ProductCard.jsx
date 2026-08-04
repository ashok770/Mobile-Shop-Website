import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const displayPrice =
    product.finalPrice ?? product.price ?? product.originalPrice ?? "N/A";
  const image = product.images?.[0] || product.image;

  const handleViewDetails = () => navigate(`/mobiles/${product._id}`);

  const handleAddToCart = () => {
    if (typeof product.stock !== "undefined" && product.stock <= 0) {
      alert("Out of stock");
      return;
    }
    const cartProduct = {
      productId: product._id,
      name: product.name,
      image,
      price: displayPrice,
      originalPrice: product.originalPrice,
      discountPercent: product.discountPercent || 0,
      stock: product.stock,
    };
    window.addToCart && window.addToCart(cartProduct);
    alert("Added to cart!");
  };

  return (
    <div className="product-card">
      {product.discountPercent > 0 && (
        <span className="discount-badge">{product.discountPercent}% OFF</span>
      )}

      <img src={image} alt={product.name} onClick={handleViewDetails} />

      <h3 className="product-card__name">{product.name}</h3>

      <div className="product-card__price">
        {product.originalPrice && product.discountPercent > 0 && (
          <span className="price-meta">
            <span className="old-price">₹{product.originalPrice}</span>
            <span className="discount-percent">
              {product.discountPercent}% OFF
            </span>
          </span>
        )}
        <span className="new-price">₹{displayPrice}</span>
      </div>

      <div className="card-actions">
        <button className="btn view-details-btn" onClick={handleViewDetails}>
          View Details
        </button>
        <button className="btn add-to-cart-btn" onClick={handleAddToCart}>
          <svg
            className="cart-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.82 14h8.36c.75 0 1.41-.41 1.75-1.03l3.24-5.87a.996.996 0 0 0-.87-1.47H6.21L5.27 3.6A1 1 0 0 0 4.31 3H2v2h1.27l3.6 7.59-1.35 2.44A1 1 0 0 0 5.5 16h13v-2H7.82z" />
          </svg>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
