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

  const updateStatus = async (id, status) => {
    await fetch(`${API}/api/orders/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orderStatus: status }),
    });

    fetchOrders();
  };

  return (
    <div>
      <h3>Orders</h3>

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
    </div>
  );
}

export default ManageOrders;
