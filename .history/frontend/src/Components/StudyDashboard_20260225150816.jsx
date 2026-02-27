// components/StudyDashboard.jsx
import React from 'react';

function StudyDashboard() {
  return (
    <div className="p-8 bg-blue-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">📚 Study Mode Dashboard</h1>
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-blue-600">5.5h</div>
            <div className="text-gray-600">Today's Study</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-gray-600">Tasks Completed</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-blue-600">85%</div>
            <div className="text-gray-600">Focus Score</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-blue-600">3</div>
            <div className="text-gray-600">Subjects</div>
          </div>
        </div>
        
        {/* Study Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">Notes</h3>
            <p className="text-gray-600 mb-4">Create and manage your study notes</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors w-full">
              Open Notes
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="text-4xl mb-4">⏰</div>
            <h3 className="text-xl font-semibold mb-2">Pomodoro Timer</h3>
            <p className="text-gray-600 mb-4">25 minutes focus, 5 minutes break</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors w-full">
              Start Timer
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Progress Tracker</h3>
            <p className="text-gray-600 mb-4">Track your study progress</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors w-full">
              View Progress
            </button>
          </div>
        </div>

        {/* Today's Goals */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Today's Study Goals</h2>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg transition-colors">
              <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="flex-1">Complete Chapter 1 - Mathematics</span>
              <span className="text-sm text-gray-500">2h remaining</span>
            </li>
            <li className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg transition-colors">
              <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="flex-1">Practice problems 1-10 - Physics</span>
              <span className="text-sm text-gray-500">1h remaining</span>
            </li>
            <li className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg transition-colors">
              <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="flex-1">Review notes for 30 minutes - Chemistry</span>
              <span className="text-sm text-gray-500">30m remaining</span>
            </li>
          </ul>
        </div>

        {/* Upcoming Exams */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">📅 Upcoming Exams</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <h3 className="font-semibold">Mathematics - Final Exam</h3>
                <p className="text-sm text-gray-600">Chapter 5-10</p>
              </div>
              <div className="text-right">
                <div className="font-bold text-yellow-600">3 days left</div>
                <p className="text-sm text-gray-500">15 Mar 2024</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <h3 className="font-semibold">Physics - Mid Term</h3>
                <p className="text-sm text-gray-600">Mechanics</p>
              </div>
              <div className="text-right">
                <div className="font-bold text-blue-600">5 days left</div>
                <p className="text-sm text-gray-500">17 Mar 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudyDashboard;