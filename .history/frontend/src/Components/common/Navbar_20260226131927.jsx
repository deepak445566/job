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
    <nav className="bg-white px-6 py-3 shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left Side - Logo and Username */}
        <div className="flex items-center gap-6">
          {/* HM Logo */}
          <div 
            className="flex items-center gap-1 cursor-pointer" 
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="text-gray-800 font-bold text-xl">M</span>
          </div>

          {/* Username - Only show when logged in */}
          {user && (
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <span className="text-gray-700 font-medium">
                {user.username || user.email?.split('@')[0] || 'Karan'}
              </span>
            </div>
          )}
        </div>

        {/* Right Side - Mode Toggle and Auth */}
        <div className="flex items-center gap-4">
          {/* Premium Mode Toggle */}
          <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-200">
          
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
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  mode === 'chill' ? 'translate-x-6' : ''
                }`}
              />
            </button>
            <span className="text-sm text-gray-500 min-w-[45px]">
              {togglingMode ? (
                <span className="flex items-center justify-center">
                  <span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                </span>
              ) : (
                mode === 'study' ? '📚 Study' : '🎮 Chill'
              )}
            </span>
          </div>

          {/* Auth Buttons */}
          {user ? (
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative bg-white border border-gray-200 hover:bg-gray-50 rounded-xl px-5 py-2 shadow-sm transition-all flex items-center gap-2">
                <span className="text-red-500 text-lg">🚪</span>
                <span className="text-gray-700 font-medium">
                  {loggingOut ? "Logging out..." : "Logout"}
                </span>
                {loggingOut && (
                  <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            </button>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl px-5 py-2 shadow-md transition-all flex items-center gap-2">
                <span className="text-white text-lg">🔐</span>
                <span className="text-white font-medium">Login</span>
              </div>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;