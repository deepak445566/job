import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingDockMinimal = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const items = [
    { emoji: '🏠', label: 'Home' },
    { emoji: '🔍', label: 'Search' },
    { emoji: '❤️', label: 'Likes' },
    { emoji: '📷', label: 'Camera' },
    { emoji: '💬', label: 'Chat' },
    { emoji: '⚙️', label: 'Settings' },
  ];

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20 }}
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2"
    >
      <div className="relative">
        {/* Background Blur */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-2xl"></div>
        
        {/* Dock Container */}
        <motion.div 
          className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-white/20 shadow-2xl"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <div className="flex gap-1">
            {items.map((item, index) => (
              <motion.button
                key={index}
                className={`
                  relative p-4 rounded-xl transition-colors
                  ${activeIndex === index ? 'bg-white/20' : 'hover:bg-white/10'}
                `}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                onClick={() => setActiveIndex(index)}
                whileHover={{ scale: 1.2, y: -10 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  y: hoveredIndex === index ? -10 : 0,
                  scale: hoveredIndex === index ? 1.2 : 1,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                {/* Active Indicator */}
                {activeIndex === index && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 bg-white/20 rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
                
                {/* Emoji */}
                <span className="text-2xl relative z-10">{item.emoji}</span>
                
                {/* Tooltip */}
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.8 }}
                      transition={{ type: 'spring', damping: 15 }}
                      className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap"
                    >
                      {item.label}
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Dock Shadow */}
      <motion.div 
        className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-4 bg-black/20 blur-xl rounded-full"
        animate={{ scale: hoveredIndex !== null ? 1.2 : 1, opacity: hoveredIndex !== null ? 0.3 : 0.2 }}
      />
    </motion.div>
  );
};

export default FloatingDockMinimal;