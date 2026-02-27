import React, { useState } from "react";
import { useAppContext } from "../../context/AppContextProvider";
import toast from "react-hot-toast";

function Navbar() {
  const { user, setUser, axios, setShowLogin, navigate, mode, toggleMode } =
    useAppContext();
  const [loggingOut, setLoggingOut] = useState(false);
  const [togglingMode, setTogglingMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

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
      setShowUserMenu(false);
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
      bg: "from-blue-600 to-indigo-700",
      hoverBg: "hover:from-blue-700 hover:to-indigo-800",
      icon: "📚",
      text: "Study Mode",
      navBg: "from-slate-900 via-blue-900 to-slate-900",
      switchBg: "bg-blue-600",
      switchActive: "translate-x-7",
      accent: "blue",
    },
    chill: {
      bg: "from-green-500 to-emerald-600",
      hoverBg: "hover:from-green-600 hover:to-emerald-700",
      icon: "🎮",
      text: "Chill Mode",
      navBg: "from-slate-900 via-purple-900 to-slate-900",
      switchBg: "bg-green-600",
      switchActive: "translate-x-7",
      accent: "green",
    },
  };

  const currentStyle = modeStyles[mode] || modeStyles.chill;

  return (
    <nav
      className={`bg-gradient-to-r ${currentStyle.navBg} text-white px-4 sm:px-6 py-3 shadow-2xl transition-all duration-500 border-b border-white/10 backdrop-blur-sm sticky top-0 z-50`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-2 sm:gap-4 group cursor-pointer" onClick={() => navigate("/")}>
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${currentStyle.bg} rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}></div>
            <div className={`relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${currentStyle.bg} rounded-xl flex items-center justify-center text-xl sm:text-2xl shadow-lg transform group-hover:scale-110 transition-all duration-300`}>
              {mode === "study" ? "📚" : "🎮"}
            </div>
          </div>
          <div className="hidden xs:block">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">
                TripGlide
              </span>
            </h1>
            <p className="text-xs text-gray-400 -mt-1">
              {mode === "study" ? "Focus & Learn" : "Relax & Enjoy"}
            </p>
          </div>
        </div>

        {/* Right Side - User Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mode Toggle - Always Visible */}
          <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <span className="text-xs sm:text-sm font-medium text-gray-300 hidden sm:inline">Mode</span>
            <button
              onClick={handleToggleMode}
              disabled={togglingMode || !user}
              className={`relative w-12 sm:w-14 h-6 sm:h-7 rounded-full transition-colors duration-300 ${
                user 
                  ? mode === 'study' ? 'bg-blue-600' : 'bg-green-600'
                  : 'bg-gray-600 cursor-not-allowed opacity-50'
              }`}
              title={!user ? "Login to switch mode" : `Switch to ${mode === 'study' ? 'Chill' : 'Study'} mode`}
            >
              <span
                className={`absolute top-1 left-1 w-4 sm:w-5 h-4 sm:h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  mode === 'chill' ? 'translate-x-6 sm:translate-x-7' : ''
                }`}
              />
            </button>
            <span className="text-xs sm:text-sm text-gray-300 min-w-[50px] sm:min-w-[60px]">
              {togglingMode ? (
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </span>
              ) : (
                <span className="hidden sm:inline">
                  {mode === 'study' ? '📚 Study' : '🎮 Chill'}
                </span>
              )}
            </span>
          </div>

          {/* User Section */}
          {user ? (
            <div className="relative">
              {/* User Profile Button */}
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-xl rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 border border-white/20 hover:border-white/40 transition-all">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <span className="text-base sm:text-lg">👤</span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium max-w-[100px] truncate">
                      {user.username || user.email}
                    </p>
                    <p className="text-xs text-gray-400">Premium</p>
                  </div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl z-50 overflow-hidden">
                    <div className="p-2 border-b border-white/10">
                      <p className="text-sm font-medium px-3 py-2">
                        {user.username || user.email}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors flex items-center gap-2 text-red-400 hover:text-red-300"
                    >
                      <span>🚪</span>
                      <span className="flex-1">
                        {loggingOut ? "Logging out..." : "Logout"}
                      </span>
                      {loggingOut && (
                        <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Login Button */}
              <button
                onClick={() => setShowLogin(true)}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl px-4 sm:px-6 py-1.5 sm:py-2 shadow-lg transform group-hover:scale-105 transition-all duration-300 flex items-center gap-1 sm:gap-2">
                  <span className="text-base sm:text-lg">🔐</span>
                  <span className="text-sm sm:text-base font-medium">Login</span>
                </div>
              </button>

              {/* Signup Button - Hidden on mobile */}
              <button
                onClick={() => setShowLogin(true)}
                className="group relative hidden sm:block"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-white/10 backdrop-blur-xl hover:bg-white/20 rounded-xl px-4 sm:px-6 py-1.5 sm:py-2 border border-white/20 hover:border-white/40 transition-all transform group-hover:scale-105 duration-300 flex items-center gap-1 sm:gap-2">
                  <span className="text-base sm:text-lg">✨</span>
                  <span className="text-sm sm:text-base font-medium">Sign Up</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {user && (
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/10">
          <div className={`h-full w-2/3 bg-gradient-to-r ${currentStyle.bg} rounded-full animate-pulse`}></div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;