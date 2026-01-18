import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("adminToken");

  const fetchOrders = async () => {
    const res = await fetch(`${API}/api/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (id, orderStatus) => {
    await fetch(`${API}/api/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orderStatus }),
    });

    fetchOrders();
  };

  return (
    <div>
      <h3>Orders</h3>

      {orders.map((order) => (
        <div key={order._id} className="card">
          <h4>{order.customerName}</h4>
          <p>📞 {order.phone}</p>
          <p>📍 {order.address}</p>

          <p>
            <b>Payment:</b> {order.paymentMethod} ({order.paymentStatus})
          </p>

          <div>
            <b>Items:</b>
            {order.items.map((item, i) => (
              <p key={i}>
                {item.name} × {item.quantity} — ₹{item.price}
              </p>
            ))}
          </div>

          <p>
            <b>Order Status:</b> {order.orderStatus}
          </p>

          <select
            value={order.orderStatus}
            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      ))}
    </div>
  );
}

export default ManageOrders;
