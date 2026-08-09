import ProfileCard from "../../components/account/ProfileCard";
import QuickActions from "../../components/account/QuickActions";
import RecentOrders from "../../components/account/RecentOrders";
import RecommendedProducts from "../../components/account/RecommendedProducts";

export default function Dashboard() {
  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero */}

      <section className="max-w-7xl mx-auto px-6 pt-10">
        <div className="mb-10">
          <p className="text-blue-600 font-semibold uppercase tracking-[0.25em] text-sm">
            My Account
          </p>

          <h1 className="text-4xl font-bold mt-2 text-gray-900">
            Welcome Back 👋
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your profile, orders, wishlist and account settings from one
            place.
          </p>
        </div>

        {/* Top Grid */}

        <div className="grid lg:grid-cols-3 gap-8">
          <div>
            <ProfileCard />
          </div>

          <div className="lg:col-span-2">
            <QuickActions />
          </div>
        </div>

        {/* Orders */}

        <div className="mt-8">
          <RecentOrders />
        </div>

        {/* Recommendations */}

        <div className="mt-8 pb-16">
          <RecommendedProducts />
        </div>
      </section>
    </main>
  );
}
