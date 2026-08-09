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
    <div className="quick-actions">
      <div className="quick-actions__header">
        <h2>Quick Actions</h2>
        <p>Everything you need to manage your Ommasta account.</p>
      </div>

      <div className="quick-actions__grid">
        {actions.map((item) => {
          const Icon = item.icon;

          return (
            <Link key={item.title} to={item.link} className="quick-action">
              <div className="quick-action__top">
                <div>
                  <div className={`quick-action__icon ${item.color}`}>
                    <Icon size={26} />
                  </div>

                  <h3 className="quick-action__title">{item.title}</h3>

                  <p className="quick-action__desc">{item.description}</p>
                </div>

                <ChevronRight className="quick-action__arrow" size={22} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
