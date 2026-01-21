import { useNavigate } from "react-router-dom";

function MobileCard({
  id,
  name,
  price,
  image,
  originalPrice,
  discountPercent,
}) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/mobiles/${id}`);
  };

  const handleAddToCart = () => {
    const cartProduct = {
      productId: id,
      name,
      image,
      price: price,
      originalPrice: originalPrice,
      discountPercent: discountPercent || 0,
    };

    if (window.addToCart) {
      window.addToCart(cartProduct);
      alert("Added to cart!");
    } else {
      console.warn("addToCart handler not found on window");
    }
  };

  return (
    <div className="mobile-card">
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p className="price">
        {originalPrice && discountPercent > 0 && (
          <span className="old-price">₹{originalPrice}</span>
        )}
        ₹{price ?? "N/A"}
      </p>
      {discountPercent > 0 && (
        <span className="discount-badge">-{discountPercent}%</span>
      )}

      <button className="btn order-btn" onClick={handleViewDetails}>
        View Details
      </button>
      <button className="btn add-to-cart-btn" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
}

export default MobileCard;
