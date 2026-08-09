import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("adminToken");

  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

  const updateStatus = async (id, status) => {
    setError("");

    try {
      const res = await fetch(`${API}/api/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderStatus: status }),
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

  return (
    <div>
      <h3>Orders</h3>

      {loading && <p>Loading orders...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && orders.length === 0 && <p>No orders found.</p>}

      {!loading && !error && orders.length > 0 && (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Phone</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => {
              const item = order.items[0];
              const total = item.price * item.quantity;

              return (
                <tr key={order._id}>
                  <td>{order.customerName}</td>
                  <td>{order.phone}</td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>₹{total}</td>
                  <td>
                    <span className={`status ${order.orderStatus}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        updateStatus(order._id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManageOrders;
