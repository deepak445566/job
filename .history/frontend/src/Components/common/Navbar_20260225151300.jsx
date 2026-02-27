import React, { useState } from "react";
import { useAppContext } from "../../context/AppContextProvider";
import toast from "react-hot-toast";

function Navbar() {
  const { user, setUser, axios, setShowLogin, navigate, mode, toggleMode } =
    useAppContext();
  const [loggingOut, setLoggingOut] = useState(false);
  const [togglingMode, setTogglingMode] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const { data } = await axios.post("/api/auth/logout");
      if (data.success) {
        setUser(null);
        setShowLogin(true);
        toast.success("Logged out successfully");
        navigate("/");
      } else {
        toast.error(data.message || "Logout failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error logging out");
    } finally {
      setLoggingOut(false);
    }
  };

  const handleToggleMode = async () => {
    try {
      setTogglingMode(true);
      await toggleMode();
    } catch (error) {
      console.error("Error toggling mode:", error);
    } finally {
      setTogglingMode(false);
    }
  };

  // Mode ke hisaab se styles
  const modeStyles = {
    study: {
      bg: "bg-blue-600",
      hoverBg: "hover:bg-blue-700",
      icon: "📚",
      text: "Study Mode",
      navBg: "bg-gradient-to-r from-blue-900 to-gray-900",
    },
    chill: {
      bg: "bg-green-600",
      hoverBg: "hover:bg-green-700",
      icon: "",
      text: "Chill Mode",
      navBg: "bg-gradient-to-r from-green-900 to-gray-900",
    },
  };

  const currentStyle = modeStyles[mode] || modeStyles.chill;

  return (
    <nav
      className={`${currentStyle.navBg} text-white p-4 shadow-lg transition-all duration-500`}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo with mode icon */}
        <div className="flex items-center gap-3">
          <span className="text-2xl">{currentStyle.icon}</span>
          <h1 className="text-xl font-bold">
            {mode === "study" ? "Study Zone" : "Chill Zone"}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Mode Toggle Button - Sirf tab interactive jab user login ho */}
          <button
            onClick={handleToggleMode}
            disabled={togglingMode || !user}
            className={`
              ${user ? currentStyle.bg : "bg-gray-600 cursor-not-allowed"} 
              ${user ? currentStyle.hoverBg : ""} 
              px-4 py-2 rounded-lg text-white font-medium 
              flex items-center gap-2 transition-all duration-300 
              transform hover:scale-105
            `}
            title={!user ? "Login to switch mode" : ""}
          >
            <span>{togglingMode ? "⏳" : currentStyle.icon}</span>
            <span>
              {togglingMode
                ? "Switching..."
                : user
                  ? currentStyle.text
                  : "Login to use mode"}
            </span>
          </button>

          {/* User Info aur Logout */}
          {user ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-700 rounded-full">
                <span className="text-sm">👤</span>
                <span className="text-sm font-medium">
                  {user.username || user.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 transform hover:scale-105"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 transform hover:scale-105"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
