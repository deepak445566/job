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
     
      <div className=" w-full   rounded-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left side: Text and button */}
        <div className="w-full md:w-1/2 p-5 sm:p-10 lg:p-12 flex flex-col justify-center space-y-6">
          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 leading-tight">
           <span className='text-6xl'>C</span>reate.  <span className='text-6xl'>C</span>onnect. 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 block ">
             <span className='text-6xl'>C</span>areer.  <span className='text-6xl exo'>R</span>epeat.
            </span>
          </h1>

          {/* Paragraph */}
          <p className="text-lg text-gray-600 ">
           Welcome to Your Dual World, where you chill, learn, connect, and grow your skills, career, and creativity.
          </p>

          {/* Register Now Button */}
          <div className="pt-4 flex justify-center">
            <button onC className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
              Register Now
            </button>
          </div>

       
        </div>

        {/* Right side: Image */}
        <div className="w-full md:w-1/2  flex items-center justify-center p-3 sm:p-10 lg:p-12">
        
          <img
            src="/images/m.png"
            alt="Hero visual representing our platform"
            className="w-full h-auto rounded-xl shadow-2xl object-cover transform hover:scale-105 transition-transform duration-500"
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