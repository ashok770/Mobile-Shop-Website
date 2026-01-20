import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();

  return (
    <div className="product-card">
      {product.discountPercent > 0 && (
        <span className="discount-badge">
          -{product.discountPercent}%
        </span>
      )}

      <img src={product.image} alt={product.name} />

      <h4>{product.name}</h4>

      <div className="price">
        {product.originalPrice && product.discountPercent > 0 && (
          <span className="old-price">
            ₹{product.originalPrice}
          </span>
        )}
        <span className="new-price">
          ₹{product.finalPrice ?? product.price ?? product.originalPrice}
        </span>
      </div>

      <div className="qty">
        <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
        <span>{qty}</span>
        <button onClick={() => setQty(q => q + 1)}>+</button>
      </div>

      <button 
        className="btn order-btn"
        onClick={() => navigate("/order", { state: { ...product, quantity: qty } })}
      >
        Order Now
      </button>
    </div>
  );
}

export default ProductCard;