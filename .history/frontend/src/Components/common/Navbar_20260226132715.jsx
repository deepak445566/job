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

  return (
    <nav className="bg-white px-3 py-2 shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        {/* Left Side - Logo and Username */}
        <div className="flex items-center gap-2">
          {/* HM Logo */}
          <div 
            className="flex items-center gap-0 cursor-pointer" 
            onClick={() => navigate("/")}
          >
            <div className="w-7 h-7 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-base">H</span>
            </div>
            <span className="text-gray-800 font-bold text-lg -ml-0.5">M</span>
          </div>

          {/* Username - Always show Karan */}
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <span className="text-gray-700 font-medium text-sm">
              Karan
            </span>
          </div>
        </div>

        {/* Right Side - Mode Toggle and Auth */}
        <div className="flex items-center gap-1.5">
          {/* Mode Toggle - Simplified */}
          <button
            onClick={handleToggleMode}
            disabled={togglingMode || !user}
            className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${
              user 
                ? mode === 'study' 
                  ? 'bg-indigo-500' 
                  : 'bg-emerald-500'
                : 'bg-gray-200 cursor-not-allowed'
            }`}
            title={!user ? "Login to switch mode" : `Switch to ${mode === 'study' ? 'Chill' : 'Study'}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                mode === 'chill' ? 'translate-x-5' : ''
              }`}
            />
          </button>

          {/* Auth Buttons */}
          {user ? (
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="relative"
            >
              <div className="relative bg-white border border-gray-200 hover:bg-gray-50 rounded-lg px-3 py-1.5 shadow-sm transition-all flex items-center gap-1">
                <span className="text-red-500 text-base">🚪</span>
                <span className="text-gray-700 text-sm font-medium">
                  {loggingOut ? "..." : "Exit"}
                </span>
                {loggingOut && (
                  <span className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            </button>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="relative"
            >
              <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg px-3 py-1.5 shadow-sm transition-all flex items-center gap-1">
                <span className="text-white text-base">🔐</span>
                <span className="text-white text-xs font-medium">Login</span>
              </div>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;