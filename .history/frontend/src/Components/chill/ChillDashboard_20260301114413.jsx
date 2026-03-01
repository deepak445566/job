import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import CreateReelModal from "./CreateReelModal";
import { useAppContext } from "../../context/AppContextProvider";
import debounce from 'lodash/debounce';

// Memoized Reel Item Component
const ReelItem = React.memo(({ reel, index, isGloballyMuted, onLike, onComment, onSave, isVisible }) => {
  const videoRef = useRef(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isGloballyMuted;
    }
  }, [isGloballyMuted]);

  useEffect(() => {
    if (videoRef.current) {
      if (isVisible) {
        videoRef.current.load();
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
        // Clear source for far away videos to save memory
        if (Math.abs(index - isVisible?.currentIndex) > 2) {
          videoRef.current.src = '';
        }
      }
    }
  }, [isVisible, index]);

  const handleVideoLoad = () => {
    setIsVideoLoading(false);
  };

  const handleVideoError = (e) => {
    console.log('Video error:', e);
    setHasError(true);
    setIsVideoLoading(false);
  };

  return (
    <div className="h-full snap-start snap-always relative bg-black">
      {/* Video */}
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <p className="text-white">Failed to load video</p>
        </div>
      ) : (
        <>
          {isVideoLoading && (
            <div className="absolute inset-0 bg-gray-900 animate-pulse" />
          )}
          <video
            ref={videoRef}
            src={isVisible ? reel.videoUrl : ''}
            poster={reel.thumbnailUrl || ''}
            loop
            muted={isGloballyMuted}
            playsInline
            preload={isVisible ? "auto" : "none"}
            className="absolute inset-0 w-full h-full object-cover"
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
          />
        </>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-70"></div>

      {/* Caption Section */}
      <div className="absolute bottom-2 left-4 right-16 z-10">
        <div className="flex items-center mb-2 gap-3">
          <div>
            <img 
              src={reel.user?.profilePic || "/images/log.jpg"} 
              className="h-10 w-10 rounded-full border-2 border-white" 
              alt="profile"
              loading="lazy"
            />
          </div>
          <div>
            <h3 className="font-bold text-white">@{reel.user?.username}</h3>
            <p className="text-sm text-gray-300 line-clamp-2">{reel.caption}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute right-0 bottom-20 flex flex-col items-center gap-6 z-10">
        {/* Like Button */}
        <button
          className="flex flex-col items-center group"
          onClick={(e) => onLike(reel._id, index, e)}
        >
          <div className=" bg-opacity-50 p-3 rounded-full group-hover:scale-110 transition-transform backdrop-blur-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              fill={reel.isLiked ? "red" : "none"}
              className={`size-8 transition-all duration-300 ${
                reel.isLiked ? "text-red-500 scale-110" : "text-white"
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
              />
            </svg>
          </div>
          <span
            className={`text-xs mt-1 font-semibold ${
              reel.isLiked ? "text-red-500" : "text-white"
            }`}
          >
            {reel.likesCount || 0}
          </span>
        </button>

        {/* Comment Button */}
        <button 
          className="flex flex-col items-center group" 
          onClick={(e) => onComment(reel, e)}
        >
          <div className="bg-black bg-opacity-50 p-3 rounded-full group-hover:scale-110 transition-transform backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="size-8" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
          </div>
          <span className="text-xs mt-1 font-semibold text-white">{reel.commentsCount || 0}</span>
        </button>

        {/* Save Button */}
        <button
          className="flex flex-col items-center group"
          onClick={(e) => onSave(reel._id, index, e)}
        >
          <div className="bg-black bg-opacity-50 p-3 rounded-full group-hover:scale-110 transition-transform backdrop-blur-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              fill={reel.isSaved ? "white" : "none"}
              className={`size-8 transition-all duration-300 ${
                reel.isSaved ? "text-yellow-400 scale-110" : "text-white"
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
              />
            </svg>
          </div>
          <span
            className={`text-xs mt-1 font-semibold ${
              reel.isSaved ? "text-yellow-400" : "text-white"
            }`}
          >
            {reel.savesCount || 0}
          </span>
        </button>
      </div>
    </div>
  );
});

ReelItem.displayName = 'ReelItem';

