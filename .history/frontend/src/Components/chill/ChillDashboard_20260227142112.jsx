import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import CreateReelModal from "./CreateReelModal";

function ChillDashboard() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadModal, setUploadModal] = useState(false);
  const [isGloballyMuted, setIsGloballyMuted] = useState(true);

  const videoRefs = useRef([]);
  const feedRef = useRef(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const observerRef = useRef(null);
  const [showMuteIndicator, setShowMuteIndicator] = useState(false);

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
  // TOGGLE MUTE FOR ALL VIDEOS - FIXED VERSION
  // =========================
  const toggleMute = useCallback(() => {
    const newMuteState = !isGloballyMuted;
    setIsGloballyMuted(newMuteState);
    
    // Sirf mute/unmute karo, play/pause mat karo
    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = newMuteState;
      }
    });

    // Show indicator
    setShowMuteIndicator(true);
    setTimeout(() => setShowMuteIndicator(false), 1000);
  }, [isGloballyMuted]);

  // =========================
  // HANDLE SCREEN CLICK FOR MUTE/UNMUTE
  // =========================
  const handleScreenClick = useCallback((e) => {
    // Don't toggle if clicking on buttons
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    toggleMute();
  }, [toggleMute]);

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
  // AUTO PLAY FEATURE - FIXED (Remove isGloballyMuted from dependencies)
  // =========================
  useEffect(() => {
    if (!reels.length || !feedRef.current) return;

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
          // Pause all other videos
          videoRefs.current.forEach((v, i) => {
            if (v && i !== videoIndex) {
              v.pause();
            }
          });

          // Play current video - use current mute state
          const playPromise = video.play();
          
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setCurrentVideoIndex(videoIndex);
              })
              .catch(error => {
                console.log("Autoplay failed:", error);
              });
          }
        } else {
          video.pause();
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersection, options);

    videoRefs.current.forEach((video) => {
      if (video) {
        observerRef.current.observe(video);
      }
    });

    // Auto-play first video on load
    if (videoRefs.current[0]) {
      videoRefs.current[0].play().catch(e => console.log("First video autoplay failed:", e));
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      videoRefs.current.forEach((video) => {
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
      });
    };
  }, [reels]); // Remove isGloballyMuted from here

  // Separate effect for mute updates
  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = isGloballyMuted;
      }
    });
  }, [isGloballyMuted]);

  // =========================
  // MODAL HANDLERS
  // =========================
  const handleOpenModal = () => {
    pauseAllVideos();
    setUploadModal(true);
  };

  const handleCloseModal = () => {
    setUploadModal(false);
  };

  const handleReelCreated = () => {
    fetchReels();
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div 
      className="bg-black text-white min-h-screen relative"
      onClick={handleScreenClick}
    >
      {/* Mute/Unmute Indicator - Shows current state temporarily */}
      {showMuteIndicator && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-black bg-opacity-80 px-6 py-3 rounded-full transition-opacity duration-300">
          <div className="flex items-center gap-3">
            {isGloballyMuted ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
               
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              
              </>
            )}
          </div>
        </div>
      )}

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
            {/* Video - Remove muted prop from here */}
            <video
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              src={reel.videoUrl}
              loop
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-70"></div>

            {/* Caption Section */}
            <div className="absolute bottom-0 left-4 right-16 z-10">
              <div className="flex items-center mb-2 gap-3">
                <div>

                  <img src="/images/log.jpg" className="h-15 w-15 rounded-full"/>
                </div>
                <div>
                  <h3 className="font-bold text-white">@{reel.user?.username}</h3>
                  <p className="text-sm text-gray-300">{reel.caption}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute right-0 bottom-4 flex flex-col items-center gap-6 z-10">
              {/* Like Button */}
              <button className="flex flex-col items-center group" onClick={(e) => e.stopPropagation()}>
                <div className=" bg-opacity-50 p-3 rounded-full group-hover:scale-110 transition-transform">
                 
                </div>
                <span className="text-xs mt-1">{reel.likesCount || 0}</span>
              </button>

              {/* Comment Button */}
              <button className="flex flex-col items-center group" onClick={(e) => e.stopPropagation()}>
                <div className=" bg-opacity-50 p-3 rounded-full group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span className="text-xs mt-1">{reel.commentsCount || 0}</span>
              </button>

              {/* Save Button */}
              <button className="flex flex-col items-center group" onClick={(e) => e.stopPropagation()}>
                <div className=" bg-opacity-50 p-3 rounded-full group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <span className="text-xs mt-1">{reel.savesCount || 0}</span>
              </button>

              {/* Create Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenModal();
                }}
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