import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Calendar,
  Hash,
  MapPin,
  Phone,
  User,
  CreditCard,
  RefreshCw,
  ShoppingBag,
  CheckCircle2,
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

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get(`/orders/${id}`);
      setOrder(data.order);
    } catch (err) {
      const status = err.response?.status;
      const message =
        err.response?.data?.message || "Failed to load order details";

      if (status === 404) {
        setError("Order not found.");
      } else if (status === 401 || status === 403) {
        setError("Your session has expired. Please log in again.");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <Link
          to="/profile/orders"
          className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:gap-3 transition-all"
        >
          <ArrowLeft size={16} />
          Back to Orders
        </Link>

        <header className="mt-4 mb-8 sm:mb-10">
          <p className="text-blue-600 font-semibold uppercase tracking-[0.25em] text-xs sm:text-sm">
            My Account
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold mt-2 text-gray-900">
            Order Details
          </h1>
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
              onClick={fetchOrder}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-semibold transition-colors"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        ) : order ? (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1.5">
                    <Hash size={14} className="text-gray-400" />
                    Order ID: {order._id}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 flex items-center gap-1.5">
                    <Calendar size={14} className="text-gray-400" />
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    statusClasses[order.orderStatus] ||
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.orderStatus || "Pending"}
                </span>
              </div>
            </div>

            {order.orderStatus !== "Cancelled" && (
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
                <h2 className="text-lg font-bold text-gray-900">Order progress</h2>
                <div className="mt-6 flex items-start overflow-x-auto pb-2">
                  {["Pending", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"].map((step, index, steps) => {
                    const currentIndex = ["Pending", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"].indexOf(order.orderStatus);
                    const complete = currentIndex >= index;
                    return <div className="flex min-w-24 flex-1 items-center last:flex-none" key={step}>
                      <div className="flex flex-col items-center text-center"><span className={`h-8 w-8 rounded-full flex items-center justify-center ${complete ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}>{complete ? <CheckCircle2 size={16} /> : index + 1}</span><span className={`mt-2 text-xs font-medium whitespace-nowrap ${complete ? "text-blue-700" : "text-gray-400"}`}>{step}</span></div>
                      {index < steps.length - 1 && <div className={`h-0.5 flex-1 min-w-5 mb-7 ${currentIndex > index ? "bg-blue-600" : "bg-gray-200"}`} />}
                    </div>;
                  })}
                </div>
              </div>
            )}

            {/* Items */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 sm:px-8 py-5 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">
                  Items ({order.items?.length || 0})
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                {order.items?.map((item) => (
                  <div
                    key={item._id || item.productId}
                    className="flex items-center justify-between gap-4 px-6 sm:px-8 py-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {item.image ? <img src={item.image} alt="" className="h-14 w-14 rounded-xl object-cover border border-gray-100" /> : <div className="h-14 w-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><ShoppingBag size={20} /></div>}
                      <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Qty: {item.quantity} · {formatCurrency(item.price)} each
                      </p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="px-6 sm:px-8 py-5 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>Shipping</span>
                  <span>
                    {order.shippingCharge > 0
                      ? formatCurrency(order.shippingCharge)
                      : "Free"}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 mt-3 pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Delivery + Payment */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Delivery Details
                </h2>

                <div className="space-y-3 text-sm">
                  <p className="flex items-center gap-2 text-gray-700">
                    <User size={16} className="text-gray-400" />
                    {order.customerName}
                  </p>
                  <p className="flex items-center gap-2 text-gray-700">
                    <Phone size={16} className="text-gray-400" />
                    {order.phone}
                  </p>
                  <p className="flex items-start gap-2 text-gray-700">
                    <MapPin size={16} className="text-gray-400 mt-0.5" />
                    {order.address}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Payment Details
                </h2>

                <div className="space-y-3 text-sm">
                  <p className="flex items-center gap-2 text-gray-700">
                    <CreditCard size={16} className="text-gray-400" />
                    {order.paymentMethod === "COD"
                      ? "Cash on Delivery"
                      : "Online Payment"}
                  </p>
                  <p className="flex items-center gap-2 text-gray-700">
                    <span className="text-gray-400">Status:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-700"
                          : order.paymentStatus === "Failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.paymentStatus || "Pending"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-16 px-8 text-center"><Package className="mx-auto text-blue-600" size={32} /><h2 className="mt-4 text-xl font-bold text-gray-900">Order not found</h2><Link to="/profile/orders" className="mt-5 inline-flex text-blue-600 font-semibold">Back to Orders</Link></div>
        )}
      </div>
    </main>
  );
}
