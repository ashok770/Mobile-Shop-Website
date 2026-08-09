import { Link } from "react-router-dom";
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
    <div className="profile-card">
      <div className="profile-card__accent" />

      <div className="profile-card__body">
        {/* Avatar */}
        <div className="profile-card__avatar-wrap">
          <div className="profile-card__avatar">
            <div className="profile-card__avatar-circle">{initial}</div>
            <span className="profile-card__online" />
          </div>

          <h2 className="profile-card__name">{user?.name}</h2>

          <p className="profile-card__email">
            <Mail size={14} />
            {user?.email}
          </p>

          <span className="profile-card__badge">
            <Award size={14} />
            Premium Customer
          </span>
        </div>

        {/* Stats */}
        <div className="profile-card__stats">
          <div className="profile-stat">
            <div className="profile-stat__icon bg-blue-50 text-blue-600">
              <Calendar size={20} />
            </div>
            <p className="profile-stat__label">Member Since</p>
            <p className="profile-stat__value">{memberSince}</p>
          </div>

          <div className="profile-stat">
            <div className="profile-stat__icon bg-indigo-50 text-indigo-600">
              <ShoppingBag size={20} />
            </div>
            <p className="profile-stat__label">Orders</p>
            <p className="profile-stat__value">{orders}</p>
          </div>

          <div className="profile-stat">
            <div className="profile-stat__icon bg-pink-50 text-pink-600">
              <Heart size={20} />
            </div>
            <p className="profile-stat__label">Wishlist</p>
            <p className="profile-stat__value">{wishlist}</p>
          </div>
        </div>

        <Link to="/profile/settings" className="profile-card__edit">
          <Edit3 size={18} />
          Edit Profile
        </Link>
      </div>
    </div>
  );
}
