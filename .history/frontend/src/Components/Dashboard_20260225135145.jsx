import React from 'react'

function Dashboard() {
  return (
    <>
    <div>Dashboard


       <button 
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-red-50 transition-colors"
                    >
                      <FaSignOutAlt className="text-red-600" />
                      <span className={`text-red-600 ${loggingOut ? 'opacity-50' : ''}`}>
                        {loggingOut ? 'Logging out...' : 'Logout'}
                      </span>
                      <button/>
    </div>
    </>
  )
}

export default Dashboard