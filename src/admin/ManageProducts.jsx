import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetch(`${API}/api/products`)
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const deleteProduct = async (id) => {
    await fetch(`${API}/api/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setProducts(products.filter((p) => p._id !== id));
  };

  return (
    <div>
      <h3>Manage Products</h3>

      {products.map((p) => (
        <div key={p._id} style={{ marginBottom: "10px" }}>
          {p.name} - ₹{p.price}
          <button onClick={() => deleteProduct(p._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default ManageProducts;
