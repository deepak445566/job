import Navbar from "./Navbar";
import FloatingDockMinimal from "./Footer";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Page Content - with padding bottom for footer */}
      <div className="flex-1 pb-16"> {/* Padding bottom add kiya */}
        <Outlet />
      </div>

      {/* Footer - fixed at bottom with proper z-index */}
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <FloatingDockMinimal />
      </div>
    </div>
  );
}

export default Layout;