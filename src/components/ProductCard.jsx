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
        <span className="discount-badge">-{product.discountPercent}% OFF</span>
      )}

      <img
        src={image}
        alt={product.name}
        onClick={handleViewDetails}
      />

      <h3 className="product-card__name">{product.name}</h3>

      <div className="product-card__price">
        {product.originalPrice && product.discountPercent > 0 && (
          <span className="old-price">₹{product.originalPrice}</span>
        )}
        <span className="new-price">₹{displayPrice}</span>
      </div>

      <div className="card-actions">
        <button className="btn order-btn" onClick={handleViewDetails}>
          View Details
        </button>
        <button className="btn add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
