// components/Dashboard.jsx
import React from 'react';
import { useAppContext } from '../context/AppContextProvider';
import StudyDashboard from './study/StudyDashboard';
import ChillDashboard from './chill/ChillDashboard';

function Dashboard() {
  const { mode, user, setShowLogin, loading } = useAppContext();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Agar user login nahi hai
  if (!user) {
 
  return (
    <div className="flex flex-col md:flex-row items-center gap-8 max-w-6xl mx-auto p-6">
      {/* Left Content */}
      <div className="flex-1 bg-gray-50 p-8 rounded-xl">
        <p className="text-lg mb-4">
          Connect and easily send a swap request when ready.
        </p>
        
        <p className="text-lg mb-4">
          Engage in direct messaging to discuss the details with your potential exchanger partner.
        </p>
        
        <p className="text-lg mb-4 font-medium">Register your place</p>
        
        {/* Cities List */}
        <ul className="space-y-2 mb-6 ml-4">
          <li className="text-xl font-bold text-gray-800">Viena</li>
          <li className="text-xl font-bold text-gray-800">Rome</li>
          <li className="text-xl font-bold text-gray-800">London</li>
        </ul>
        
        {/* Swap Destinations */}
        <div className="mb-6">
          <p className="text-lg mb-2">Sweep for</p>
          <ul className="space-y-1 ml-4">
            <li className="text-lg text-red-600">Rome</li>
            <li className="text-lg text-red-600">London</li>
          </ul>
        </div>
        
        {/* Accept Button */}
        <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200">
          Accept
        </button>
      </div>
      
      {/* Right Image */}
      <div className="flex-1">
        <img 
          src="/api/placeholder/600/400" 
          alt="Swap destination" 
          className="w-full h-auto rounded-xl shadow-lg object-cover"
        />
        {/* Replace the src with your actual image path */}
      </div>
    </div>
  );
};


  
  }

  // Mode ke hisaab se dashboard render karo
  return (
    <div className="transition-all duration-500">
      {mode === 'study' ? <StudyDashboard /> : <ChillDashboard />}
    </div>
  );
}

export default Dashboard;