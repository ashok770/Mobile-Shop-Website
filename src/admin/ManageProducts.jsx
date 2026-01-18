import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

function ManageProducts() {
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("mobile");
  const [image, setImage] = useState(null);

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
    <div>
      <h3>Manage Products</h3>

      {/* Add product form */}
      <form onSubmit={addProduct} className="card">
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

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
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

      {/* Product list */}
      <h4>All Products</h4>

      {products.map((p) => (
        <div key={p._id} className="card">
          <strong>{p.name}</strong> — ₹{p.price}
          <div>
            {p.brand} | {p.category}
          </div>
          {p.image && (
            <img
              src={p.image}
              alt={p.name}
              style={{ width: "120px", marginTop: "10px" }}
            />
          )}
          <button
            className="btn"
            onClick={() => deleteProduct(p._id)}
            style={{ marginTop: "10px" }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default ManageProducts;
