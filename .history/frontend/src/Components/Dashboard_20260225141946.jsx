import React from 'react'

import { useAppContext } from '../context/AppContextProvider';
import toast from 'react-hot-toast';

function Dashboard() {
  const { axios, setUser, navigate } = useAppContext();
  const [loggingOut, setLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      
      const { data } = await axios.post('/api/auth/logout');
      
      if (data.success) {
        // Clear user from context
        setUser(null);
        
        // Show success message
        toast.success('Logged out successfully');
        
        // Redirect to home page
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
    <>
      <div>
        <button 
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-red-50 transition-colors"
        >
          <FaSignOutAlt className="text-red-600" />
          <span className={`text-red-600 ${loggingOut ? 'opacity-50' : ''}`}>
            {loggingOut ? 'Logging out...' : 'Logout'}
          </span>
        </button>
      </div>
    </>
  )
}

export default Dashboard