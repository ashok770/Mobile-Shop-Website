import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProducts } from "../api/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const products = await getProducts();
      const found = products.find((p) => p._id === id);
      setProduct(found);
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="container product-details">
      <img src={product.image} alt={product.name} />

      <div>
        <h2>{product.name}</h2>
        <h3>₹{product.price}</h3>
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
