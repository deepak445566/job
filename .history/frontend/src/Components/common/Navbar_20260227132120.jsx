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
    <nav className="bg-white/80 backdrop-blur-xl px-5 py-3 border-b border-gray-100/50  top-0 z-50 exo">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Left Side - Minimal Luxury Greeting */}
        <div className="flex items-center gap-4">
         
          
          {/* Name with exquisite typography */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.3em] text-black font-medium">
              Welcome
            </span>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-transparent bg-clip-text  bg-gradient-to-r from-blue-600 to-cyan-500 tracking-wide">
                {user?.username || user?.email?.split('@')[0] || 'Admin'}
              </span>
              {user && (
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Ultra Minimal Actions */}
        <div className="flex items-center gap-3">
          {/* Mode Toggle - Refined Switch */}
          <button
            onClick={handleToggleMode}
            disabled={togglingMode || !user}
            className={`relative w-12 h-6 rounded-full transition-all duration-700 ${
              user 
                ? mode === 'study' 
                  ? 'bg-gray-900' 
                  : 'bg-gray-400'
                : 'bg-gray-100 cursor-not-allowed'
            }`}
            title={!user ? "Login to switch mode" : `Switch to ${mode === 'study' ? 'Chill' : 'Study'}`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-xl transform transition-all duration-500 ease-in-out ${
                mode === 'chill' ? 'translate-x-6' : ''
              }`}
            />
          </button>

          {/* Profile - Museum Quality */}
          <div className="relative">
            <button
              onClick={handleProfileClick}
              className="group relative focus:outline-none"
            >
              {/* Ultra subtle ring */}
              {user && (
                <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]"></div>
              )}
              
              {/* Minimal Avatar */}
              <div className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                user 
                  ? 'bg-gray-900 text-white border border-white/20'
                  : 'bg-gray-50 text-gray-400 border border-gray-200'
              }`}>
                {user ? (
                  <span className="text-xs font-light tracking-wider">{getInitial()}</span>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
            </button>

            {/* Profile Menu - Minimal Luxury Dropdown */}
            {showProfileMenu && user && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowProfileMenu(false)}
                />
                
                {/* Menu Card - Like a luxury boutique */}
                <div className="absolute right-0 mt-3 w-56 bg-white backdrop-blur-xl rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100/80 z-50 overflow-hidden">
                  {/* User Info - Minimal */}
                  <div className="px-5 py-4 border-b border-gray-100/50">
                    <p className="text-xs text-gray-400 uppercase tracking-[0.2em] mb-2 font-light">
                      Account
                    </p>
                    <p className="text-sm font-medium text-gray-900 mb-0.5">
                      {user.username || 'User'}
                    </p>
                    <p className="text-xs text-gray-400 truncate font-light">
                      {user.email || 'user@example.com'}
                    </p>
                  </div>
                  
                  {/* Menu Items - Refined */}
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/profile');
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-gray-50/80 rounded-xl transition-all duration-200 flex items-center gap-3 text-gray-600 group"
                    >
                      <span className="text-sm opacity-50 group-hover:opacity-100 transition-opacity">👤</span>
                      <span className="text-xs font-light tracking-wide">Profile</span>
                    </button>
                    
                
                    
                    <div className="h-px bg-gray-100/50 my-2"></div>
                    
                    <button
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="w-full px-4 py-2.5 text-left hover:bg-red-50/50 rounded-xl transition-all duration-200 flex items-center gap-3 text-red-400 group"
                    >
                      <span className="text-sm opacity-50 group-hover:opacity-100 transition-opacity">🚪</span>
                      <span className="text-xs font-light tracking-wide flex-1">
                        {loggingOut ? "Exiting..." : "Sign out"}
                      </span>
                      {loggingOut && (
                        <span className="w-3 h-3 border border-red-300 border-t-transparent rounded-full animate-spin" />
                      )}
                    </button>
                  </div>
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