import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";


function ChillDashboard() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadModal, setUploadModal] = useState(false);

  const [caption, setCaption] = useState("");
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [uploading, setUploading] = useState(false);

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
  // AUTO PLAY FEATURE - FIXED VERSION
  // =========================
  useEffect(() => {
    if (!reels.length || !feedRef.current) return;

    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Make sure feedRef current is properly set
    const feedElement = feedRef.current;
    
    const options = {
      root: feedElement,
      rootMargin: "0px",
      threshold: 0.7,
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        const videoIndex = videoRefs.current.indexOf(video);
        
        if (entry.isIntersecting) {
          console.log("Video intersecting:", videoIndex); // Debug log
          
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
                console.log("Playing video:", videoIndex); // Debug log
              })
              .catch(error => {
                console.log("Autoplay prevented:", error);
                // Try with muted
                video.muted = true;
                video.play().catch(e => console.log("Still can't play:", e));
              });
          }
        } else {
          // Pause when not intersecting
          video.pause();
          video.muted = true;
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersection, options);

    // Observe all video elements with a small delay to ensure refs are set
    setTimeout(() => {
      videoRefs.current.forEach((video, index) => {
        if (video) {
          observerRef.current.observe(video);
          console.log("Observing video:", index); // Debug log
        }
      });
    }, 100);

    // Auto-play first video on load
    if (videoRefs.current[0]) {
      setTimeout(() => {
        const firstVideo = videoRefs.current[0];
        if (firstVideo) {
          firstVideo.play()
            .then(() => {
              firstVideo.muted = false;
              setCurrentVideoIndex(0);
            })
            .catch(e => {
              firstVideo.muted = true;
              firstVideo.play();
            });
        }
      }, 500);
    }

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
  // MODAL OPEN HANDLER - PAUSES ALL VIDEOS
  // =========================
  const handleOpenModal = () => {
    pauseAllVideos(); // Pause all videos when modal opens
    setUploadModal(true);
  };

  // =========================
  // MODAL CLOSE HANDLER
  // =========================
  const handleCloseModal = () => {
    setUploadModal(false);
    setVideo(null);
    setVideoPreview("");
    setCaption("");
  };

  // Handle video preview for upload
  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    setVideo(file);
    
    if (file) {
      // Clean up previous preview URL
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
    }
  };

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

  // =========================
  // CREATE REEL
  // =========================
  const handleCreateReel = async (e) => {
    e.preventDefault();

    if (!video) return alert("Please select a video");

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("videoFile", video);

    try {
      setUploading(true);

      const res = await axios.post(
        "http://localhost:3000/api/chills/reels",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        handleCloseModal();
        fetchReels();
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="bg-black text-white min-h-screen relative">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-gradient-to-b from-black to-transparent p-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Chill Reels
        </h1>
      </div>

      {/* Create Button - Commented out because heart icon in dock does the job */}
      {/* <button
        onClick={handleOpenModal}
        className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 
                   bg-gradient-to-r from-purple-500 to-pink-500 
                   text-white font-semibold py-4 px-8 rounded-full 
                   shadow-lg hover:scale-110 transition-all duration-300 
                   flex items-center gap-2 group"
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
      </button> */}

      {/* =========================
          REELS FEED - FIXED WITH HEADER AND FOOTER SPACE
      ========================== */}
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
            <div className="absolute bottom-28 left-4 right-16 z-10">
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
            <div className="absolute right-4 bottom-28 flex flex-col items-center gap-6 z-10">
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

      {/* Floating Dock - with heart click handler */}
      <FloatingDockMinimal onHeartClick={handleOpenModal} />

      {/* =========================
          CREATE POST MODAL - HIGHEST Z-INDEX
      ========================== */}
      {uploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-[100] flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl w-full max-w-lg relative animate-fadeIn">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h2 className="text-xl font-semibold">Create new reel</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateReel} className="p-4">
              {/* Video Preview */}
              {videoPreview ? (
                <div className="relative mb-4 rounded-lg overflow-hidden bg-black h-96">
                  <video
                    src={videoPreview}
                    className="w-full h-full object-contain"
                    controls
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setVideo(null);
                      setVideoPreview("");
                    }}
                    className="absolute top-2 right-2 bg-red-500 rounded-full p-2 hover:bg-red-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block w-full h-64 border-2 border-dashed border-gray-600 rounded-lg hover:border-purple-500 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoSelect}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center justify-center h-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                      </svg>
                      <span className="text-gray-400">Click to select video</span>
                    </div>
                  </label>
                </div>
              )}

              {/* Caption Input */}
              <textarea
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows="3"
                className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
              />

              {/* Upload Button */}
              <button
                type="submit"
                disabled={uploading || !video}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  uploading || !video
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105"
                }`}
              >
                {uploading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </div>
                ) : (
                  "Share to Reels"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChillDashboard;