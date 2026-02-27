// components/ChillDashboard.jsx
import React, { useState } from 'react';

function ChillDashboard() {
  const [activeTab, setActiveTab] = useState('music');

  return (
    <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 mb-6 flex items-center gap-3">
          🎮 Chill Mode Dashboard
          <span className="text-sm bg-green-200 text-green-800 px-3 py-1 rounded-full">Relax & Enjoy</span>
        </h1>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur p-4 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-green-600">🎵 12</div>
            <div className="text-gray-600">Playlists</div>
          </div>
          <div className="bg-white/80 backdrop-blur p-4 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-green-600">🎬 8</div>
            <div className="text-gray-600">Watch Later</div>
          </div>
          <div className="bg-white/80 backdrop-blur p-4 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-green-600">🎮 5</div>
            <div className="text-gray-600">Games</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 bg-white p-2 rounded-lg shadow-md">
          <button
            onClick={() => setActiveTab('music')}
            className={`flex-1 py-2 px-4 rounded-lg transition-all ${
              activeTab === 'music' 
                ? 'bg-green-500 text-white' 
                : 'hover:bg-green-100 text-gray-700'
            }`}
          >
            🎵 Music
          </button>
          <button
            onClick={() => setActiveTab('movies')}
            className={`flex-1 py-2 px-4 rounded-lg transition-all ${
              activeTab === 'movies' 
                ? 'bg-green-500 text-white' 
                : 'hover:bg-green-100 text-gray-700'
            }`}
          >
            🎬 Movies
          </button>
          <button
            onClick={() => setActiveTab('games')}
            className={`flex-1 py-2 px-4 rounded-lg transition-all ${
              activeTab === 'games' 
                ? 'bg-green-500 text-white' 
                : 'hover:bg-green-100 text-gray-700'
            }`}
          >
            🎮 Games
          </button>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === 'music' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">🎸</div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Chill Vibes Playlist</h3>
                    <p className="text-sm text-gray-600">12 songs • 45 min</p>
                  </div>
                  <button className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 w-10 h-10 flex items-center justify-center">
                    ▶
                  </button>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">🎹</div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Lo-fi Beats</h3>
                    <p className="text-sm text-gray-600">8 songs • 30 min</p>
                  </div>
                  <button className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 w-10 h-10 flex items-center justify-center">
                    ▶
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'movies' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <h3 className="font-semibold mb-2">🎬 Comedy Night</h3>
                <p className="text-sm text-gray-600 mb-3">The Office - Season 1</p>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full">
                  Watch Now
                </button>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <h3 className="font-semibold mb-2">🍿 Movie Marathon</h3>
                <p className="text-sm text-gray-600 mb-3">Inception • 2h 28min</p>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full">
                  Watch Now
                </button>
              </div>
            </div>
          )}

          {activeTab === 'games' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                <div className="text-4xl mb-2">🎮</div>
                <h3 className="font-semibold">Chess</h3>
                <button className="mt-3 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full">
                  Play
                </button>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                <div className="text-4xl mb-2">🎲</div>
                <h3 className="font-semibold">Sudoku</h3>
                <button className="mt-3 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full">
                  Play
                </button>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                <div className="text-4xl mb-2">🎯</div>
                <h3 className="font-semibold">Memory Game</h3>
                <button className="mt-3 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full">
                  Play
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Chill Activities */}
        <div className="bg-white/80 backdrop-blur p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Today's Chill Activities</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 hover:bg-green-50 rounded-lg cursor-pointer transition-colors">
              <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500" />
              <span className="flex-1">Watch an episode of favorite show</span>
              <span className="text-sm text-gray-500">30 min</span>
            </label>
            <label className="flex items-center gap-3 p-3 hover:bg-green-50 rounded-lg cursor-pointer transition-colors">
              <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500" />
              <span className="flex-1">Listen to new album</span>
              <span className="text-sm text-gray-500">45 min</span>
            </label>
            <label className="flex items-center gap-3 p-3 hover:bg-green-50 rounded-lg cursor-pointer transition-colors">
              <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500" />
              <span className="flex-1">Play game for 30 minutes</span>
              <span className="text-sm text-gray-500">30 min</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChillDashboard;