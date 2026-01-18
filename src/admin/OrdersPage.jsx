import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
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
    <div className="admin-container">
      <div className="admin-header">
        <h2>All Orders ({orders.length})</h2>
        <button 
          className="btn" 
          onClick={() => navigate("/admin/dashboard")}
          style={{ marginBottom: "20px" }}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="admin-content">
        <div className="admin-section">
          {orders.map((order) => (
            <div key={order._id} className="card" style={{ marginBottom: "20px" }}>
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
                style={{ marginTop: "10px", padding: "8px", borderRadius: "4px" }}
              >
                <option value="Pending">Pending</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;