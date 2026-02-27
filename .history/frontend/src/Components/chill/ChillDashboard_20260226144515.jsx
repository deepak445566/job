import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaVideo } from 'react-icons/fa';

function ChillDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Chill Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Reels Card */}
          <Link 
            to="/reels"
            className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-pink-100 p-3 rounded-full">
                <FaInstagram className="text-3xl text-pink-600" />
              </div>
              <h2 className="text-2xl font-semibold">Reels</h2>
            </div>
            <p className="text-gray-600">
              Watch and create short videos. Like, comment, and share with friends.
            </p>
            <div className="mt-4 flex items-center text-pink-600">
              <FaVideo className="mr-2" />
              <span>Explore Reels →</span>
            </div>
          </Link>

          {/* Add more chill features here */}
        </div>
      </div>
    </div>
  );
}

export default ChillDashboard;