// components/ChillDashboard.jsx
import React, { useState } from 'react';

function ChillDashboard() {
  const [activeTab, setActiveTab] = useState('music');
  const [checkedItems, setCheckedItems] = useState({});

  const handleCheckboxChange = (id) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Premium Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-white/10 backdrop-blur-xl rounded-2xl mb-4">
            <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-medium shadow-lg">
              ✦ Premium Access ✦
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-emerald-400 text-transparent bg-clip-text">
              Chill Mode
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience the ultimate relaxation with our premium collection
          </p>
        </div>

        {/* Premium Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: '🎵', label: 'Playlists', value: '128', gradient: 'from-purple-500 to-pink-500' },
            { icon: '🎬', label: 'Watch Later', value: '47', gradient: 'from-emerald-500 to-teal-500' },
            { icon: '🎮', label: 'Games', value: '32', gradient: 'from-blue-500 to-indigo-500' }
          ].map((stat, index) => (
            <div key={index} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r opacity-75 group-hover:opacity-100 transition-opacity rounded-2xl blur-xl"
                style={{ background: `linear-gradient(to right, ${stat.gradient})` }}>
              </div>
              <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
                    <p className="text-gray-300">{stat.label}</p>
                  </div>
                  <div className="text-5xl opacity-50 group-hover:opacity-100 transition-opacity">
                    {stat.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Tab Navigation */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-2 mb-8 border border-white/10">
          <div className="flex gap-2">
            {[
              { id: 'music', icon: '🎵', label: 'Music', gradient: 'from-purple-500 to-pink-500' },
              { id: 'movies', icon: '🎬', label: 'Movies', gradient: 'from-emerald-500 to-teal-500' },
              { id: 'games', icon: '🎮', label: 'Games', gradient: 'from-blue-500 to-indigo-500' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 relative group overflow-hidden rounded-xl transition-all duration-300 ${
                  activeTab === tab.id ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {activeTab === tab.id && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} opacity-100`} />
                )}
                <div className="relative flex items-center justify-center gap-3 py-4 px-4">
                  <span className="text-2xl">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                  {activeTab === tab.id && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Premium Tab Content */}
        <div className="mb-12">
          {activeTab === 'music' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: '🎸', title: 'Chill Vibes', songs: '24 songs', duration: '1h 30min', plays: '2.3k' },
                { icon: '🎹', title: 'Lo-fi Beats', songs: '18 songs', duration: '1h', plays: '1.8k' },
                { icon: '🎧', title: 'Ambient Sounds', songs: '15 songs', duration: '52min', plays: '956' },
                { icon: '🎻', title: 'Classical Relax', songs: '12 songs', duration: '48min', plays: '1.2k' },
                { icon: '🌊', title: 'Nature Sounds', songs: '8 songs', duration: '2h', plays: '3.1k' },
                { icon: '🎺', title: 'Jazz Night', songs: '16 songs', duration: '1h 15min', plays: '1.5k' }
              ].map((item, index) => (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                  <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-5xl group-hover:scale-110 transition-transform">{item.icon}</div>
                      <button className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-pink-500 transition-all">
                        <span className="text-2xl">▶</span>
                      </button>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-gray-300 mb-4">{item.songs} • {item.duration}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{item.plays} plays</span>
                      <span className="text-purple-400">✦ Premium</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'movies' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'The Office', season: 'Season 1-9', episodes: '201 episodes', rating: '9.8', poster: '🎭' },
                { title: 'Inception', duration: '2h 28min', year: '2010', rating: '9.5', poster: '🎬' },
                { title: 'Stranger Things', season: 'Season 4', episodes: '9 episodes', rating: '9.7', poster: '👾' },
                { title: 'The Crown', season: 'Season 5', episodes: '10 episodes', rating: '9.4', poster: '👑' },
                { title: 'Interstellar', duration: '2h 49min', year: '2014', rating: '9.6', poster: '🚀' },
                { title: 'Dark', season: 'Season 1-3', episodes: '26 episodes', rating: '9.3', poster: '🌑' }
              ].map((item, index) => (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                  <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-5xl">{item.poster}</div>
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1 rounded-full text-xs font-bold">
                        ★ {item.rating}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-gray-300 mb-4">{item.season || item.duration}</p>
                    <p className="text-sm text-gray-400 mb-4">{item.episodes || item.year}</p>
                    <button className="w-full py-3 bg-white/20 backdrop-blur rounded-xl hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 transition-all text-white font-medium">
                      Watch Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'games' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: '♟️', title: 'Chess', players: '2,847 online', difficulty: 'Expert', gradient: 'from-blue-500 to-indigo-500' },
                { icon: '🔢', title: 'Sudoku', players: '1,923 online', difficulty: 'Medium', gradient: 'from-indigo-500 to-purple-500' },
                { icon: '🧩', title: 'Memory Game', players: '3,456 online', difficulty: 'Easy', gradient: 'from-purple-500 to-pink-500' },
                { icon: '🎨', title: 'Color Match', players: '2,134 online', difficulty: 'Hard', gradient: 'from-pink-500 to-rose-500' },
                { icon: '🧠', title: 'Brain Training', players: '4,567 online', difficulty: 'Expert', gradient: 'from-rose-500 to-orange-500' },
                { icon: '🎯', title: 'Aim Trainer', players: '1,789 online', difficulty: 'Medium', gradient: 'from-orange-500 to-amber-500' }
              ].map((game, index) => (
                <div key={index} className="group relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${game.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl`}></div>
                  <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all">
                    <div className="text-6xl text-center mb-4 group-hover:scale-110 transition-transform">
                      {game.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white text-center mb-2">{game.title}</h3>
                    <div className="flex items-center justify-between text-sm mb-4">
                      <span className="text-gray-400">👥 {game.players}</span>
                      <span className={`px-2 py-1 rounded-full text-xs bg-gradient-to-r ${game.gradient}`}>
                        {game.difficulty}
                      </span>
                    </div>
                    <button className={`w-full py-3 bg-white/20 backdrop-blur rounded-xl hover:bg-gradient-to-r ${game.gradient} transition-all text-white font-medium`}>
                      Play Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Premium Activities Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-xl opacity-50"></div>
          <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                Today's Premium Activities
              </h2>
              <span className="px-4 py-2 bg-white/20 backdrop-blur rounded-full text-sm text-white">
                {Object.keys(checkedItems).filter(id => checkedItems[id]).length}/3 completed
              </span>
            </div>
            
            <div className="space-y-4">
              {[
                { id: 'show', icon: '🎭', title: 'Watch premium episode', time: '45 min', reward: '100 XP' },
                { id: 'album', icon: '🎵', title: 'Listen to new album', time: '30 min', reward: '75 XP' },
                { id: 'game', icon: '🎮', title: 'Play premium game', time: '20 min', reward: '50 XP' }
              ].map((activity) => (
                <label
                  key={activity.id}
                  className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                    checkedItems[activity.id] 
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50' 
                      : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checkedItems[activity.id] || false}
                    onChange={() => handleCheckboxChange(activity.id)}
                    className="w-5 h-5 rounded-lg border-2 border-white/30 bg-transparent checked:bg-gradient-to-r checked:from-purple-500 checked:to-pink-500 focus:ring-offset-0 focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="text-3xl">{activity.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{activity.title}</h3>
                    <p className="text-sm text-gray-400">{activity.time}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-purple-400">{activity.reward}</span>
                  </div>
                </label>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Daily Streak</span>
                <span>7 days</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Floating Button */}
      <button className="fixed bottom-8 right-8 group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 hover:border-white/40 transition-all">
          <span className="text-2xl">✨</span>
        </div>
      </button>
    </div>
  );
}

export default ChillDashboard;