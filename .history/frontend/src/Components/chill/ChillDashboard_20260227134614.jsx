import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import CreateReelModal from "./CreateReelModal"; // Import the new component

function ChillDashboard() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadModal, setUploadModal] = useState(false);

  const videoRefs = useRef([]);
  const feedRef = useRef(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const observerRef = useRef(null);

  // =========================
  // PAUSE ALL VIDEOS HELPER
  // =========================
  const pauseAllVideos = useCallback(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause();
      }
    });
  }, []);

  // =========================
  // FETCH REELS
  // =========================
  const fetchReels = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/chills/reels",
        { withCredentials: true }
      );

      if (res.data.success) {
        setReels(res.data.reels);
        // Reset video refs array when new reels arrive
        videoRefs.current = new Array(res.data.reels.length);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  // =========================
  // AUTO PLAY FEATURE
  // =========================
  useEffect(() => {
    if (!reels.length) return;

    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const options = {
      root: feedRef.current,
      rootMargin: "0px",
      threshold: 0.7,
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        const videoIndex = videoRefs.current.indexOf(video);
        
        if (entry.isIntersecting) {
          // First pause all other videos
          videoRefs.current.forEach((v, i) => {
            if (v && i !== videoIndex) {
              v.pause();
              v.muted = true;
            }
          });

          // Play the current video
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                video.muted = false;
                setCurrentVideoIndex(videoIndex);
              })
              .catch(error => {
                console.log("Autoplay prevented:", error);
                // Try with muted
                video.muted = true;
                video.play().catch(e => console.log("Still can't play:", e));
              });
          }
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersection, options);

    // Observe all video elements
    videoRefs.current.forEach((video) => {
      if (video) {
        observerRef.current.observe(video);
      }
    });

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      videoRefs.current.forEach((video) => {
        if (video) {
          video.pause();
          video.muted = true;
          video.currentTime = 0;
        }
      });
    };
  }, [reels]);

  // =========================
  // MODAL HANDLERS
  // =========================
  const handleOpenModal = () => {
    pauseAllVideos(); // Pause all videos when modal opens
    setUploadModal(true);
  };

  const handleCloseModal = () => {
    setUploadModal(false);
  };

  const handleReelCreated = () => {
    fetchReels(); // Refresh the reels list
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="bg-black text-white min-h-screen relative">
     

      {/* Create Button */}
    

      {/* Reels Feed */}
      <div 
        ref={feedRef}
        className="fixed overflow-y-scroll snap-y snap-mandatory scroll-smooth"
        style={{ 
          top: '60px',
          bottom: '80px',
          left: 0,
          right: 0,
          scrollSnapType: 'y mandatory' 
        }}
      >
        {reels.map((reel, index) => (
          <div
            key={reel._id}
            className="h-full snap-start snap-always relative bg-black"
          >
            {/* Video */}
            <video
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              src={reel.videoUrl}
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-70"></div>

            {/* Caption Section */}
            <div className="absolute bottom-0 left-4 right-16 z-10">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-600 flex items-center justify-center mr-3">
                  <span className="font-bold">
                    {reel.user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-white">@{reel.user?.username}</h3>
                  <p className="text-sm text-gray-300">{reel.caption}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute right-2 bottom-0 flex flex-col items-center gap-6 z-10">


              
              <button className="flex flex-col items-center group">
                <div className="bg-black bg-opacity-50 p-3 rounded-full group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="text-xs mt-1">{reel.likesCount || 0}</span>
              </button>

              <button className="flex flex-col items-center group">
                <div className="bg-black bg-opacity-50 p-3 rounded-full group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span className="text-xs mt-1">{reel.commentsCount || 0}</span>
              </button>

              <button className="flex flex-col items-center group">
                <div className="bg-black bg-opacity-50 p-3 rounded-full group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <span className="text-xs mt-1">{reel.savesCount || 0}</span>
              </button>
                <button
        onClick={handleOpenModal}
        className="flex flex-col items-center group"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span className="text-lg">Create Reel</span>
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
      </button>

              <button className="flex flex-col items-center group">
                <div className="bg-black bg-opacity-50 p-3 rounded-full group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {reels.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <p className="text-gray-500 text-xl">No reels yet</p>
            <button
              onClick={handleOpenModal}
              className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-full hover:scale-105 transition-transform"
            >
              Create your first reel
            </button>
          </div>
        )}
      </div>

      {/* Create Reel Modal Component */}
      <CreateReelModal 
        isOpen={uploadModal}
        onClose={handleCloseModal}
        onSuccess={handleReelCreated}
      />
    </div>
  );
}

export default ChillDashboard;