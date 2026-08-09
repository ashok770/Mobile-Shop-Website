import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import axiosInstance from "../../utils/axiosInstance";
import ProfileCard from "../../components/account/ProfileCard";
import QuickActions from "../../components/account/QuickActions";
import RecentOrders from "../../components/account/RecentOrders";
import RecommendedProducts from "../../components/account/RecommendedProducts";
import "./dashboard.css";

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
    <main className="dashboard-shell">
      <div className="dashboard-container">
        {/* ── Dashboard Header ── */}
        <header className="dashboard-header">
          <span className="dashboard-header__eyebrow">My Account</span>

          <h1>Welcome Back, {firstName} 👋</h1>

          <p>
            Manage your profile, orders, wishlist and account settings from one
            place.
          </p>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="dash-state">
            <div className="dash-state__icon bg-red-50 text-red-600 text-3xl">
              ⚠️
            </div>
            <h2>Something went wrong</h2>
            <p>{error}</p>
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
            <section className="recommended-section">
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
