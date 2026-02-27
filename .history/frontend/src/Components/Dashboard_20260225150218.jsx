import React from 'react';
import { useAppContext } from '../context/AppContextProvider';

function Dashboard() {
  const { mode, user, setShowLogin } = useAppContext();

  // Mode ke hisaab se content
  const getDashboardContent = () => {
    if (!user) {
      return (
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Welcome to the App!</h2>
          <p className="mb-4">Please login to access dashboard features</p>
          <button
            onClick={() => setShowLogin(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Login Now
          </button>
        </div>
      );
    }

    if (mode === 'study') {
      return (
        <div className="p-8 bg-blue-50 min-h-screen">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-blue-800 mb-6">📚 Study Mode Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Study Cards */}
              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-xl font-semibold mb-2">Notes</h3>
                <p className="text-gray-600">Create and manage your study notes</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">⏰</div>
                <h3 className="text-xl font-semibold mb-2">Pomodoro Timer</h3>
                <p className="text-gray-600">25 minutes focus, 5 minutes break</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2">Progress Tracker</h3>
                <p className="text-gray-600">Track your study progress</p>
              </div>
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Today's Study Goals</h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <input type="checkbox" className="w-5 h-5" />
                  <span>Complete Chapter 1</span>
                </li>
                <li className="flex items-center gap-3">
                  <input type="checkbox" className="w-5 h-5" />
                  <span>Practice problems 1-10</span>
                </li>
                <li className="flex items-center gap-3">
                  <input type="checkbox" className="w-5 h-5" />
                  <span>Review notes for 30 minutes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="p-8 bg-green-50 min-h-screen">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-green-800 mb-6">🎮 Chill Mode Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Chill Cards */}
              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">🎵</div>
                <h3 className="text-xl font-semibold mb-2">Music Player</h3>
                <p className="text-gray-600">Listen to your favorite tunes</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">🎬</div>
                <h3 className="text-xl font-semibold mb-2">Watch Together</h3>
                <p className="text-gray-600">Movies and shows recommendations</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">🎮</div>
                <h3 className="text-xl font-semibold mb-2">Games</h3>
                <p className="text-gray-600">Quick games to relax</p>
              </div>
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Today's Chill Activities</h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <input type="checkbox" className="w-5 h-5" />
                  <span>Watch an episode of favorite show</span>
                </li>
                <li className="flex items-center gap-3">
                  <input type="checkbox" className="w-5 h-5" />
                  <span>Listen to new album</span>
                </li>
                <li className="flex items-center gap-3">
                  <input type="checkbox" className="w-5 h-5" />
                  <span>Play game for 30 minutes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-500">
      {getDashboardContent()}
    </div>
  );
}

export default Dashboard;