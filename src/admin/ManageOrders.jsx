import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

function ManageOrders() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const fetchStats = async () => {
    const res = await fetch(`${API}/api/orders/stats/admin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setStats(data);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div>
      <h3>Orders Management</h3>

      {/* Stats Summary */}
      {stats && (
        <div className="admin-stats">
          <div className="stat-card">
            <h4>Total Orders</h4>
            <p>{stats.totalOrders}</p>
          </div>
          <div className="stat-card">
            <h4>Pending Orders</h4>
            <p>{stats.pendingOrders}</p>
          </div>
          <div className="stat-card">
            <h4>Delivered Orders</h4>
            <p>{stats.deliveredOrders}</p>
          </div>
          <div className="stat-card">
            <h4>Total Revenue</h4>
            <p>₹{stats.totalRevenue}</p>
          </div>
        </div>
      )}

      {/* View Orders Button */}
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button 
          className="btn primary"
          onClick={() => navigate("/admin/orders")}
        >
          View All Orders
        </button>
      </div>
    </div>
  );
}

export default ManageOrders;
