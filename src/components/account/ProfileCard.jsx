import { Mail, Calendar, ShoppingBag, Heart, Edit3, Award } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { formatDate } from "../../utils/formatDate";

export default function ProfileCard({ stats }) {
  const { user } = useAuth();

  const memberSince = user?.createdAt ? formatDate(user.createdAt) : "—";
  const orders = stats?.totalOrders ?? 0;
  const wishlist = stats?.wishlist ?? user?.wishlist?.length ?? 0;
  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Top accent */}
      <div className="h-1.5 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400" />

      <div className="p-6 sm:p-8">
        {/* Avatar */}
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold shadow-lg ring-4 ring-blue-100">
              {initial}
            </div>

            <span className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-green-500 border-4 border-white shadow-sm" />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-gray-900">
            {user?.name}
          </h2>

          <p className="text-gray-500 flex items-center justify-center gap-2 mt-1">
            <Mail size={16} className="text-gray-400" />
            {user?.email}
          </p>

          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-700 px-4 py-1.5 text-sm font-semibold">
            <Award size={14} />
            Premium Customer
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-8 border-t border-gray-100 pt-6">
          <div className="text-center">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
              <Calendar size={20} />
            </div>
            <p className="text-xs text-gray-500 font-medium">Member Since</p>
            <p className="font-semibold text-gray-900 mt-0.5">{memberSince}</p>
          </div>

          <div className="text-center">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2">
              <ShoppingBag size={20} />
            </div>
            <p className="text-xs text-gray-500 font-medium">Orders</p>
            <p className="font-semibold text-gray-900 mt-0.5">{orders}</p>
          </div>

          <div className="text-center">
            <div className="h-10 w-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mx-auto mb-2">
              <Heart size={20} />
            </div>
            <p className="text-xs text-gray-500 font-medium">Wishlist</p>
            <p className="font-semibold text-gray-900 mt-0.5">{wishlist}</p>
          </div>
        </div>

        <button className="mt-8 w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold flex items-center justify-center gap-2 transition-colors">
          <Edit3 size={18} />
          Edit Profile
        </button>
      </div>
    </div>
  );
}
