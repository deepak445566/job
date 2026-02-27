import React, { useState } from 'react';
import { 
  HomeIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  UserIcon,
  Cog6ToothIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const FloatingDockMinimal = ({ onHeartClick }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isHeartHovered, setIsHeartHovered] = useState(false);

  const items = [
    { icon: HomeIcon, label: 'Home', action: 'home' },
    { icon: MagnifyingGlassIcon, label: 'Search', action: 'search' },
    { icon: isHeartHovered ? HeartIconSolid : HeartIcon, label: 'Create Reel', action: 'create' },
    { icon: UserIcon, label: 'Profile', action: 'profile' },
    { icon: BellIcon, label: 'Notifications', action: 'notifications' },
    { icon: Cog6ToothIcon, label: 'Settings', action: 'settings' },
  ];

  const handleClick = (action) => {
    if (action === 'create') {
      // Call the function passed from parent to open create reel modal
      if (onHeartClick) {
        onHeartClick();
      }
    } else {
      // Handle other navigation
      console.log(`Navigate to ${action}`);
    }
  };

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-40">
      <div className="relative">
        {/* Dock Background */}
        <div className="absolute inset-0 bg-black/5 blur-xl rounded-3xl"></div>
        
        {/* Dock */}
        <div className="relative bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 border border-gray-200 shadow-lg">
          <div className="flex gap-1">
            {items.map((item, index) => {
              const Icon = item.icon;
              const isHovered = hoveredIndex === index;
              const isActive = activeIndex === index;
              
              return (
                <div
                  key={index}
                  className="relative"
                  onMouseEnter={() => {
                    setHoveredIndex(index);
                    if (item.action === 'create') {
                      setIsHeartHovered(true);
                    }
                  }}
                  onMouseLeave={() => {
                    setHoveredIndex(null);
                    if (item.action === 'create') {
                      setIsHeartHovered(false);
                    }
                  }}
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {item.label}
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  )}

                  {/* Icon Button */}
                  <button
                    onClick={() => {
                      setActiveIndex(index);
                      handleClick(item.action);
                    }}
                    className={`
                      w-12 h-12 rounded-full transition-all duration-200
                      flex items-center justify-center
                      ${isActive && item.action !== 'create'
                        ? 'bg-black text-white' 
                        : item.action === 'create' && isHeartHovered
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-110'
                        : 'text-gray-600 hover:bg-gray-100'
                      }
                      ${isHovered ? 'scale-110 -translate-y-2' : 'scale-100 translate-y-0'}
                      ${item.action === 'create' ? 'group' : ''}
                    `}
                  >
                    <Icon className={`w-5 h-5 ${item.action === 'create' && isHeartHovered ? 'animate-pulse' : ''}`} />
                    
                    {/* Special effect for create button */}
                    {item.action === 'create' && isHovered && (
                      <span className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-300"></span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Shadow */}
      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1/2 h-3 bg-black/10 blur-md rounded-full"></div>
    </div>
  );
};

export default FloatingDockMinimal;