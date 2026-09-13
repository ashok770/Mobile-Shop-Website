import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminFetch, performAdminLogout } from "../utils/adminFetch";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await adminFetch(`${API}/api/orders`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to load orders.");
      }

      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (error) {
      setOrders([]);
      setError(error.message || "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (id, orderStatus) => {
    setError("");

    try {
      const res = await adminFetch(`${API}/api/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderStatus }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to update the order.");
      }

      fetchOrders();
    } catch (error) {
      setError(error.message || "Unable to update the order.");
    }
  };

  const handleLogout = async () => {
    await performAdminLogout();
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>All Orders ({orders.length})</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <button
            className="btn"
            onClick={() => navigate("/admin/dashboard")}
          >
            ← Back to Dashboard
          </button>
          <button
            className="btn danger"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-section">
          {loading && <p>Loading orders...</p>}
          {error && <p role="alert">{error}</p>}
          {!loading && !error && orders.length === 0 && <p>No orders found.</p>}
          {!loading && !error && orders.length > 0 && (
            orders.map((order) => (
              <div
                key={order._id}
                className="card"
                style={{ marginBottom: "20px" }}
              >
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
                  style={{
                    marginTop: "10px",
                    padding: "8px",
                    borderRadius: "4px",
                  }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;
