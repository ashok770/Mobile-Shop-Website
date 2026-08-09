import { Link } from "react-router-dom";
import {
  ArrowRight,
  Package,
  Calendar,
  Hash,
  ExternalLink,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

const statusClasses = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Packed: "bg-indigo-100 text-indigo-700",
  Shipped: "bg-purple-100 text-purple-700",
  "Out for Delivery": "bg-orange-100 text-orange-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function RecentOrders({ orders = [] }) {
  return (
    <section>
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Section header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Recent Orders
            </h2>

            <p className="text-gray-500 mt-1">Track your latest purchases.</p>
          </div>

          <Link
            to="/profile/orders"
            className="flex items-center gap-1.5 text-blue-600 font-semibold text-sm sm:text-base hover:gap-2.5 transition-all"
          >
            View All
            <ArrowRight size={18} />
          </Link>
        </div>

        {orders.length === 0 ? (
          /* ── Empty State ── */
          <div className="py-16 px-8 text-center">
            <div className="h-16 w-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-5">
              <Package size={28} />
            </div>

            <h3 className="text-lg font-bold text-gray-900">No orders yet</h3>

            <p className="text-gray-500 mt-2 max-w-sm mx-auto">
              When you place your first order, it will appear here for you to
              track.
            </p>

            <Link
              to="/mobiles"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-semibold transition-colors"
            >
              Start Shopping
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          /* ── Order Rows ── */
          <div className="divide-y divide-gray-100">
            {orders.map((order) => {
              const productName =
                order.items?.[0]?.name || `Order ${order._id?.slice(-6)}`;
              const itemCount = order.items?.length || 1;

              return (
                <div
                  key={order._id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 px-6 sm:px-8 py-5 hover:bg-gray-50 transition-colors"
                >
                  {/* Product info */}
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {productName}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Hash size={13} className="text-gray-400" />
                        {order._id?.slice(-8).toUpperCase() || "N/A"}
                      </span>

                      <span className="flex items-center gap-1">
                        <Calendar size={13} className="text-gray-400" />
                        {formatDate(order.createdAt)}
                      </span>

                      {itemCount > 1 && (
                        <span>
                          {itemCount} {itemCount > 1 ? "items" : "item"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Amount + status */}
                  <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </span>

                    <span
                      className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold ${
                        statusClasses[order.orderStatus] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.orderStatus || "Pending"}
                    </span>

                    <Link
                      to={`/profile/orders/${order._id}`}
                      className="inline-flex items-center gap-1.5 text-blue-600 font-semibold text-sm hover:underline"
                    >
                      View Details
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
