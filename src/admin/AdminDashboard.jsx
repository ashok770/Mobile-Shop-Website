import { performAdminLogout } from "../utils/adminFetch";
import AdminStats from "./AdminStats";
import ManageProducts from "./ManageProducts";
import ManageOrders from "./ManageOrders";

function AdminDashboard() {
  const handleLogout = async () => {
    await performAdminLogout();
  };

  return (
    <div className="order-page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
        <button
          type="button"
          className="btn danger"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <AdminStats />

      <ManageProducts />
      <hr />
      <ManageOrders />
    </div>
  );
}

export default AdminDashboard;
