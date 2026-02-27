import Navbar from "./Navbar";
import FloatingDockMinimal from "./Footer";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Page Content */}
      <div className="flex-1">
        <Outlet />
      </div>

      <FloatingDockMinimal />
    </div>
  );
}

export default Layout;