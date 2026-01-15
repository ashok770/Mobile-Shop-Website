import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

function ManageProducts() {
  const [products, setProducts] = useState([]);

  // Form state
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("mobile");
  const [description, setDescription] = useState("");

  const token = localStorage.getItem("adminToken");

  /* =========================
     FETCH PRODUCTS
  ========================== */
  const fetchProducts = async () => {
    const res = await fetch(`${API}/api/products`);
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* =========================
     ADD PRODUCT
  ========================== */
  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!name || !brand || !price) {
      alert("Please fill required fields");
      return;
    }

    const productData = {
      name,
      brand,
      price: Number(price),
      category,
      description,
    };

    const res = await fetch(`${API}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    if (res.ok) {
      alert("Product added successfully");
      setName("");
      setBrand("");
      setPrice("");
      setCategory("mobile");
      setDescription("");
      fetchProducts();
    } else {
      alert("Failed to add product");
    }
  };

  /* =========================
     DELETE PRODUCT
  ========================== */
  const handleDelete = async (id) => {
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
    <div style={{ padding: "20px" }}>
      <h2>Manage Products</h2>

      {/* ===== ADD PRODUCT FORM ===== */}
      <form
        onSubmit={handleAddProduct}
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
          maxWidth: "500px",
        }}
      >
        <h3>Add New Product</h3>

        <input
          placeholder="Product Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <input
          placeholder="Brand *"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <input
          type="number"
          placeholder="Price *"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        >
          <option value="mobile">Mobile</option>
          <option value="accessory">Accessory</option>
        </select>

        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <button type="submit">Add Product</button>
      </form>

      {/* ===== PRODUCT LIST ===== */}
      <h3>All Products</h3>

      {products.map((p) => (
        <div
          key={p._id}
          style={{
            background: "#fff",
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "6px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <b>{p.name}</b> — ₹{p.price}
            <div style={{ fontSize: "13px", color: "#555" }}>
              {p.brand} | {p.category}
            </div>
          </div>

          <button onClick={() => handleDelete(p._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default ManageProducts;
