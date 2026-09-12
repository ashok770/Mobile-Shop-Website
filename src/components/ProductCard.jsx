import { Link } from "react-router-dom";
import { useState } from "react";

function ProductCard({ product }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const rawPrice = product.finalPrice ?? product.price ?? product.originalPrice ?? 0;
  
  const formatPrice = (price) => {
    if (isNaN(price) || price === "N/A" || price === 0) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const displayPrice = formatPrice(rawPrice);
  const image = product.images?.[0] || product.image;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (typeof product.stock !== "undefined" && product.stock <= 0) {
      alert("Out of stock");
      return;
    }
    const cartProduct = {
      productId: product._id,
      name: product.name,
      image,
      price: rawPrice,
      originalPrice: product.originalPrice,
      discountPercent: product.discountPercent || 0,
      stock: product.stock,
    };
    window.addToCart && window.addToCart(cartProduct);
    alert("Added to cart!");
  };

  return (
    <Link to={`/mobiles/${product._id}`} className="product-card group">
      {product.discountPercent > 0 && (
        <span className="discount-badge">{product.discountPercent}% OFF</span>
      )}

      <img 
        src={image} 
        alt={product.name} 
        className={`product-image ${imageLoaded ? "loaded" : "skeleton-shimmer"}`}
        onLoad={() => setImageLoaded(true)}
      />

      <h3 className="product-card__name group-hover:text-blue-600 transition-colors duration-200">{product.name}</h3>
      
      {product.rating && (
        <div className="flex items-center gap-1 mb-1">
           <span className="text-yellow-500 text-[13px]">★</span>
           <span className="text-[12px] font-medium text-slate-600">{product.rating} {product.reviewsCount ? `(${product.reviewsCount})` : ""}</span>
        </div>
      )}

      <div className="product-card__price">
        {product.originalPrice && product.discountPercent > 0 && (
          <span className="price-meta">
            <span className="old-price">{formatPrice(product.originalPrice)}</span>
            <span className="discount-percent">
              {product.discountPercent}% OFF
            </span>
          </span>
        )}
        <span className="new-price">{displayPrice}</span>
      </div>

      <div className="card-actions">
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
    </Link>
  );
}

export default ProductCard;
