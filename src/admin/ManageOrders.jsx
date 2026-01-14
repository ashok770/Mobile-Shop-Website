import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetch(`${API}/api/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setOrders);
  }, []);

  const markDelivered = async (id) => {
    await fetch(`${API}/api/orders/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderStatus: "Delivered" }),
    });

    setOrders(
      orders.map((o) => (o._id === id ? { ...o, orderStatus: "Delivered" } : o))
    );
  };

  return (
    <div>
      <h3>Orders</h3>

      {orders.map((o) => (
        <div key={o._id} style={{ marginBottom: "10px" }}>
          <b>{o.customerName}</b> — {o.orderStatus}
          {o.orderStatus === "Pending" && (
            <button onClick={() => markDelivered(o._id)}>Mark Delivered</button>
          )}
        </div>
      ))}
    </div>
  );
}

export default ManageOrders;
