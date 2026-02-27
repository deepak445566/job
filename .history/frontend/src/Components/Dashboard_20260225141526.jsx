import React from 'react'
import { useAppContext } from '../context/AppContextProvider';
import toast from 'react-hot-toast';

function Navbar() {
  const { user, setUser, axios, setShowLogin, navigate } = useAppContext();
  const [loggingOut, setLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      
      const { data } = await axios.post('/api/auth/logout');
      
      if (data.success) {
        setUser(null);
        setShowLogin(true);
        toast.success('Logged out successfully');
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
    const handleLoginClick = () => {
 
    setShowLogin(true)
  }

  return (
    <>
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">My App</h1>
        
        <div className="flex items-center space-x-4">
          {/* Agar user login hai toh logout button dikhao */}
          {user ? (
            <>
              <span>Welcome, {user.username || user.email}</span>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
              >
                {loggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </>
          ) : (
            {/* Agar user login nahi hai toh login button dikhao */}
            <button
            onClick={handleLoginClick}
              className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-white"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
    </>
  )
}

export default Navbar;