import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Tags, 
  Home, 
  Star, 
  Wrench, 
  Users, 
  Settings, 
  LogOut,
  X
} from "lucide-react";
import { useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const NAV_SECTIONS = [
  {
    title: "MAIN NAVIGATION",
    items: [
      { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Products", path: "/admin/products", icon: Package },
      { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
    ]
  },
  {
    title: "STORE",
    items: [
      { name: "Promotions", path: "/admin/promotions", icon: Tags },
      { name: "Homepage", path: "/admin/homepage", icon: Home },
      { name: "Brands", path: "/admin/brands", icon: Star },
      { name: "Services", path: "/admin/services", icon: Wrench },
    ]
  },
  {
    title: "MANAGEMENT",
    items: [
      { name: "Customers", path: "/admin/customers", icon: Users },
      { name: "Settings", path: "/admin/settings", icon: Settings },
    ]
  }
];

function AdminSidebar({ isMobileOpen, closeMobileMenu }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (token) {
        await fetch(`${API}/api/admin/logout`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
      }
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.removeItem("adminToken");
      setLoggingOut(false);
      navigate("/admin/login", { replace: true });
    }
  };

  const currentPath = location.pathname;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={closeMobileMenu}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 40,
            backdropFilter: "blur(2px)",
            transition: "opacity 0.2s"
          }}
        />
      )}

      {/* Sidebar Drawer */}
      <aside 
        style={{
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          width: "250px",
          backgroundColor: "#111827",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          transform: isMobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.2s ease-in-out",
          boxShadow: isMobileOpen ? "4px 0 24px rgba(0,0,0,0.2)" : "none",
        }}
        className="admin-sidebar-desktop"
      >
        <style>{`
          @media (min-width: 1024px) {
            .admin-sidebar-desktop {
              position: sticky !important;
              transform: translateX(0) !important;
              height: 100vh;
            }
          }
          .admin-nav-item:hover {
            background-color: rgba(255, 255, 255, 0.05);
          }
          .admin-logout-btn:hover {
            background-color: rgba(220, 38, 38, 0.1);
            color: #ef4444;
          }
          .admin-logout-btn:hover svg {
            color: #ef4444 !important;
          }
        `}</style>

        {/* Header Branding */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img 
              src="/images/logo.png" 
              alt="Ommastra Logo" 
              style={{ height: "32px", width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)" }} 
            />
            <div>
              <div style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "0.5px", lineHeight: 1.1 }}>OMMASTRA</div>
              <div style={{ fontSize: "10px", fontWeight: 600, color: "#9ca3af", letterSpacing: "1px" }}>ADMIN PORTAL</div>
            </div>
          </div>
          {/* Mobile close button */}
          <button 
            onClick={closeMobileMenu}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              color: "#9ca3af",
              cursor: "pointer",
              padding: "4px"
            }}
            className="mobile-close-btn"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
          <style>{`
            @media (min-width: 1024px) {
              .mobile-close-btn { display: none !important; }
            }
          `}</style>
        </div>

        {/* Navigation */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 24px 12px" }}>
          {NAV_SECTIONS.map((section, idx) => (
            <div key={idx} style={{ marginBottom: "24px" }}>
              <div style={{ padding: "0 12px", fontSize: "11px", fontWeight: 600, color: "#6b7280", marginBottom: "8px", letterSpacing: "0.5px" }}>
                {section.title}
              </div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {section.items.map((item, itemIdx) => {
                  const isActive = currentPath.startsWith(item.path);
                  return (
                    <li key={itemIdx} style={{ marginBottom: "4px" }}>
                      <Link 
                        to={item.path}
                        onClick={closeMobileMenu}
                        className={!isActive ? "admin-nav-item" : ""}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          textDecoration: "none",
                          fontSize: "14px",
                          fontWeight: 500,
                          backgroundColor: isActive ? "#2563eb" : "transparent",
                          color: isActive ? "#ffffff" : "#d1d5db",
                          transition: "all 0.15s ease"
                        }}
                      >
                        <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} style={{ color: isActive ? "#ffffff" : "#9ca3af" }} />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer / Logout */}
        <div style={{ padding: "16px 12px", borderTop: "1px solid #1f2937" }}>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="admin-logout-btn"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 12px",
              borderRadius: "8px",
              background: "transparent",
              border: "none",
              color: "#d1d5db",
              fontSize: "14px",
              fontWeight: 500,
              cursor: loggingOut ? "wait" : "pointer",
              transition: "all 0.15s ease",
              textAlign: "left"
            }}
          >
            <LogOut size={18} style={{ color: "#9ca3af", transition: "color 0.15s ease" }} />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
