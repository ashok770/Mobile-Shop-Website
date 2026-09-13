import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

function AdminLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileOpen(false);

  return (
    <div 
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}
    >
      <AdminSidebar isMobileOpen={isMobileOpen} closeMobileMenu={closeMobileMenu} />
      
      <div 
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0
        }}
      >
        <AdminTopbar toggleMobileMenu={toggleMobileMenu} />
        
        <main 
          style={{
            flex: 1,
            padding: "24px 32px",
            overflowX: "hidden",
            boxSizing: "border-box"
          }}
          className="admin-main-content"
        >
          <style>{`
            @media (max-width: 768px) {
              .admin-main-content {
                padding: 16px !important;
              }
            }
          `}</style>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
