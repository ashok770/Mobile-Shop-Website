import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

function ManageProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // Add product states
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [offerType, setOfferType] = useState("NONE");
  const [category, setCategory] = useState("mobile");
  const [images, setImages] = useState([]);
  const [stock, setStock] = useState(0);

  // Edit product state
  const [editingProduct, setEditingProduct] = useState(null);

  const token = localStorage.getItem("adminToken");

  // ==========================
  // Fetch products
  // ==========================
  const fetchProducts = async () => {
    const res = await fetch(`${API}/api/products`);
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ==========================
  // Add product
  // ==========================
  const addProduct = async (e) => {
    e.preventDefault();

    if (!name || !originalPrice || !category) {
      alert("Please fill required fields");
      return;
    }

    if (images.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("brand", brand);
    formData.append("originalPrice", originalPrice);
    formData.append("discountPercent", discountPercent);
    formData.append("offerType", offerType);
    formData.append("category", category);
    formData.append("stock", stock);

    // Append multiple images
    images.forEach((file) => {
      formData.append("images", file);
    });

    const res = await fetch(`${API}/api/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.ok) {
      setName("");
      setBrand("");
      setOriginalPrice("");
      setDiscountPercent(0);
      setOfferType("NONE");
      setCategory("mobile");
      setImages([]);
      fetchProducts();
    } else {
      alert("Failed to add product");
    }
  };

  // ==========================
  // Delete product
  // ==========================
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await fetch(`${API}/api/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchProducts();
  };

  return (
    <div className="admin-products">
      <div className="section-header">
        <h3 className="section-title">Manage Products</h3>
        <button
          className="btn primary view-orders-btn"
          onClick={() => navigate("/admin/orders")}
        >
          View Orders
        </button>
      </div>

      {/* Add product */}
      <div className="card form-card">
        <h4>Add New Product</h4>

        <form onSubmit={addProduct} className="product-form">
          <input
            placeholder="Product Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />

          <input
            type="number"
            placeholder="Original Price *"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
          />

          <input
            type="number"
            placeholder="Stock Quantity"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />

          <input
            type="number"
            placeholder="Discount %"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
          />

          <select
            value={offerType}
            onChange={(e) => setOfferType(e.target.value)}
          >
            <option value="NONE">No Offer</option>
            <option value="MEGA_FLASH_SALE">Mega Flash Sale</option>
            <option value="BUY_1_GET_1">Buy 1 Get 1 Free</option>
            <option value="DAILY_SPECIAL">Daily Special</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="mobile">Mobile</option>
            <option value="accessory">Accessory</option>
          </select>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(Array.from(e.target.files))}
          />

          <button className="btn primary">Add Product</button>
        </form>
      </div>

      {/* Edit product */}
      {editingProduct && (
        <div className="card form-card">
          <h4>Edit Product</h4>

          <form
            onSubmit={async (e) => {
              e.preventDefault();

              const formData = new FormData();
              formData.append("name", editingProduct.name);
              formData.append("brand", editingProduct.brand);
              formData.append(
                "originalPrice",
                editingProduct.originalPrice || editingProduct.price,
              );
              formData.append(
                "discountPercent",
                editingProduct.discountPercent || 0,
              );
              formData.append("offerType", editingProduct.offerType || "NONE");
              formData.append("category", editingProduct.category);
              formData.append("stock", editingProduct.stock || 0);

              // Append multiple images if selected
              if (images.length > 0) {
                images.forEach((file) => {
                  formData.append("images", file);
                });
              }

              await fetch(`${API}/api/products/${editingProduct._id}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
              });

              setEditingProduct(null);
              setImages([]);
              fetchProducts();
            }}
            className="product-form"
          >
            <input
              value={editingProduct.name}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, name: e.target.value })
              }
            />

            <input
              placeholder="Original Price"
              type="number"
              value={editingProduct.originalPrice || editingProduct.price || ""}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  originalPrice: e.target.value,
                })
              }
            />

            <input
              type="number"
              placeholder="Stock Quantity"
              value={editingProduct.stock || 0}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, stock: e.target.value })
              }
            />

            <input
              value={editingProduct.brand}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, brand: e.target.value })
              }
            />

            <select
              value={editingProduct.category}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  category: e.target.value,
                })
              }
            >
              <option value="mobile">Mobile</option>
              <option value="accessory">Accessory</option>
            </select>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setImages(Array.from(e.target.files))}
            />

            <div className="action-row">
              <button className="btn primary">Update</button>
              <button
                type="button"
                className="btn"
                onClick={() => setEditingProduct(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Product grid */}
      <h4 className="section-title">All Products</h4>

      <div className="product-grid">
        {products.map((p) => (
          <div key={p._id} className="product-card">
            {p.image && <img src={p.image} alt={p.name} />}
            <h4>{p.name}</h4>
            <p>
              {p.originalPrice && p.finalPrice && (
                <span className="old-price">₹{p.originalPrice}</span>
              )}
              <strong>
                ₹{p.finalPrice ?? p.price ?? p.originalPrice ?? "N/A"}
              </strong>
            </p>

            <p>
              <small>Stock: {p.stock ?? 0}</small>
            </p>

            {p.discountPercent > 0 && (
              <span className="discount-badge">-{p.discountPercent}%</span>
            )}
            <small>
              {p.brand} | {p.category}
            </small>

            <div className="action-row">
              <button className="btn" onClick={() => setEditingProduct(p)}>
                Edit
              </button>
              <button
                className="btn danger"
                onClick={() => deleteProduct(p._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageProducts;
