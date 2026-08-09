import { Link } from "react-router-dom";
import { ArrowRight, Smartphone, Headphones, Watch, Power } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Samsung Galaxy S25 Ultra",
    price: "₹1,09,999",
    oldPrice: "₹1,29,999",
    discount: "15% OFF",
    image: "/images/mobiles/samsung.jpg",
    category: "Smartphones",
    icon: Smartphone,
    color: "bg-blue-50 text-blue-600",
  },
  {
    id: 2,
    name: "Apple iPhone 16 Pro Max",
    price: "₹1,44,900",
    oldPrice: "₹1,59,900",
    discount: "9% OFF",
    image: "/images/mobiles/iphone.jpg",
    category: "Smartphones",
    icon: Smartphone,
    color: "bg-gray-100 text-gray-700",
  },
  {
    id: 3,
    name: "Redmi Note 14 Pro",
    price: "₹29,999",
    oldPrice: "₹34,999",
    discount: "14% OFF",
    image: "/images/mobiles/redmi.jpg",
    category: "Smartphones",
    icon: Smartphone,
    color: "bg-orange-50 text-orange-600",
  },
  {
    id: 4,
    name: "Wireless Earbuds Pro",
    price: "₹4,999",
    oldPrice: "₹7,999",
    discount: "37% OFF",
    image: "/images/accessories/earphones.jpg",
    category: "Accessories",
    icon: Headphones,
    color: "bg-purple-50 text-purple-600",
  },
];

export default function RecommendedProducts() {
  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Recommended For You
          </h2>

          <p className="text-gray-500 mt-1">
            Handpicked products based on your browsing history.
          </p>
        </div>

        <Link
          to="/mobiles"
          className="flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all"
        >
          View All
          <ArrowRight size={18} />
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const Icon = product.icon;

          return (
            <div
              key={product.id}
              className="group bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg hover:border-blue-500 transition-all duration-300"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {product.discount}
                </span>

                <div
                  className={`absolute bottom-4 right-4 h-10 w-10 rounded-full flex items-center justify-center ${product.color}`}
                >
                  <Icon size={18} />
                </div>
              </div>

              <div className="p-5">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                  {product.category}
                </p>

                <h3 className="mt-2 font-semibold text-gray-900 line-clamp-1">
                  {product.name}
                </h3>

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    {product.price}
                  </span>

                  <span className="text-sm text-gray-400 line-through">
                    {product.oldPrice}
                  </span>
                </div>

                <Link
                  to="/mobiles"
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2.5 font-semibold transition"
                >
                  View Details
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
