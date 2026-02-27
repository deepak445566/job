import Navbar from "./Navbar";
import FloatingDockMinimal from "./Footer";
import { Outlet } from "react-router-dom";
import { useAppContext } from "../../context/AppContextProvider";

function Layout() {
  const { user } = useAppContext(); // ya isAuthenticated

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Page Content */}
      <div className={`flex-1 ${user ? "pb-20" : ""}`}>
        <Outlet />
      </div>

      {/* 👇 Sirf login user ko dikhega */}
       <FloatingDockMinimal />}
    </div>
  );
}

export default Layout;