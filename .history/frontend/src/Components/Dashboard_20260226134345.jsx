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
     <div class name {
      constructor(parameters) {
        
      }
     }></div>
    );
  }

  // Mode ke hisaab se dashboard render karo
  return (
    <div className="transition-all duration-500">
      {mode === 'study' ? <StudyDashboard /> : <ChillDashboard />}
    </div>
  );
}

export default Dashboard;