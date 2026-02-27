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
      bg: "from-blue-600 to-indigo-700",
      hoverBg: "hover:from-blue-700 hover:to-indigo-800",
      icon: "📚",
      text: "Study Mode",
      navBg: "from-slate-900 via-blue-900 to-slate-900",
      switchBg: "bg-blue-600",
      switchActive: "translate-x-6",
      accent: "blue",
    },
    chill: {
      bg: "from-green-500 to-emerald-600",
      hoverBg: "hover:from-green-600 hover:to-emerald-700",
      icon: "🎮",
      text: "Chill Mode",
      navBg: "from-slate-900 via-purple-900 to-slate-900",
      switchBg: "bg-green-600",
      switchActive: "translate-x-6",
      accent: "green",
    },
  };

  const currentStyle = modeStyles[mode] || modeStyles.chill;

  return (
    <nav
      className={`bg-gradient-to-r ${currentStyle.navBg} text-white px-6 py-3 shadow-2xl transition-all duration-500 border-b border-white/10 backdrop-blur-sm sticky top-0 z-50`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section with Premium Animation */}
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate("/")}>
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${currentStyle.bg} rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}></div>
            <div className={`relative w-12 h-12 bg-gradient-to-r ${currentStyle.bg} rounded-xl flex items-center justify-center text-2xl shadow-lg transform group-hover:scale-110 transition-all duration-300`}>
              {mode === "study" ? "📚" : "🎮"}
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
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
        <div className="flex items-center gap-4">
          {/* Premium Mode Toggle Switch */}
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <span className="text-sm font-medium text-gray-300">Mode</span>
            <button
              onClick={handleToggleMode}
              disabled={togglingMode || !user}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                user 
                  ? mode === 'study' ? 'bg-blue-600' : 'bg-green-600'
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
              title={!user ? "Login to switch mode" : ""}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  mode === 'chill' ? 'translate-x-7' : ''
                }`}
              />
            </button>
            <span className="text-sm text-gray-300 min-w-[60px]">
              {togglingMode ? (
                <span className="flex items-center gap-1">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </span>
              ) : (
                mode === 'study' ? '📚 Study' : '🎮 Chill'
              )}
            </span>
          </div>

          {/* User Menu */}
          {user ? (
            <div className="flex items-center gap-3">
              {/* Premium User Profile */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-2xl px-4 py-2 border border-white/20 hover:border-white/40 transition-all">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <span className="text-lg">👤</span>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium">{user.username || user.email}</p>
                    <p className="text-xs text-gray-400">Premium Member</p>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Premium Logout Button */}
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-white/10 backdrop-blur-xl hover:bg-white/20 rounded-xl px-4 py-2 border border-white/20 hover:border-white/40 transition-all flex items-center gap-2">
                  <span className="text-lg">🚪</span>
                  <span className="hidden md:inline font-medium">
                    {loggingOut ? "Logging out..." : "Logout"}
                  </span>
                  {loggingOut && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* Premium Login Button */}
              <button
                onClick={() => setShowLogin(true)}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl px-6 py-2 shadow-lg transform group-hover:scale-105 transition-all duration-300 flex items-center gap-2">
                  <span className="text-lg">🔐</span>
                  <span className="font-medium">Login</span>
                </div>
              </button>

              {/* Premium Signup Button */}
              <button
                onClick={() => setShowLogin(true)}
                className="group relative hidden md:block"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-white/10 backdrop-blur-xl hover:bg-white/20 rounded-xl px-6 py-2 border border-white/20 hover:border-white/40 transition-all transform group-hover:scale-105 duration-300 flex items-center gap-2">
                  <span className="text-lg">✨</span>
                  <span className="font-medium">Sign Up</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Premium Progress Bar */}
      {user && (
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/10">
          <div className={`h-full w-2/3 bg-gradient-to-r ${currentStyle.bg} rounded-full`}></div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;