import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, RefreshCw, ArrowRight } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { formatCurrency } from "../../utils/formatCurrency";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get("/wishlist");
      setWishlist(data.wishlist || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await axiosInstance.delete(`/wishlist/${productId}`);
      setWishlist((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove from wishlist");
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <header className="mb-8 sm:mb-10">
          <p className="text-blue-600 font-semibold uppercase tracking-[0.25em] text-xs sm:text-sm">
            My Account
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold mt-2 text-gray-900">
            Wishlist
          </h1>
          <p className="text-gray-500 mt-3">Products you've saved for later.</p>
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
              onClick={fetchWishlist}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-semibold transition-colors"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-16 px-8 text-center">
            <div className="h-16 w-16 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mx-auto mb-5">
              <Heart size={28} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 mt-3 max-w-sm mx-auto">
              Save products you love and find them here later.
            </p>
            <Link
              to="/mobiles"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-semibold transition-colors"
            >
              Browse Products
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {wishlist.map((product) => {
              const image = product.images?.[0] || product.image;
              const price =
                product.finalPrice ?? product.price ?? product.originalPrice;

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link to={`/mobiles/${product._id}`} className="block">
                    <div className="relative">
                      <img
                        src={image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      {product.discountPercent > 0 && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                          {product.discountPercent}% OFF
                        </span>
                      )}
                    </div>
                  </Link>

                  <div className="p-5">
                    <Link to={`/mobiles/${product._id}`}>
                      <h3 className="font-semibold text-gray-900 line-clamp-1 hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="font-bold text-gray-900">
                        {formatCurrency(price)}
                      </span>
                      {product.originalPrice && product.discountPercent > 0 && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Link
                        to={`/mobiles/${product._id}`}
                        className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2.5 text-sm font-semibold text-center transition-colors"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleRemove(product._id)}
                        className="rounded-xl border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 px-3 transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
