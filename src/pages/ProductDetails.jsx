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

  if (!product) return <p>Loading...</p>;

  const imageList = product.images || (product.image ? [product.image] : []);

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
                className="thumbnail"
                style={{
                  cursor: "pointer",
                  opacity: mainImage === img ? 1 : 0.6,
                  border:
                    mainImage === img ? "2px solid #ff6b35" : "2px solid #ddd",
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2>{product.name}</h2>
        <h3>
          {product.originalPrice &&
            product.finalPrice &&
            product.discountPercent > 0 && (
              <span className="old-price">₹{product.originalPrice}</span>
            )}
          ₹
          {product.finalPrice ??
            product.price ??
            product.originalPrice ??
            "N/A"}
        </h3>
        {product.discountPercent > 0 && (
          <span className="discount-badge">-{product.discountPercent}%</span>
        )}
        <p>
          <b>Brand:</b> {product.brand}
        </p>
        <p>
          <b>Category:</b> {product.category}
        </p>

        <button
          className="btn order-btn"
          onClick={() => navigate("/order", { state: product })}
        >
          Order Now
        </button>
      </div>
    </div>
  );
}

export default ProductDetails;
