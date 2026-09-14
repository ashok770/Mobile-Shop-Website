import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  ShoppingCart, 
  IndianRupee, 
  Package, 
  Clock, 
  Plus, 
  Tag, 
  Layout, 
  Eye 
} from "lucide-react";
import { adminFetch } from "../utils/adminFetch";
import { formatDate } from "../utils/formatDate";
import { formatCurrency } from "../utils/formatCurrency";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalProducts: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [salesData, setSalesData] = useState([]); 

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");

      try {
        const statsRes = await adminFetch(`${API}/api/orders/stats/admin`);
        if (!statsRes.ok) throw new Error("Failed to load order stats");
        const statsData = await statsRes.json();

        const productsRes = await adminFetch(`${API}/api/products`);
        if (!productsRes.ok) throw new Error("Failed to load products");
        const productsData = await productsRes.json();

        const ordersRes = await adminFetch(`${API}/api/orders`);
        if (!ordersRes.ok) throw new Error("Failed to load orders");
        const ordersData = await ordersRes.json();
        
        const ordersArray = Array.isArray(ordersData.orders) ? ordersData.orders : [];

        setStats({
          totalOrders: statsData.totalOrders || 0,
          totalRevenue: statsData.totalRevenue || 0,
          pendingOrders: statsData.pendingOrders || 0,
          totalProducts: Array.isArray(productsData) ? productsData.length : 0
        });

        setRecentOrders(ordersArray.slice(0, 5));

        const productSales = {};
        ordersArray.forEach(order => {
          if (order.orderStatus !== 'Cancelled' && order.items) {
            order.items.forEach(item => {
              if (!productSales[item.productId]) {
                productSales[item.productId] = {
                  id: item.productId,
                  name: item.name,
                  image: item.image,
                  quantity: 0,
                  revenue: 0
                };
              }
              productSales[item.productId].quantity += item.quantity;
              productSales[item.productId].revenue += (item.quantity * item.price);
            });
          }
        });

        const sortedProducts = Object.values(productSales)
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5);
        setTopProducts(sortedProducts);

        const salesByDate = {};
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          salesByDate[dateStr] = 0;
        }

        ordersArray.forEach(order => {
          if (order.orderStatus !== 'Cancelled') {
            const dateStr = new Date(order.createdAt).toISOString().split('T')[0];
            if (salesByDate[dateStr] !== undefined) {
              salesByDate[dateStr] += order.totalAmount;
            }
          }
        });

        const chartData = Object.keys(salesByDate).map(date => ({
          date,
          amount: salesByDate[date]
        }));
        
        setSalesData(chartData);

      } catch (err) {
        console.error(err);
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return { bg: "#fef3c7", text: "#d97706" };
      case "Confirmed":
      case "Packed": return { bg: "#dbeafe", text: "#2563eb" };
      case "Shipped":
      case "Out for Delivery": return { bg: "#e0e7ff", text: "#4f46e5" };
      case "Delivered": return { bg: "#d1fae5", text: "#059669" };
      case "Cancelled": return { bg: "#fee2e2", text: "#dc2626" };
      default: return { bg: "#f3f4f6", text: "#4b5563" };
    }
  };

  const maxSales = salesData.length > 0 ? Math.max(...salesData.map(d => d.amount), 1000) : 1000;
  const svgWidth = 600;
  const svgHeight = 200;
  const points = salesData.map((d, i) => {
    const x = (i / (salesData.length - 1)) * svgWidth;
    const y = svgHeight - (d.amount / maxSales) * svgHeight;
    return `${x},${y}`;
  }).join(" ");

  if (loading) {
    return (
      <div style={{ padding: "40px", display: "flex", justifyContent: "center", color: "#6b7280" }}>
        Loading dashboard data...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#dc2626" }}>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{ padding: "8px 16px", marginTop: "16px", borderRadius: "6px", backgroundColor: "#f3f4f6", border: "1px solid #d1d5db", cursor: "pointer" }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-root" style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <style>{`
        .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 24px; }
        .main-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 24px; }
        .dashboard-card { background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.05); padding: 24px; }
        
        .kpi-icon-wrap { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
        .kpi-label { font-size: 14px; font-weight: 500; color: #6b7280; margin-bottom: 8px; }
        .kpi-value { font-size: 28px; font-weight: 700; color: #111827; line-height: 1.2; }
        
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .section-title { font-size: 16px; font-weight: 600; color: #111827; margin: 0; }
        
        .quick-action-btn { display: flex; align-items: center; gap: 12px; padding: 12px 16px; width: 100%; border: 1px solid #e5e7eb; border-radius: 8px; background: #ffffff; cursor: pointer; color: #374151; font-weight: 500; transition: all 0.2s; text-decoration: none; margin-bottom: 12px; }
        .quick-action-btn:hover { border-color: #2563eb; color: #2563eb; background: #eff6ff; }
        
        .orders-table { width: 100%; border-collapse: collapse; font-size: 14px; }
        .orders-table th { text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-weight: 500; }
        .orders-table td { padding: 16px 12px; border-bottom: 1px solid #e5e7eb; color: #374151; }
        .orders-table tr:last-child td { border-bottom: none; }
        
        .status-badge { padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }

        @media (max-width: 1024px) {
          .kpi-grid { grid-template-columns: repeat(2, 1fr); }
          .main-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .kpi-grid { grid-template-columns: 1fr; }
          .orders-table-wrapper { overflow-x: auto; }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
        <div>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", letterSpacing: "1px", marginBottom: "4px" }}>DASHBOARD</div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#111827", margin: "0 0 8px 0" }}>Welcome back, Admin</h1>
          <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>Here's what's happening with your store today.</p>
        </div>
        
        <div style={{ display: "flex", gap: "8px", background: "#ffffff", padding: "4px", borderRadius: "8px", border: "1px solid #e5e7eb", opacity: 0.7 }}>
          <div style={{ padding: "6px 12px", background: "#f3f4f6", borderRadius: "6px", color: "#111827", fontSize: "13px", fontWeight: 500, cursor: "default" }}>7 Days</div>
          <div style={{ padding: "6px 12px", background: "transparent", borderRadius: "6px", color: "#6b7280", fontSize: "13px", fontWeight: 500, cursor: "default" }}>30 Days</div>
          <div style={{ padding: "6px 12px", background: "transparent", borderRadius: "6px", color: "#6b7280", fontSize: "13px", fontWeight: 500, cursor: "default" }}>3 Months</div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="dashboard-card">
          <div className="kpi-icon-wrap" style={{ background: "#eff6ff", color: "#2563eb" }}><ShoppingCart size={24} /></div>
          <div className="kpi-label">Total Orders</div>
          <div className="kpi-value">{stats.totalOrders}</div>
        </div>
        <div className="dashboard-card">
          <div className="kpi-icon-wrap" style={{ background: "#ecfdf5", color: "#059669" }}><IndianRupee size={24} /></div>
          <div className="kpi-label">Total Revenue</div>
          <div className="kpi-value">{formatCurrency(stats.totalRevenue)}</div>
        </div>
        <div className="dashboard-card">
          <div className="kpi-icon-wrap" style={{ background: "#f5f3ff", color: "#7c3aed" }}><Package size={24} /></div>
          <div className="kpi-label">Total Products</div>
          <div className="kpi-value">{stats.totalProducts}</div>
        </div>
        <div className="dashboard-card">
          <div className="kpi-icon-wrap" style={{ background: "#fffbeb", color: "#d97706" }}><Clock size={24} /></div>
          <div className="kpi-label">Pending Orders</div>
          <div className="kpi-value">{stats.pendingOrders}</div>
        </div>
      </div>

      {/* Middle Grid */}
      <div className="main-grid">
        {/* Sales Overview */}
        <div className="dashboard-card">
          <div className="section-header">
            <h2 className="section-title">Sales Overview</h2>
          </div>
          
          <div style={{ height: "240px", width: "100%", position: "relative", marginTop: "20px" }}>
            {salesData.some(d => d.amount > 0) ? (
              <svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <polygon 
                  points={`0,${svgHeight} ${points} ${svgWidth},${svgHeight}`} 
                  fill="url(#areaGradient)" 
                />
                <polyline 
                  points={points} 
                  fill="none" 
                  stroke="#2563eb" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#9ca3af", background: "#f9fafb", borderRadius: "8px", border: "1px dashed #d1d5db", padding: "24px", textAlign: "center" }}>
                <div style={{ fontWeight: 500, color: "#4b5563", marginBottom: "8px" }}>Not enough sales data yet</div>
                <div style={{ fontSize: "12px" }}>Once your store has enough order history,<br/>your revenue trend will appear here.</div>
                <Link to="/admin/orders" style={{ marginTop: "16px", fontSize: "13px", color: "#2563eb", textDecoration: "none", fontWeight: 500 }}>View Orders</Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card">
          <h2 className="section-title" style={{ marginBottom: "20px" }}>Quick Actions</h2>
          <Link to="/admin/products" className="quick-action-btn">
            <Plus size={18} />
            <span>Add Product</span>
          </Link>
          <Link to="/admin/promotions" className="quick-action-btn">
            <Tag size={18} />
            <span>Create Offer</span>
          </Link>
          <Link to="/admin/homepage" className="quick-action-btn">
            <Layout size={18} />
            <span>Edit Homepage</span>
          </Link>
          <Link to="/admin/orders" className="quick-action-btn" style={{ marginBottom: 0 }}>
            <Eye size={18} />
            <span>View Orders</span>
          </Link>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="main-grid">
        {/* Recent Orders */}
        <div className="dashboard-card" style={{ overflow: "hidden" }}>
          <div className="section-header">
            <h2 className="section-title">Recent Orders</h2>
            <Link to="/admin/orders" style={{ fontSize: "14px", color: "#2563eb", textDecoration: "none", fontWeight: 500 }}>View All</Link>
          </div>
          
          <div className="orders-table-wrapper">
            {recentOrders.length > 0 ? (
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => {
                    const statusColors = getStatusColor(order.orderStatus);
                    return (
                      <tr key={order._id}>
                        <td>
                          <div style={{ fontWeight: 500, color: "#111827", textTransform: "capitalize" }}>{order.customerName || "Unknown Customer"}</div>
                          <div style={{ fontSize: "12px", color: "#6b7280" }}>{order.phone || "No phone provided"}</div>
                        </td>
                        <td>{formatDate ? formatDate(order.createdAt) : new Date(order.createdAt).toLocaleDateString()}</td>
                        <td style={{ fontWeight: 500 }}>{order.totalAmount != null ? formatCurrency(order.totalAmount) : "Unavailable"}</td>
                        <td>
                          <span className="status-badge" style={{ backgroundColor: statusColors.bg, color: statusColors.text }}>
                            {order.orderStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: "32px 0", textAlign: "center", color: "#6b7280" }}>No recent orders found.</div>
            )}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="dashboard-card">
          <h2 className="section-title" style={{ marginBottom: "24px" }}>Top Selling Products</h2>
          
          {topProducts.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {topProducts.map((product, idx) => (
                <div key={product.id} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 600, color: "#6b7280", flexShrink: 0 }}>
                    {idx + 1}
                  </div>
                  <div style={{ width: "48px", height: "48px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                    {product.image ? (
                      <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <Package size={20} color="#9ca3af" />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "14px", fontWeight: 500, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textTransform: "capitalize" }}>{product.name}</div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>{product.quantity} sold</div>
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#111827" }}>
                    {formatCurrency(product.revenue)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: "32px 0", textAlign: "center", color: "#6b7280" }}>No top selling products yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
