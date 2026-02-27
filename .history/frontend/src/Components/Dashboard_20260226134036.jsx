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
      {/* Top Dashboard Header - Mode ke hisaab se change hoga */}
      <div className={`w-full py-8 px-4 ${
        mode === 'study' 
          ? 'bg-gradient-to-r from-blue-600 to-indigo-700' 
          : 'bg-gradient-to-r from-purple-600 to-pink-600'
      } text-white`}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">
            {mode === 'study' ? '📚 Study Dashboard' : '🎮 Chill Dashboard'}
          </h1>
          <p className="text-lg opacity-90">
            {mode === 'study' 
              ? 'Find study partners, share notes, and learn together' 
              : 'Connect with friends, play games, and have fun'}
          </p>
        </div>
      </div>

      {/* Main Content - StudyDashboard ya ChillDashboard yahan render hoga */}
      <div className="flex-1">
        {mode === 'study' ? <StudyDashboard /> : <ChillDashboard />}
      </div>

      {/* Bottom Section - Exactly aapke screenshot ke hisaab se */}
      <div className="bg-white border-t border-gray-200 py-12 px-4 mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Left side - Text content */}
            <div className="w-full md:w-1/2 space-y-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Connect and easily
                  <br />
                  send a swap
                  <br />
                  request when
                  <br />
                  ready.
                </h2>
              </div>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Engage in direct messaging to discuss the details
                <br />
                with your potential exchanger partner.
              </p>
              
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
                Register your place
              </button>
            </div>

            {/* Right side - Image section (aap yahan apni image laga sakte hain) */}
            <div className="w-full md:w-1/2">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 flex items-center justify-center">
                {/* Placeholder for your image - Replace with actual image */}
                <div className="text-center">
                  <div className="text-8xl mb-4">🖼️</div>
                  <p className="text-gray-500">Your image will appear here</p>
                  <p className="text-sm text-gray-400 mt-2">Screenshot 2026-02-26 133328.png</p>
                </div>
                
                {/* Actual image tag - Uncomment and use when you have the image
                <img 
                  src="/path/to/your/screenshot.png" 
                  alt="Swap illustration" 
                  className="w-full h-auto rounded-lg shadow-2xl"
                />
                */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;