import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import ProductCard from "../ProductCard";

export default function RecommendedProducts({ products = [] }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Recommended For You
          </h2>

          <p className="text-gray-500 mt-1">
            Handpicked products based on your browsing history.
          </p>
        </div>

        <Link
          to="/mobiles"
          className="flex items-center gap-1.5 text-blue-600 font-semibold text-sm sm:text-base hover:gap-2.5 transition-all"
        >
          View All
          <ArrowRight size={18} />
        </Link>
      </div>

      {products.length === 0 ? (
        /* ── Empty State ── */
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-16 px-8 text-center">
          <div className="h-16 w-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-5">
            <Sparkles size={26} />
          </div>

          <h3 className="text-lg font-bold text-gray-900">
            No recommendations yet
          </h3>

          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            Browse our latest products — recommendations will appear here as you
            explore.
          </p>

          <Link
            to="/mobiles"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-semibold transition-colors"
          >
            Explore Products
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
