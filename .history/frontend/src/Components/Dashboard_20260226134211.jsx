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
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Top Header - Simple */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold">Welcome to Swap App</h1>
            <p className="text-lg opacity-90">Connect, Swap, and Chill with friends</p>
          </div>
        </div>

        {/* Main Content - Login Card aur Screenshot wala section */}
        <div className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full">
          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 max-w-md mx-auto">
            <div className="text-6xl mb-4 text-center">👋</div>
            <h2 className="text-3xl font-bold mb-4 text-center">Welcome to the App!</h2>
            <p className="text-gray-600 mb-6 text-center">
              Please login to access dashboard features and switch between Study and Chill modes.
            </p>
            <button
              onClick={() => setShowLogin(true)}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              Login Now
            </button>
          </div>

          {/* Bottom Section - Exactly aapke screenshot ke hisaab se (Login na hote hue bhi dikhega) */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
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
                
                <button
                  onClick={() => setShowLogin(true)} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                >
                  Register your place
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  *Login required to register
                </p>
              </div>

              {/* Right side - Image section */}
              <div className="w-full md:w-1/2">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 flex items-center justify-center min-h-[300px]">
                  {/* Placeholder for your image */}
                  <div className="text-center">
                    <div className="text-8xl mb-4">🖼️</div>
                    <p className="text-gray-500">Your screenshot will appear here</p>
                    <p className="text-sm text-gray-400 mt-2">Screenshot 2026-02-26 133328.png</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Extra info - Mode indicators (but disabled) */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-6 opacity-75 cursor-not-allowed">
              <div className="text-2xl mb-2">📚</div>
              <h3 className="text-xl font-semibold mb-2">Study Mode</h3>
              <p className="text-gray-600">Login to access study partners and resources</p>
              <div className="mt-4 inline-block bg-gray-200 text-gray-500 px-4 py-2 rounded-lg text-sm">
                Locked
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 opacity-75 cursor-not-allowed">
              <div className="text-2xl mb-2">🎮</div>
              <h3 className="text-xl font-semibold mb-2">Chill Mode</h3>
              <p className="text-gray-600">Login to connect with friends and have fun</p>
              <div className="mt-4 inline-block bg-gray-200 text-gray-500 px-4 py-2 rounded-lg text-sm">
                Locked
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Agar user login hai
  return (
    <div className="transition-all duration-500 min-h-screen flex flex-col">
      {/* Top Dashboard Header - Mode ke hisaab se */}
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

      {/* Main Content - StudyDashboard ya ChillDashboard */}
      <div className="flex-1">
        {mode === 'study' ? <StudyDashboard /> : <ChillDashboard />}
      </div>

      {/* Bottom Section - Login users ke liye bhi same section */}
      <div className="bg-white border-t border-gray-200 py-12 px-4 mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
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

            <div className="w-full md:w-1/2">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">🖼️</div>
                  <p className="text-gray-500">Your image will appear here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;