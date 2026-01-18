import { useState } from "react";
import ManageProducts from "./ManageProducts";
import ManageOrders from "./ManageOrders";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2 className="admin-title">Admin Dashboard</h2>
        <p className="admin-subtitle">Manage your mobile shop inventory and orders</p>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          Products
        </button>
        <button 
          className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
      </div>

      <div className="admin-content">
        {activeTab === "products" && (
          <section className="admin-section">
            <ManageProducts />
          </section>
        )}
        
        {activeTab === "orders" && (
          <section className="admin-section">
            <ManageOrders />
          </section>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
