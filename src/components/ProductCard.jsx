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

  const handleViewDetails = () => {
    navigate(`/mobiles/${product._id}`);
  };

  return (
    <div className="product-card">
      {product.discountPercent > 0 && (
        <span className="discount-badge">-{product.discountPercent}%</span>
      )}

      <img
        src={product.image}
        alt={product.name}
        onClick={handleViewDetails}
        style={{ cursor: "pointer" }}
      />

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

      <button
        className="btn add-to-cart-btn"
        onClick={() => {
          if (typeof product.stock !== "undefined" && product.stock <= 0) {
            alert("Out of stock");
            return;
          }

          const cartProduct = {
            productId: product._id,
            name: product.name,
            image: product.image,
            price: product.finalPrice ?? product.price ?? product.originalPrice,
            originalPrice: product.originalPrice,
            discountPercent: product.discountPercent || 0,
            stock: product.stock,
          };

          window.addToCart && window.addToCart(cartProduct);
          alert("Added to cart!");
        }}
      >
        Add to Cart
      </button>

      <button className="order-btn" onClick={handleOrder}>
        Order Now
      </button>
    </div>
  );
}

export default ProductCard;
