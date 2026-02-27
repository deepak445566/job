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

  // Get first letter of name for avatar
  const getInitial = () => {
    if (user?.username) return user.username[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return 'K';
  };

  return (
    <nav className="bg-white/95 backdrop-blur-xl px-4 py-2.5 border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="flex justify-between items-center">
        {/* Left Side - Story-style Greeting */}
        <div className="flex items-center gap-3">
          {/* Animated Greeting */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-pink-400 rounded-full blur-md opacity-60 animate-pulse"></div>
            <div className="relative w-10 h-10 bg-gradient-to-br from-amber-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xl transform hover:scale-110 transition-transform duration-200">
                👋
              </span>
            </div>
          </div>
          
          {/* Text with gradient */}
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium tracking-wide">GOOD TO SEE YOU</span>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {user?.username || user?.email?.split('@')[0] || 'Karan'}
              </span>
              {user && (
                <span className="text-blue-500 text-sm">✨</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Social Media Style Actions */}
        <div className="flex items-center gap-2">
          {/* Mode Toggle - Instagram-style switch */}
          <button
            onClick={handleToggleMode}
            disabled={togglingMode || !user}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 shadow-inner ${
              user 
                ? mode === 'study' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500' 
                  : 'bg-gradient-to-r from-green-400 to-emerald-500'
                : 'bg-gray-200 cursor-not-allowed'
            }`}
            title={!user ? "Login to switch mode" : `Switch to ${mode === 'study' ? 'Chill' : 'Study'}`}
          >
            <span
              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform duration-300 flex items-center justify-center ${
                mode === 'chill' ? 'translate-x-7' : ''
              }`}
            >
              <span className="text-[10px]">
                {mode === 'study' ? '📚' : '🎮'}
              </span>
            </span>
          </button>

          {/* Profile Section - Social Media Style */}
          <div className="relative">
            <button
              onClick={handleProfileClick}
              className="relative group"
            >
              {/* Story Ring Animation when logged in */}
              {user ? (
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full animate-spin-slow blur-[1px]"></div>
              ) : null}
              
              {/* Profile Avatar */}
              <div className={`relative w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-transform duration-200 group-active:scale-95 ${
                user 
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white border-2 border-white'
                  : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 border border-gray-300'
              }`}>
                {user ? (
                  <span className="text-base font-semibold">{getInitial()}</span>
                ) : (
                  <span className="text-lg">➕</span>
                )}
                
                {/* Online Status Dot */}
                {user && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>
            </button>

            {/* Profile Menu - Modern Dropdown */}
            {showProfileMenu && user && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowProfileMenu(false)}
                />
                
                {/* Menu Card */}
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden transform transition-all duration-200">
                  {/* Header with user info */}
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md">
                        {getInitial()}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">{user.username || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email || 'user@example.com'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/profile');
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-3 text-gray-700"
                    >
                      <span className="text-lg">👤</span>
                      <span className="text-sm font-medium">Profile</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/settings');
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-3 text-gray-700"
                    >
                      <span className="text-lg">⚙️</span>
                      <span className="text-sm font-medium">Settings</span>
                    </button>
                    
                    <div className="h-px bg-gray-100 my-2"></div>
                    
                    <button
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="w-full px-4 py-3 text-left hover:bg-red-50 rounded-xl transition-colors flex items-center gap-3 text-red-500"
                    >
                      <span className="text-lg">🚪</span>
                      <span className="text-sm font-medium flex-1">
                        {loggingOut ? "Logging out..." : "Logout"}
                      </span>
                      {loggingOut && (
                        <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add this to your global CSS */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </nav>
  );
}

export default Navbar;