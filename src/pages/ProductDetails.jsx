import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProducts } from "../api/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const products = await getProducts();
      const found = products.find((p) => p._id === id);
      setProduct(found);
      if (found) {
        setMainImage(found.images?.[0] || found.image);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p className="product-loading">Loading product...</p>;

  const imageList = product.images || (product.image ? [product.image] : []);
  const displayPrice =
    product.finalPrice ?? product.price ?? product.originalPrice ?? "N/A";

  return (
    <div className="container product-details">
      <div className="product-image-section">
        <img src={mainImage} alt={product.name} className="main-image" />

        {imageList.length > 1 && (
          <div className="image-thumbnails">
            {imageList.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name} ${index + 1}`}
                onClick={() => setMainImage(img)}
                className={`thumbnail ${mainImage === img ? "active" : ""}`}
                style={{
                  cursor: "pointer",
                  opacity: mainImage === img ? 1 : 0.55,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="product-info">
        <h2>{product.name}</h2>

        <div className="product-price-block">
          {product.originalPrice &&
            product.finalPrice &&
            product.discountPercent > 0 && (
              <span className="old-price">₹{product.originalPrice}</span>
            )}
          <span className="current-price">₹{displayPrice}</span>
          {product.discountPercent > 0 && (
            <span className="discount-badge">
              -{product.discountPercent}% OFF
            </span>
          )}
        </div>

        <div className="product-meta">
          <p>
            <b>Brand:</b> {product.brand}
          </p>
          <p>
            <b>Category:</b> {product.category}
          </p>
          {typeof product.stock !== "undefined" && (
            <p>
              <b>Availability:</b>{" "}
              {product.stock > 0 ? (
                <span style={{ color: "var(--success)" }}>In Stock</span>
              ) : (
                <span style={{ color: "var(--accent)" }}>Out of Stock</span>
              )}
            </p>
          )}
        </div>

        <div className="product-actions">
          <button
            className="btn order-btn"
            onClick={() => navigate("/order", { state: product })}
          >
            Order Now
          </button>
          <button
            className="btn add-to-cart-btn"
            style={{ width: "auto", padding: "14px 32px" }}
            onClick={() => {
              if (typeof product.stock !== "undefined" && product.stock <= 0) {
                alert("Out of stock");
                return;
              }
              const cartProduct = {
                productId: product._id,
                name: product.name,
                image: mainImage,
                price: displayPrice,
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
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
