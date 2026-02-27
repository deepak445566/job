
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

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