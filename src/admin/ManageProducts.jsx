import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

function ManageProducts() {
  const [products, setProducts] = useState([]);

  // Add product states
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("mobile");
  const [image, setImage] = useState(null);

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

    if (!name || !price || !category) {
      alert("Please fill required fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("brand", brand);
    formData.append("price", price);
    formData.append("category", category);
    if (image) formData.append("image", image);

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
      setPrice("");
      setCategory("mobile");
      setImage(null);
      fetchProducts();
    } else {
      alert("Failed to add product");
    }
  };

  // ==========================
  // Update product
  // ==========================
  const updateProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", editingProduct.name);
    formData.append("brand", editingProduct.brand);
    formData.append("price", editingProduct.price);
    formData.append("category", editingProduct.category);
    if (image) formData.append("image", image);

    await fetch(`${API}/api/products/${editingProduct._id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    setEditingProduct(null);
    setImage(null);
    fetchProducts();
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
      <h3 className="section-title">Manage Products</h3>

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
            placeholder="Price *"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

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
            onChange={(e) => setImage(e.target.files[0])}
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
              formData.append("price", editingProduct.price);
              formData.append("brand", editingProduct.brand);
              formData.append("category", editingProduct.category);
              if (image) formData.append("image", image);

              await fetch(`${API}/api/products/${editingProduct._id}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
              });

              setEditingProduct(null);
              setImage(null);
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
              type="number"
              value={editingProduct.price}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, price: e.target.value })
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

            <input type="file" onChange={(e) => setImage(e.target.files[0])} />

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
            <p className="price">₹{p.price}</p>
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
