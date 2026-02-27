import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import CreateReelModal from "./CreateReelModal";

function ChillDashboard() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadModal, setUploadModal] = useState(false);
  const [isGloballyMuted, setIsGloballyMuted] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [selectedReel, setSelectedReel] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

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
  // AUTO PLAY FEATURE
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
          videoRefs.current.forEach((v, i) => {
            if (v && i !== videoIndex) {
              v.pause();
            }
          });

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
  }, [reels]);

  // Separate effect for mute updates
  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = isGloballyMuted;
      }
    });
  }, [isGloballyMuted]);

  // =========================
  // LIKE HANDLER
  // =========================
  const handleLike = async (reelId, index) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/chills/reels/${reelId}/like`,
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
      console.log(error);
    }
  };

  // =========================
  // COMMENT HANDLERS - FIXED
  // =========================
  const fetchComments = async (reelId) => {
    try {
      setLoadingComments(true);
      const res = await axios.get(
        `http://localhost:3000/api/chills/reels/${reelId}/comments`,
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
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !selectedReel) return;

    try {
      const res = await axios.post(
        `http://localhost:3000/api/chills/reels/${selectedReel._id}/comments`,
        { text: commentText },
        { withCredentials: true }
      );

      if (res.data.success) {
        // Add new comment to list
        setComments(prevComments => [res.data.comment, ...prevComments]);
        setCommentText("");

        // Update comment count in reels
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
  };

  const handleOpenComments = (reel) => {
    pauseAllVideos();
    setSelectedReel(reel);
    fetchComments(reel._id);
    setShowComments(true);
  };

  const handleCloseComments = () => {
    setShowComments(false);
    setSelectedReel(null);
    setComments([]);
    setCommentText("");
  };

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
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-70"></div>

            {/* Caption Section */}
            <div className="absolute bottom-2 left-4 right-16 z-10">
              <div className="flex items-center mb-2 gap-3">
                <div>
                  <img src="/images/log.jpg" className="h-10 w-10 rounded-full" alt="profile"/>
                </div>
                <div>
                  <h3 className="font-bold text-white">@{reel.user?.username}</h3>
                  <p className="text-sm text-gray-300">{reel.caption}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute right-0 bottom-5 flex flex-col items-center gap-6 z-10">
              {/* Like Button */}
              <button
                className="flex flex-col items-center group"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(reel._id, index);
                }}
              >
                <div className="bg-opacity-50 p-3 rounded-full group-hover:scale-110 transition-transform">
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
                  className={`text-xs mt-1 ${
                    reel.isLiked ? "text-red-500 font-semibold" : "text-white"
                  }`}
                >
                  {reel.likesCount || 0}
                </span>
              </button>

              {/* Comment Button */}
              <button 
                className="flex flex-col items-center group" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenComments(reel);
                }}
              >
                <div className="bg-opacity-50 p-3 rounded-full group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="size-8" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                  </svg>
                </div>
                <span className="text-xs mt-1">{reel.commentsCount || 0}</span>
              </button>

              {/* Save Button */}
              <button className="flex flex-col items-center group" onClick={(e) => e.stopPropagation()}>
                <div className="bg-opacity-50 p-3 rounded-full group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="size-8" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
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

      {/* Comments Modal */}
      {showComments && selectedReel && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-[100] flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Comments</h2>
            <button 
              onClick={handleCloseComments}
              className="text-gray-400 hover:text-white p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loadingComments ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-white">
                      {comment.user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">
                      @{comment.user?.username}
                    </p>
                    <p className="text-sm text-gray-300">{comment.text}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">No comments yet. Be the first to comment!</p>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddComment();
                  }
                }}
                placeholder="Add a comment..."
                className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleAddComment}
                disabled={!commentText.trim()}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  commentText.trim()
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105'
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

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