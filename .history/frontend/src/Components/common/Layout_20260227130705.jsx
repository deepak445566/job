
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <Navbar />

      {/* Page content yaha render hoga */}
      <Outlet />

      <FloatingDockMinimal />
    </>
  );
}

export default Layout;