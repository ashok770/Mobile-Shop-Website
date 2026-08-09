import { Link } from "react-router-dom";
import { Package, Heart, MapPin, Settings, ChevronRight } from "lucide-react";

const actions = [
  {
    title: "My Orders",
    description: "Track and manage your purchases",
    icon: Package,
    color: "bg-blue-50 text-blue-600",
    link: "/profile/orders",
  },
  {
    title: "Wishlist",
    description: "Products you've saved",
    icon: Heart,
    color: "bg-pink-50 text-pink-600",
    link: "/profile/wishlist",
  },
  {
    title: "Saved Addresses",
    description: "Manage delivery locations",
    icon: MapPin,
    color: "bg-green-50 text-green-600",
    link: "/profile/addresses",
  },
  {
    title: "Account Settings",
    description: "Security & personal information",
    icon: Settings,
    color: "bg-orange-50 text-orange-600",
    link: "/profile/settings",
  },
];

export default function QuickActions() {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 sm:px-8 py-6 border-b border-gray-100">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Quick Actions
        </h2>

        <p className="text-gray-500 mt-1">
          Everything you need to manage your Ommasta account.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 sm:gap-5 p-6 sm:p-8">
        {actions.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              to={item.link}
              className="group rounded-2xl border border-gray-200 p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-300 bg-white flex flex-col min-h-[160px]"
            >
              <div className="flex justify-between items-start flex-1">
                <div>
                  <div
                    className={`h-14 w-14 rounded-2xl flex items-center justify-center ${item.color} group-hover:scale-105 transition-transform`}
                  >
                    <Icon size={26} />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-gray-900">
                    {item.title}
                  </h3>

                  <p className="text-gray-500 mt-2 text-sm">
                    {item.description}
                  </p>
                </div>

                <ChevronRight
                  className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition"
                  size={22}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
