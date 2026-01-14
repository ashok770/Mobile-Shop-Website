import ManageProducts from "./ManageProducts";
import ManageOrders from "./ManageOrders";

function AdminDashboard() {
  return (
    <div className="order-page">
      <h2>Admin Dashboard</h2>

      <ManageProducts />
      <hr />
      <ManageOrders />
    </div>
  );
}

export default AdminDashboard;
