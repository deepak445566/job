import React from 'react'
import { useAppContext } from '../context/AppContextProvider';
import toast from 'react-hot-toast';

function Dashboard() {
  const { axios, setUser, navigate, setShowLogin, user } = useAppContext();
  const [loggingOut, setLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      
      const { data } = await axios.post('/api/auth/logout');
      
      if (data.success) {
        // Clear user from context
        setUser(null);
        
        // Show login modal
        setShowLogin(true);
        
        // Show success message
        toast.success('Logged out successfully');
        
        // Navigate to home
        navigate('/');
      } else {
        toast.error(data.message || 'Logout failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error logging out');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      {/* User info */}
      {user && (
        <div className="mb-4">
          <p>Welcome, {user.username || user.email}!</p>
        </div>
      )}
      
      {/* Logout button - sirf tab dikhega jab user logged in ho */}
      {user && (
        <button 
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50 transition-colors bg-red-300 rounded"
        >
          <span className={`text-red-600 ${loggingOut ? 'opacity-50' : ''}`}>
            {loggingOut ? 'Logging out...' : 'Logout'}
          </span>
        </button>
      )}
      
      {/* Agar user nahi hai toh kuch aur dikhao */}
      {!user && (
        <p>Please login to access dashboard features.</p>
      )}
    </div>
  )
}

export default Dashboard;