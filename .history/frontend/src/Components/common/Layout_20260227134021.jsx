// Layout.jsx
import React, { useState } from 'react';
import Navbar from "./Navbar";
import FloatingDockMinimal from "./Footer";
import { Outlet } from "react-router-dom";
import ChillDashboard from '../ChillDashboard'; // Import to access modal state? Better to use context

function Layout() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Page Content */}
      <div className="flex-1 pb-20">
        <Outlet context={{ openCreateModal: () => setIsCreateModalOpen(true) }} />
      </div>

      {/* Floating Dock */}
      <FloatingDockMinimal onHeartClick={() => setIsCreateModalOpen(true)} />

      {/* Global Create Modal */}
      {isCreateModalOpen && (
        // Your create reel modal component here
        <div className="fixed inset-0 bg-black bg-opacity-90 z-[100] flex items-center justify-center p-4">
          {/* ... modal content ... */}
        </div>
      )}
    </div>
  );
}