function ChillDashboard() {
  const { axios } = useAppContext();
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadModal, setUploadModal] = useState(false);
  const [isGloballyMuted, setIsGloballyMuted] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [selectedReel, setSelectedReel] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showMuteIndicator, setShowMuteIndicator] = useState(false);

  const videoRefs = useRef([]);
  const feedRef = useRef(null);
  const observerRef = useRef(null);
  const commentsPanelRef = useRef(null);

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
  // CLEANUP VIDEOS
  // =========================
  useEffect(() => {
    return () => {
      videoRefs.current.forEach(video => {
        if (video) {
          video.pause();
          video.src = '';
          video.load();
        }
      });
    };
  }, []);

  // =========================
  // TOGGLE MUTE FOR ALL VIDEOS
  // =========================
  const toggleMute = useCallback(() => {
    const newMuteState = !isGloballyMuted;
    setIsGloballyMuted(newMuteState);
    
    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = newMuteState;
      }
    });

    setShowMuteIndicator(true);
    setTimeout(() => setShowMuteIndicator(false), 1000);
  }, [isGloballyMuted]);

  // =========================
  // HANDLE SCREEN CLICK FOR MUTE/UNMUTE
  // =========================
  const handleScreenClick = useCallback((e) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    if (showComments || uploadModal) {
      return;
    }
    toggleMute();
  }, [toggleMute, showComments, uploadModal]);

  // =========================
  // FETCH REELS
  // =========================
  const fetchReels = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/api/chills/reels`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setReels(res.data.reels);
        videoRefs.current = new Array(res.data.reels.length);
      }
    } catch (error) {
      console.log("Error fetching reels:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  // =========================
  // INTERSECTION OBSERVER FOR VIDEOS
  // =========================
  useEffect(() => {
    if (!reels.length || !feedRef.current) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (showComments || uploadModal) return;

        entries.forEach((entry) => {
          const video = entry.target;
          const index = videoRefs.current.indexOf(video);

          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            // Preload adjacent videos
            [index - 1, index, index + 1].forEach(i => {
              const v = videoRefs.current[i];
              if (v && v.preload !== 'auto') {
                v.setAttribute('preload', 'metadata');
              }
            });

            // Pause all other videos
            videoRefs.current.forEach((v, i) => {
              if (v && i !== index) {
                v.pause();
                // Clear source for far away videos
                if (Math.abs(i - index) > 2) {
                  v.src = '';
                }
              }
            });

            // Play current video
            if (video.paused && video.src) {
              video.play().catch(error => {
                console.log('Playback failed:', error);
              });
            }

            setCurrentVideoIndex(index);
          }
        });
      },
      {
        root: feedRef.current,
        threshold: [0.6],
        rootMargin: '100px 0px'
      }
    );

    videoRefs.current.forEach((video) => {
      if (video) {
        observer.observe(video);
      }
    });

    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [reels, showComments, uploadModal]);

  // =========================
  // MUTE UPDATE EFFECT
  // =========================
  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = isGloballyMuted;
      }
    });
  }, [isGloballyMuted]);

  // =========================
  // PAUSE VIDEOS WHEN MODAL OPEN
  // =========================
  useEffect(() => {
    if (uploadModal || showComments) {
      pauseAllVideos();
    } else {
      // Resume current video
      const currentVideo = videoRefs.current[currentVideoIndex];
      if (currentVideo && currentVideo.src) {
        currentVideo.play().catch(() => {});
      }
    }
  }, [uploadModal, showComments, pauseAllVideos, currentVideoIndex]);

  // =========================
  // DEBOUNCED SCROLL HANDLER
  // =========================
  const debouncedSetCurrentIndex = useMemo(
    () => debounce((index) => {
      setCurrentVideoIndex(index);
    }, 100),
    []
  );

  // =========================
  // LIKE HANDLER
  // =========================
  const handleLike = useCallback(async (reelId, index, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const res = await axios.post(
        `/api/chills/reels/${reelId}/like`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setReels((prevReels) =>
          prevReels.map((reel, i) =>
            i === index
              ? {
                  ...reel,
                  likesCount: res.data.likesCount,
                  isLiked: res.data.liked,
                }
              : reel
          )
        );
      }
    } catch (error) {
      console.log("Error liking reel:", error);
    }
  }, [axios]);

  // =========================
  // COMMENT HANDLERS
  // =========================
  const fetchComments = useCallback(async (reelId) => {
    try {
      setLoadingComments(true);
      const res = await axios.get(
        `/api/chills/reels/${reelId}/comments`,
        { withCredentials: true }
      );
      
      if (res.data.success) {
        setComments(res.data.comments || []);
      }
    } catch (error) {
      console.log("Error fetching comments:", error);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  }, [axios]);

  const handleAddComment = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!commentText.trim() || !selectedReel) return;

    try {
      const res = await axios.post(
        `/api/chills/reels/${selectedReel._id}/comments`,
        { text: commentText },
        { withCredentials: true }
      );

      if (res.data.success) {
        setComments(prevComments => [res.data.comment, ...prevComments]);
        setCommentText("");

        setReels((prev) =>
          prev.map((r) =>
            r._id === selectedReel._id
              ? { ...r, commentsCount: (r.commentsCount || 0) + 1 }
              : r
          )
        );
      }
    } catch (error) {
      console.log("Error adding comment:", error);
    }
  }, [axios, commentText, selectedReel]);

  const handleOpenComments = useCallback((reel, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    pauseAllVideos();
    setSelectedReel(reel);
    fetchComments(reel._id);
    setShowComments(true);
  }, [pauseAllVideos, fetchComments]);

  const handleCloseComments = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowComments(false);
    setSelectedReel(null);
    setComments([]);
    setCommentText("");
  }, []);

  // =========================
  // SAVE HANDLER
  // =========================
  const handleSave = useCallback(async (reelId, index, e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await axios.post(
        `/api/chills/reels/${reelId}/save`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setReels((prevReels) =>
          prevReels.map((reel, i) =>
            i === index
              ? {
                  ...reel,
                  savesCount: res.data.savesCount,
                  isSaved: res.data.saved,
                }
              : reel
          )
        );
      }
    } catch (error) {
      console.log("Error saving reel:", error);
    }
  }, [axios]);

  // =========================
  // MODAL HANDLERS
  // =========================
  const handleOpenModal = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    pauseAllVideos();
    setUploadModal(true);
  }, [pauseAllVideos]);

  const handleCloseModal = useCallback(() => {
    setUploadModal(false);
  }, []);

  const handleReelCreated = useCallback(() => {
    fetchReels();
  }, []);

  // =========================
  // CLICK OUTSIDE COMMENTS
  // =========================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (commentsPanelRef.current && !commentsPanelRef.current.contains(e.target)) {
        handleCloseComments(e);
      }
    };

    if (showComments) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showComments, handleCloseComments]);

  // =========================
  // VISIBILITY CHECK FOR REELS
  // =========================
  const visibleReels = useMemo(() => {
    return reels.map((reel, index) => ({
      ...reel,
      isVisible: Math.abs(index - currentVideoIndex) <= 1
    }));
  }, [reels, currentVideoIndex]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div 
      className="bg-black text-white min-h-screen relative"
      onClick={handleScreenClick}
    >
      {/* Mute/Unmute Indicator */}
      {showMuteIndicator && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-black bg-opacity-80 px-3 py-3 rounded-full transition-opacity duration-300">
          <div className="flex items-center gap-3">
            {isGloballyMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
              </svg>
            )}
          </div>
        </div>
      )}

      {/* Create Reel Button - Floating */}
      <button
        onClick={handleOpenModal}
        className="fixed bottom-24 right-4 z-40 bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>

      {/* Reels Feed */}
      <div 
        ref={feedRef}
        className="fixed overflow-y-scroll snap-y snap-mandatory scroll-smooth"
        style={{ 
          top: '60px',
          bottom: '80px',
          left: 0,
          right: 0,
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth'
        }}
      >
        {visibleReels.map((reel, index) => (
          <ReelItem
            key={reel._id}
            reel={reel}
            index={index}
            isGloballyMuted={isGloballyMuted}
            onLike={handleLike}
            onComment={handleOpenComments}
            onSave={handleSave}
            isVisible={reel.isVisible}
          />
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

      {/* Comments Side Panel */}
      {showComments && selectedReel && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-[100] transition-opacity duration-300"
            onClick={handleCloseComments}
          />
          
          {/* Side Panel */}
          <div 
            ref={commentsPanelRef}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-xl transform transition-transform duration-300 ease-in-out"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Comments</h2>
              <button 
                onClick={handleCloseComments}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Comments List */}
            <div className="h-[calc(100%-130px)] overflow-y-auto p-4 space-y-4">
              {loadingComments ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment._id} className="flex gap-3 animate-fadeIn">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-white">
                        {comment.user?.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">
                          @{comment.user?.username}
                        </p>
                        {comment.user?.isVerified && (
                          <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z" />
                          </svg>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(comment.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-gray-500">No comments yet</p>
                  <p className="text-sm text-gray-400 mt-1">Be the first to comment!</p>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleAddComment}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment(e);
                      }
                    }}
                    placeholder="Add a comment..."
                    className="flex-1 bg-gray-100 text-gray-900 px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    maxLength={500}
                  />
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className={`px-6 py-2 rounded-full font-semibold transition-all ${
                      commentText.trim()
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 hover:shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Post
                  </button>
                </div>
                {commentText.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2 text-right">
                    {commentText.length}/500
                  </p>
                )}
              </form>
            </div>
          </div>
        </>
      )}

      {/* Create Reel Modal */}
      <CreateReelModal 
        isOpen={uploadModal}
        onClose={handleCloseModal}
        onSuccess={handleReelCreated}
      />
    </div>
  );
}

export default ChillDashboard;