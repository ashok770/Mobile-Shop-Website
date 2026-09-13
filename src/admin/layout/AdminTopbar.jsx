import { Menu, Search, Bell, ChevronDown, User } from "lucide-react";

function AdminTopbar({ toggleMobileMenu }) {
  return (
    <header 
      style={{
        height: "64px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 30
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
        <button 
          onClick={toggleMobileMenu}
          aria-label="Open navigation"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "none",
            color: "#6b7280",
            cursor: "pointer",
            padding: "8px",
            marginRight: "8px"
          }}
          className="mobile-menu-btn"
        >
          <Menu size={24} />
        </button>
        <style>{`
          @media (min-width: 1024px) {
            .mobile-menu-btn { display: none !important; }
          }
        `}</style>

        {/* Global Search Placeholder */}
        <div 
          className="admin-search-container"
          style={{ 
            position: "relative", 
            width: "100%", 
            maxWidth: "420px",
            minWidth: "200px"
          }}
        >
          <Search 
            size={18} 
            color="#9ca3af" 
            style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} 
          />
          <input 
            type="text"
            placeholder="Search products, orders, customers..."
            style={{
              width: "100%",
              height: "42px",
              padding: "0 16px 0 40px",
              borderRadius: "8px",
              border: "1px solid transparent",
              backgroundColor: "#f3f4f6",
              fontSize: "14px",
              outline: "none",
              color: "#111827",
              transition: "all 0.2s ease",
              boxSizing: "border-box"
            }}
            onFocus={(e) => {
              e.target.style.backgroundColor = "#ffffff";
              e.target.style.border = "1px solid #d1d5db";
              e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
            }}
            onBlur={(e) => {
              e.target.style.backgroundColor = "#f3f4f6";
              e.target.style.border = "1px solid transparent";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
        <style>{`
          @media (max-width: 640px) {
            .admin-search-container { display: none !important; }
          }
        `}</style>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {/* Notifications */}
        <button
          style={{
            background: "transparent",
            border: "none",
            color: "#6b7280",
            cursor: "pointer",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4px",
            transition: "color 0.2s ease"
          }}
          onMouseOver={(e) => e.currentTarget.style.color = "#374151"}
          onMouseOut={(e) => e.currentTarget.style.color = "#6b7280"}
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span 
            style={{
              position: "absolute",
              top: "2px",
              right: "4px",
              width: "8px",
              height: "8px",
              backgroundColor: "#ef4444",
              borderRadius: "50%",
              border: "2px solid #ffffff"
            }}
          />
        </button>

        <div style={{ width: "1px", height: "24px", backgroundColor: "#e5e7eb" }} />

        {/* Profile */}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            textAlign: "left"
          }}
        >
          <div 
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "#e0e7ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#4f46e5"
            }}
          >
            <User size={16} strokeWidth={2.5} />
          </div>
          <div className="admin-profile-text">
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#111827", lineHeight: 1.2 }}>Admin</div>
            <div style={{ fontSize: "12px", fontWeight: 500, color: "#6b7280" }}>Administrator</div>
          </div>
          <ChevronDown size={16} color="#9ca3af" />
        </button>
        <style>{`
          @media (max-width: 640px) {
            .admin-profile-text { display: none !important; }
          }
        `}</style>
      </div>
    </header>
  );
}

export default AdminTopbar;
