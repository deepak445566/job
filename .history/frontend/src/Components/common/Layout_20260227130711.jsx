
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import FloatingDockMinimal from "./Footer";

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