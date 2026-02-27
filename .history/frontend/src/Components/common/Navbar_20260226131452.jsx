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

  // Mode ke hisaab se styles with white background
  const modeStyles = {
    study: {
      bg: "from-blue-500 to-indigo-600",
      hoverBg: "hover:from-blue-600 hover:to-indigo-700",
      icon: "📚",
      text: "Study Mode",
      navBg: "bg-white",
      navText: "text-gray-800",
      navTextMuted: "text-gray-500",
      border: "border-gray-200",
      switchBg: "bg-blue-500",
      switchInactive: "bg-gray-300",
      switchActive: "translate-x-7",
      accent: "blue",
      buttonBg: "bg-gray-100",
      buttonHover: "hover:bg-gray-200",
      dropdownBg: "bg-white",
    },
    chill: {
      bg: "from-green-500 to-emerald-600",
      hoverBg: "hover:from-green-600 hover:to-emerald-700",
      icon: "🎮",
      text: "Chill Mode",
      navBg: "bg-white",
      navText: "text-gray-800",
      navTextMuted: "text-gray-500",
      border: "border-gray-200",
      switchBg: "bg-green-500",
      switchInactive: "bg-gray-300",
      switchActive: "translate-x-7",
      accent: "green",
      buttonBg: "bg-gray-100",
      buttonHover: "hover:bg-gray-200",
      dropdownBg: "bg-white",
    },
  };

  const currentStyle = modeStyles[mode] || modeStyles.chill;

  return (
    <nav
      className={`${currentStyle.navBg} ${currentStyle.navText} px-4 sm:px-6 py-3 shadow-lg transition-all duration-500 border-b ${currentStyle.border} sticky top-0 z-50`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-2 sm:gap-4 group cursor-pointer" onClick={() => navigate("/")}>
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${currentStyle.bg} rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity`}></div>
            <div className={`relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${currentStyle.bg} rounded-xl flex items-center justify-center text-xl sm:text-2xl text-white shadow-lg transform group-hover:scale-110 transition-all duration-300`}>
              {mode === "study" ? "📚" : "🎮"}
            </div>
          </div>
          <div className="hidden xs:block">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 text-transparent bg-clip-text">
                TripGlide
              </span>
            </h1>
            <p className={`text-xs ${currentStyle.navTextMuted} -mt-1`}>
              {mode === "study" ? "Focus & Learn" : "Relax & Enjoy"}
            </p>
          </div>
        </div>

        {/* Right Side - User Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mode Toggle - Always Visible */}
          <div className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 ${currentStyle.buttonBg} backdrop-blur-xl rounded-2xl border ${currentStyle.border}`}>
            <span className={`text-xs sm:text-sm font-medium ${currentStyle.navTextMuted} hidden sm:inline`}>
              Mode
            </span>
            <button
              onClick={handleToggleMode}
              disabled={togglingMode || !user}
              className={`relative w-12 sm:w-14 h-6 sm:h-7 rounded-full transition-colors duration-300 ${
                user 
                  ? mode === 'study' ? 'bg-blue-500' : 'bg-green-500'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
              title={!user ? "Login to switch mode" : `Switch to ${mode === 'study' ? 'Chill' : 'Study'} mode`}
            >
              <span
                className={`absolute top-1 left-1 w-4 sm:w-5 h-4 sm:h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  mode === 'chill' ? 'translate-x-6 sm:translate-x-7' : ''
                }`}
              />
            </button>
            <span className={`text-xs sm:text-sm ${currentStyle.navTextMuted} min-w-[50px] sm:min-w-[60px]`}>
              {togglingMode ? (
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
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
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className={`relative flex items-center gap-2 sm:gap-3 ${currentStyle.buttonBg} backdrop-blur-xl rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 border ${currentStyle.border} hover:${currentStyle.buttonHover} transition-all`}>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
                    <span className="text-base sm:text-lg">👤</span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className={`text-sm font-medium ${currentStyle.navText} max-w-[100px] truncate`}>
                      {user.username || user.email}
                    </p>
                    <p className={`text-xs ${currentStyle.navTextMuted}`}>Premium</p>
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
                  <div className={`absolute right-0 mt-2 w-48 ${currentStyle.dropdownBg} rounded-xl border ${currentStyle.border} shadow-xl z-50 overflow-hidden`}>
                    <div className={`p-2 border-b ${currentStyle.border}`}>
                      <p className={`text-sm font-medium ${currentStyle.navText} px-3 py-2`}>
                        {user.username || user.email}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className={`w-full text-left px-4 py-3 ${currentStyle.buttonHover} transition-colors flex items-center gap-2 text-red-500 hover:text-red-600`}
                    >
                      <span>🚪</span>
                      <span className="flex-1">
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
          ) : (
            <div className="flex items-center gap-2">
              {/* Login Button */}
              <button
                onClick={() => setShowLogin(true)}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl px-4 sm:px-6 py-1.5 sm:py-2 shadow-md transform group-hover:scale-105 transition-all duration-300 flex items-center gap-1 sm:gap-2 text-white">
                  <span className="text-base sm:text-lg">🔐</span>
                  <span className="text-sm sm:text-base font-medium">Login</span>
                </div>
              </button>

              {/* Signup Button - Hidden on mobile */}
              <button
                onClick={() => setShowLogin(true)}
                className="group relative hidden sm:block"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className={`relative ${currentStyle.buttonBg} backdrop-blur-xl ${currentStyle.buttonHover} rounded-xl px-4 sm:px-6 py-1.5 sm:py-2 border ${currentStyle.border} transition-all transform group-hover:scale-105 duration-300 flex items-center gap-1 sm:gap-2`}>
                  <span className="text-base sm:text-lg">✨</span>
                  <span className={`text-sm sm:text-base font-medium ${currentStyle.navText}`}>Sign Up</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {user && (
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-200">
          <div className={`h-full w-2/3 bg-gradient-to-r ${currentStyle.bg} rounded-full animate-pulse`}></div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;