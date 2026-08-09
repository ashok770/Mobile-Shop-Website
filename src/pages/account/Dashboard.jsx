import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import axiosInstance from "../../utils/axiosInstance";
import ProfileCard from "../../components/account/ProfileCard";
import QuickActions from "../../components/account/QuickActions";
import RecentOrders from "../../components/account/RecentOrders";
import RecommendedProducts from "../../components/account/RecommendedProducts";

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await axiosInstance.get("/dashboard");
        setDashboardData(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* ── Dashboard Header ── */}
        <header className="mb-10 sm:mb-12">
          <p className="text-blue-600 font-semibold uppercase tracking-[0.25em] text-xs sm:text-sm">
            My Account
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold mt-2 text-gray-900">
            Welcome Back, {firstName} 👋
          </h1>

          <p className="text-gray-500 mt-3 max-w-2xl">
            Manage your profile, orders, wishlist and account settings from one
            place.
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
          </div>
        ) : (
          <>
            {/* ── Main Account Overview ── */}
            <section className="grid lg:grid-cols-12 gap-6 lg:gap-8">
              {/* Profile Card — ~33% */}
              <div className="lg:col-span-4">
                <ProfileCard stats={dashboardData?.stats} />
              </div>

              {/* Quick Actions — ~67% */}
              <div className="lg:col-span-8">
                <QuickActions />
              </div>
            </section>

            {/* ── Recent Orders ── */}
            <section className="mt-10 sm:mt-12">
              <RecentOrders orders={dashboardData?.recentOrders || []} />
            </section>

            {/* ── Recommended For You ── */}
            <section className="mt-10 sm:mt-12 pb-8">
              <RecommendedProducts
                products={dashboardData?.recommendedProducts || []}
              />
            </section>
          </>
        )}
      </div>
    </main>
  );
}
