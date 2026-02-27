import Navbar from "./Navbar";
import FloatingDockMinimal from "./Footer";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Page Content - with padding bottom for fixed footer */}
      <div className="flex-1 pb-20"> {/* Padding for footer */}
        <Outlet />
      </div>

      {/* Fixed Footer - bottom par rahega */}
      <FloatingDockMinimal />
    </div>
  );
}

export default Layout;