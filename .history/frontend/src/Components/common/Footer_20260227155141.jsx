import React, { useState } from 'react';
import { 
  HomeIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  UserIcon,
  Cog6ToothIcon,
  BellIcon
} from '@heroicons/react/24/outline';

const FloatingDockMinimal = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const items = [
    { icon: HomeIcon, label: 'Home' ,link:'/profile' },
 
    { icon: UserIcon, label: 'Profile' },
    { icon: BellIcon, label: 'Notifications' },
    { icon: Cog6ToothIcon, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 ">
      <div className="relative w-screen">
       
        
        {/* Dock */}
        <div className="relative bg-white/90 backdrop-blur-sm rounded-xl  py-3 m-1 ">
          <div className="flex justify-center gap-10">
            {items.map((item, index) => {
              const Icon = item.icon;
              const isHovered = hoveredIndex === index;
              const isActive = activeIndex === index;
              
              return (
                <div
                  key={index}
                  className="relative"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
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
  onClick={() => setActiveIndex(index) ,navigate}
  className={`
    w-12 h-12 rounded-full transition-all duration-200
    flex items-center justify-center
    ${isActive 
      ? 'bg-black text-white' 
      : 'text-gray-600 hover:bg-gray-100'
    }
    ${isHovered ? 'scale-110 -translate-y-2' : 'scale-100 translate-y-0'}
  `}
>
  <Icon className="w-8 h-8" />
</button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
     
    </div>
  );
};

export default FloatingDockMinimal;