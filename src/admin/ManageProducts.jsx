import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

function ManageProducts() {
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

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
      document.querySelector('input[type="file"]').value = "";
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

      {/* Edit form - moved outside the map */}
      {editingProduct && (
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
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            });

            setEditingProduct(null);
            setImage(null);
            fetchProducts();
          }}
          className="card"
        >
          <h4>Edit Product</h4>

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
              setEditingProduct({
                ...editingProduct,
                price: e.target.value,
              })
            }
          />

          <input
            value={editingProduct.brand}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                brand: e.target.value,
              })
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
            onChange={(e) => setImage(e.target.files[0])}
          />

          <button className="btn primary">Update</button>
          <button
            type="button"
            className="btn"
            onClick={() => setEditingProduct(null)}
          >
            Cancel
          </button>
        </form>
      )}

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
          <button className="btn" onClick={() => setEditingProduct(p)}>
            Edit
          </button>
        </div>
      ))}
    </div>
  );
}

export default ManageProducts;
