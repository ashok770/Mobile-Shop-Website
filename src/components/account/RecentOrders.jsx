import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const orders = [
  {
    id: "#ORD-1001",
    product: "Samsung Galaxy S25 Ultra",
    date: "02 Aug 2026",
    total: "₹1,09,999",
    status: "Delivered",
  },
  {
    id: "#ORD-1002",
    product: "OnePlus Buds Pro 3",
    date: "28 Jul 2026",
    total: "₹11,999",
    status: "Shipped",
  },
  {
    id: "#ORD-1003",
    product: "Apple MagSafe Charger",
    date: "20 Jul 2026",
    total: "₹4,999",
    status: "Processing",
  },
];

const statusClasses = {
  Delivered: "bg-green-100 text-green-700",
  Shipped: "bg-blue-100 text-blue-700",
  Processing: "bg-yellow-100 text-yellow-700",
};

export default function RecentOrders() {
  return (
    <section className="mt-10">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-8 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>

            <p className="text-gray-500 mt-1">Track your latest purchases.</p>
          </div>

          <Link
            to="/profile/orders"
            className="flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all"
          >
            View All
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="divide-y divide-gray-100">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 hover:bg-gray-50 transition"
            >
              <div>
                <p className="font-semibold text-gray-900">{order.product}</p>

                <p className="text-sm text-gray-500 mt-1">
                  Order ID: {order.id}
                </p>

                <p className="text-sm text-gray-500">{order.date}</p>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <span className="font-semibold text-gray-900">
                  {order.total}
                </span>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${statusClasses[order.status]}`}
                >
                  {order.status}
                </span>

                <Link
                  to={`/profile/orders/${order.id}`}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
