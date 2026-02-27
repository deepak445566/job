import React, { useState } from "react";
import { useAppContext } from "../../context/AppContextProvider";
import toast from "react-hot-toast";

function Navbar() {
  const { user, setUser, axios, setShowLogin, navigate, mode, toggleMode } =
    useAppContext();
  const [loggingOut, setLoggingOut] = useState(false);
  const [togglingMode, setTogglingMode] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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
      setShowProfileMenu(false);
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

  const handleProfileClick = () => {
    if (user) {
      setShowProfileMenu(!showProfileMenu);
    } else {
      setShowLogin(true);
    }
  };

  return (
    <nav className="bg-white px-4 py-3 shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        {/* Left Side - Emoji + Hello + Name */}
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label="wave">
            👋
          </span>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 leading-tight">Hello</span>
            <span className="text-base font-semibold text-gray-800 leading-tight">
              {user?.username || user?.email?.split('@')[0] || 'Karan'}
            </span>
          </div>
        </div>

        {/* Right Side - Toggle Button and Profile */}
        <div className="flex items-center gap-3">
          {/* Mode Toggle Button */}
          <button
            onClick={handleToggleMode}
            disabled={togglingMode || !user}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
              user 
                ? mode === 'study' 
                  ? 'bg-indigo-500' 
                  : 'bg-emerald-500'
                : 'bg-gray-200 cursor-not-allowed'
            }`}
            title={!user ? "Login to switch mode" : `Switch to ${mode === 'study' ? 'Chill' : 'Study'}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                mode === 'chill' ? 'translate-x-6' : ''
              }`}
            />
          </button>

          {/* Profile Icon - Click to show login/logout */}
          <div className="relative">
            <button
              onClick={handleProfileClick}
              className="w-9 h-9 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center border-2 border-white shadow-md"
            >
              <span className="text-lg" role="img" aria-label="profile">
                {user ? '👤' : '🔐'}
              </span>
            </button>

            {/* Profile Menu - Shows when clicking profile */}
            {showProfileMenu && user && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowProfileMenu(false)}
                />
                
                {/* Menu Dropdown */}
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Logged in as</p>
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {user.username || user.email}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 text-red-500"
                  >
                    <span className="text-base">🚪</span>
                    <span className="text-sm font-medium flex-1">
                      {loggingOut ? "Logging out..." : "Logout"}
                    </span>
                    {loggingOut && (
                      <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;