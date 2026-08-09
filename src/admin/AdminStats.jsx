import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

function AdminStats() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchStats = async () => {
      setError("");

      try {
        const res = await fetch(`${API}/api/orders/stats/admin`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Unable to load order statistics.");
        }

        setStats(data);
      } catch (error) {
        setStats(null);
        setError(error.message || "Unable to load order statistics.");
      }
    };

    fetchStats();
  }, []);

  if (error) return <p role="alert">{error}</p>;
  if (!stats) return <p>Loading order statistics...</p>;

  return (
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
  );
}

export default AdminStats;
