import { User, Mail, Calendar, ShoppingBag, Heart, Edit3 } from "lucide-react";
import useAuth from "../../hooks/useAuth";

export default function ProfileCard() {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
      {/* Avatar */}

      <div className="flex flex-col items-center">
        <div className="h-24 w-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold shadow-lg">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <h2 className="mt-5 text-2xl font-bold text-gray-900">{user?.name}</h2>

        <p className="text-gray-500 flex items-center gap-2 mt-1">
          <Mail size={16} />
          {user?.email}
        </p>

        <span className="mt-4 rounded-full bg-blue-50 text-blue-700 px-4 py-1 text-sm font-semibold">
          Premium Customer
        </span>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-3 gap-4 mt-8 border-t pt-6">
        <div className="text-center">
          <Calendar className="mx-auto text-blue-600 mb-2" size={22} />
          <p className="text-xs text-gray-500">Member Since</p>
          <p className="font-semibold">2026</p>
        </div>

        <div className="text-center">
          <ShoppingBag className="mx-auto text-blue-600 mb-2" size={22} />
          <p className="text-xs text-gray-500">Orders</p>
          <p className="font-semibold">12</p>
        </div>

        <div className="text-center">
          <Heart className="mx-auto text-blue-600 mb-2" size={22} />
          <p className="text-xs text-gray-500">Wishlist</p>
          <p className="font-semibold">8</p>
        </div>
      </div>

      <button className="mt-8 w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold flex items-center justify-center gap-2 transition">
        <Edit3 size={18} />
        Edit Profile
      </button>
    </div>
  );
}
