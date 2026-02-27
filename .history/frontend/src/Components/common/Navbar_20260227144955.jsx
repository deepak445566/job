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

  const getInitial = () => {
    if (user?.username) return user.username[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return 'K';
  };

  return (
   <nav className="bg-gray-50 border-b border-gray-200 px-5 py-3 sticky top-0 z-50 exo">
  <div className="flex justify-between items-center max-w-7xl mx-auto">
    {/* Left Side */}
    <div className="flex items-center gap-4">
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-light">
          Welcome
        </span>
        <div className="flex items-center gap-2">
          <span className="text-base font-light text-gray-800 tracking-wide">
            {user?.username || user?.email?.split('@')[0] || 'Admin'}
          </span>
          {user && (
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          )}
        </div>
      </div>
    </div>

    {/* Right Side */}
    <div className="flex items-center gap-3">
      {/* Mode Toggle */}
      <button
        onClick={handleToggleMode}
        disabled={togglingMode || !user}
        className={`relative w-12 h-6 rounded-full transition-all duration-700 ${
          user 
            ? mode === 'study' 
              ? 'bg-gray-700' 
              : 'bg-gray-300'
            : 'bg-gray-200 cursor-not-allowed'
        }`}
        title={!user ? "Login to switch mode" : `Switch to ${mode === 'study' ? 'Chill' : 'Study'}`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-all duration-500 ease-in-out ${
            mode === 'chill' ? 'translate-x-6' : ''
          }`}
        />
      </button>

      {/* Profile */}
      <div className="relative">
        <button
          onClick={handleProfileClick}
          className="group relative focus:outline-none"
        >
          <div>
            <img src="/images/log.jpg"
          </div>
           
         
        </button>

        {/* Profile Menu */}
        {showProfileMenu && user && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowProfileMenu(false)}
            />
            
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-lg border border-gray-100 z-50 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-[0.2em] mb-2 font-light">
                  Account
                </p>
                <p className="text-sm font-medium text-gray-800 mb-0.5">
                  {user.username || 'User'}
                </p>
                <p className="text-xs text-gray-400 truncate font-light">
                  {user.email || 'user@example.com'}
                </p>
              </div>
              
              <div className="p-2">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/profile');
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-gray-50 rounded-xl transition-all duration-200 flex items-center gap-3 text-gray-600 group"
                >
                  <span className="text-sm opacity-50 group-hover:opacity-100 transition-opacity">👤</span>
                  <span className="text-xs font-light tracking-wide">Profile</span>
                </button>
                
                <div className="h-px bg-gray-100 my-2"></div>
                
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full px-4 py-2.5 text-left hover:bg-gray-50 rounded-xl transition-all duration-200 flex items-center gap-3 text-gray-600 group"
                >
                  <span className="text-sm opacity-50 group-hover:opacity-100 transition-opacity">🚪</span>
                  <span className="text-xs font-light tracking-wide flex-1">
                    {loggingOut ? "Exiting..." : "Sign out"}
                  </span>
                  {loggingOut && (
                    <span className="w-3 h-3 border border-gray-300 border-t-transparent rounded-full animate-spin" />
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