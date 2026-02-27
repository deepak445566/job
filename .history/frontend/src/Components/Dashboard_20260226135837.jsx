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
     <div className="min-h-screen  flex items-center justify-center  exo">
     
      <div className="max-w-6xl w-full   rounded-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left side: Text and button */}
        <div className="w-full md:w-1/2 p-8 sm:p-10 lg:p-12 flex flex-col justify-center space-y-6">
          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 leading-tight">
            Welcome 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 block ">
              awesome platform
            </span>
          </h1>

          {/* Paragraph */}
          <p className="text-lg text-gray-600 max-w-md">
            Join thousands of users who are already experiencing the future of digital interaction. Get started in minutes, not hours.
          </p>

          {/* Register Now Button */}
          <div className="pt-4">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
              Register Now
            </button>
          </div>

          {/* Optional extra trust indicator */}
          <p className="text-sm text-gray-400 pt-2">✨ No credit card required • Free forever</p>
        </div>

        {/* Right side: Image */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8 sm:p-10 lg:p-12">
          {/* 
            Using a placeholder image from placeholder.com. 
            Replace the src with your own image. 
            The image is made responsive with object-fit to maintain aspect ratio.
          */}
          <img
            src="https://placehold.co/600x400/3b82f6/ffffff/png?text=Your+Image+Here&font=montserrat"
            alt="Hero visual representing our platform"
            className="w-full h-auto max-w-md rounded-xl shadow-2xl object-cover transform hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </div>
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