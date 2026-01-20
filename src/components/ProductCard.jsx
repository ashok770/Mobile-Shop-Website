import { useNavigate } from "react-router-dom";
import { useState } from "react";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  const handleOrder = () => {
    navigate("/order", {
      state: {
        product,
        quantity: qty,
      },
    });
  };

  return (
    <div className="product-card">
      {product.discountPercent > 0 && (
        <span className="discount-badge">-{product.discountPercent}%</span>
      )}

      <img src={product.image} alt={product.name} />

      <h4>{product.name}</h4>

      <div className="price">
        {product.originalPrice && (
          <span className="old-price">₹{product.originalPrice}</span>
        )}
        <span className="new-price">₹{product.finalPrice}</span>
      </div>

      <div className="qty">
        <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
        <span>{qty}</span>
        <button onClick={() => setQty((q) => q + 1)}>+</button>
      </div>

      <button className="order-btn" onClick={handleOrder}>
        Order Now
      </button>
    </div>
  );
}

export default ProductCard;
