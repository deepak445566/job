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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center p-8 max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-6xl mb-4">👋</div>
            <h2 className="text-3xl font-bold mb-4">Welcome to the App!</h2>
            <p className="text-gray-600 mb-6">
              Please login to access dashboard features and switch between Study and Chill modes.
            </p>
            <button
              onClick={() => setShowLogin(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              Login Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mode ke hisaab se dashboard render karo
  return (
    <div className="transition-all duration-500 min-h-screen flex flex-col">
      {/* Top Image Section - Aap yahan apni image laga sakte hain */}
      <div className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                {mode === 'study' ? 'Study Mode' : 'Chill Mode'}
              </h1>
              <p className="text-lg opacity-90 max-w-lg">
                {mode === 'study' 
                  ? 'Connect with study partners and ace your exams together!' 
                  : 'Find chill buddies and enjoy your free time!'}
              </p>
              <div className="mt-4 flex space-x-4">
                <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
                  Get Started
                </button>
                <button className="border border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">
                  Learn More
                </button>
              </div>
            </div>
            <div className="w-full md:w-1/3">
              {/* Yahan aap image component ya img tag laga sakte hain */}
              <img 
                src="/api/placeholder/400/300" 
                alt="Dashboard illustration" 
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content - Study ya Chill mode ka content yahan aayega */}
      <div className="flex-1">
        {mode === 'study' ? <StudyDashboard /> : <ChillDashboard />}
      </div>

      {/* Bottom Image Section - Agar neeche bhi image lagani hai to */}
      <div className="w-full bg-gray-50 py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2">
              <h2 className="text-2xl font-bold mb-4">Connect and easily send a swap request when ready.</h2>
              <p className="text-gray-600 mb-4">
                Engage in direct messaging to discuss the details with your potential exchanger partner.
              </p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                Register your place
              </button>
            </div>
            <div className="w-full md:w-1/2">
              <img 
                src="/api/placeholder/500/300" 
                alt="Swap illustration" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;