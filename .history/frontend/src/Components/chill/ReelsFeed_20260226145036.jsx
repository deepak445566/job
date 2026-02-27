import React, { useState, useEffect, useRef, useCallback } from 'react';


import { FaPlus, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import CreateReelModal from './CreateReelModal';
import { useAppContext } from '../../context/AppContextProvider';
import Reel from './Reel';

const ReelsFeed = () => {
  const { user, axios, mode, setShowLogin } = useAppContext();
  const navigate = useNavigate();
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const observer = useRef();
  const feedRef = useRef();

  const fetchReels = async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const { data } = await axios.get(`/api/reels?page=${page}&limit=5`);
      
      if (data.success) {
        if (append) {
          setReels(prev => [...prev, ...data.reels]);
        } else {
          setReels(data.reels);
        }
        setHasMore(data.pagination.currentPage < data.pagination.totalPages);
        setCurrentPage(data.pagination.currentPage);
      }
    } catch (error) {
      console.error('Error fetching reels:', error);
      toast.error('Failed to load reels');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  // Intersection Observer for infinite scroll
  const lastReelRef = useCallback(node => {
    if (loading || loadingMore) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchReels(currentPage + 1, true);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore, currentPage]);

  // Track active reel based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const reelElements = document.querySelectorAll('.reel-item');
      const viewportHeight = window.innerHeight;
      
      reelElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const isInView = rect.top < viewportHeight / 2 && rect.bottom > viewportHeight / 2;
        
        if (isInView) {
          setActiveReelIndex(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [reels]);

  const handleCreateReel = () => {
    if (!user) {
      toast.error('Please login to create reel');
      setShowLogin(true);
      return;
    }

    if (mode === 'study') {
      toast.error('Switch to chill mode to create reels');
      return;
    }

    setShowCreateModal(true);
  };

  const handleReelCreated = (newReel) => {
    setReels(prev => [newReel, ...prev]);
    setShowCreateModal(false);
    toast.success('Reel created successfully!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-y-scroll snap-y snap-mandatory" ref={feedRef}>
      {/* Create Reel Button */}
      <button
        onClick={handleCreateReel}
        className="fixed bottom-20 right-4 z-50 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-colors"
      >
        <FaPlus size={24} />
      </button>

      {/* Reels List */}
      {reels.length > 0 ? (
        reels.map((reel, index) => (
          <div
            key={reel._id}
            className="reel-item snap-start"
            ref={index === reels.length - 1 ? lastReelRef : null}
          >
            <Reel 
              reel={reel} 
              isActive={index === activeReelIndex}
            />
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center h-screen text-gray-500">
          <p className="text-xl mb-4">No reels yet</p>
          <button
            onClick={handleCreateReel}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Create First Reel
          </button>
        </div>
      )}

      {/* Loading More Indicator */}
      {loadingMore && (
        <div className="flex justify-center py-4">
          <FaSpinner className="animate-spin text-2xl text-blue-500" />
        </div>
      )}

      {/* Create Reel Modal */}
      {showCreateModal && (
        <CreateReelModal
          onClose={() => setShowCreateModal(false)}
          onReelCreated={handleReelCreated}
        />
      )}
    </div>
  );
};

export default ReelsFeed;