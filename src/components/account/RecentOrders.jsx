import { Link } from "react-router-dom";
import {
  ArrowRight,
  Package,
  Calendar,
  Hash,
  ExternalLink,
  RefreshCw,
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
      <div className="recent-orders">
        {/* Section header */}
        <div className="recent-orders__header">
          <div>
            <h2>Recent Orders</h2>
            <p>Track your latest purchases.</p>
          </div>

          <Link to="/profile/orders" className="dash-view-all">
            View All
            <ArrowRight size={18} />
          </Link>
        </div>

        {orders.length === 0 ? (
          /* ── Empty State ── */
          <div className="dash-state">
            <div className="dash-state__icon bg-blue-50 text-blue-600">
              <Package size={28} />
            </div>
            <h2>No orders yet</h2>
            <p>
              When you place your first order, it will appear here for you to
              track.
            </p>
            <Link to="/mobiles" className="dash-state__btn">
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
                <div key={order._id} className="order-row">
                  {/* Product info */}
                  <div className="min-w-0">
                    <p className="order-row__name">{productName}</p>

                    <div className="order-row__meta">
                      <span>
                        <Hash size={13} className="text-gray-400" />
                        {order._id?.slice(-8).toUpperCase() || "N/A"}
                      </span>

                      <span>
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
                  <div className="order-row__right">
                    <span className="order-row__amount">
                      {formatCurrency(order.totalAmount)}
                    </span>

                    <span
                      className={`order-status ${
                        statusClasses[order.orderStatus] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.orderStatus || "Pending"}
                    </span>

                    <Link
                      to={`/profile/orders/${order._id}`}
                      className="order-row__details"
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
