import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Package,
  Calendar,
  Hash,
  ExternalLink,
  RefreshCw,
  CreditCard,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
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

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get("/orders/my-orders");
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load your orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <header className="mb-8 sm:mb-10">
          <p className="text-blue-600 font-semibold uppercase tracking-[0.25em] text-xs sm:text-sm">
            My Account
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold mt-2 text-gray-900">
            My Orders
          </h1>
          <p className="text-gray-500 mt-3">
            Track and manage all your purchases.
          </p>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-16 px-8 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900">
              Something went wrong
            </h2>
            <p className="text-gray-500 mt-3">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-semibold transition-colors"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-16 px-8 text-center">
            <div className="h-16 w-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-5">
              <Package size={28} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">No orders yet</h2>
            <p className="text-gray-500 mt-3 max-w-sm mx-auto">
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
          <div className="space-y-4">
              {orders.map((order) => {
                const productName =
                  order.items?.[0]?.name || `Order ${order._id?.slice(-6)}`;
                const itemCount = order.items?.length || 1;

                return (
                  <article
                    key={order._id}
                    className="bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5 px-6 sm:px-8 py-6 hover:border-blue-200 hover:shadow-md transition-all"
                  >
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
                        {order.paymentMethod && <span className="flex items-center gap-1"><CreditCard size={13} className="text-gray-400" />{order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}</span>}
                      </div>
                    </div>

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
                  </article>
                );
              })}
          </div>
        )}
      </div>
    </main>
  );
}
