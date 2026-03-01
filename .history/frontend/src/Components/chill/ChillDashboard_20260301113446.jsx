import React, { useEffect, useRef, useState, useCallback } from "react";
import CreateReelModal from "./CreateReelModal";
import { useAppContext } from "../../context/AppContextProvider";

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

  // =========================
  // PAUSE ALL VIDEOS
  // =========================
  const pauseAllVideos = useCallback(() => {
    videoRefs.current.forEach((video) => {
      if (video) video.pause();
    });
  }, []);

  // =========================
  // RESUME CURRENT VIDEO
  // =========================
  const resumeCurrentVideo = useCallback(() => {
    const currentVideo = videoRefs.current[currentVideoIndex];
    if (currentVideo && currentVideo.paused) {
      currentVideo.play().catch(() => {});
    }
  }, [currentVideoIndex]);

  // =========================
  // FETCH REELS
  // =========================
  const fetchReels = async () => {
    try {
      const res = await axios.get("/api/chills/reels", {
        withCredentials: true,
      });

      if (res.data.success) {
        setReels(res.data.reels);
        videoRefs.current = new Array(res.data.reels.length);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  // =========================
  // INTERSECTION OBSERVER (FINAL FIXED)
  // =========================
  useEffect(() => {
    if (!reels.length || !feedRef.current) return;

    if (observerRef.current) observerRef.current.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        if (showComments || uploadModal) return;

        entries.forEach((entry) => {
          const video = entry.target;
          const index = videoRefs.current.indexOf(video);

          if (entry.isIntersecting) {
            videoRefs.current.forEach((v, i) => {
              if (v && i !== index) v.pause();
            });

            if (video.paused) {
              video.play().catch(() => {});
            }

            setCurrentVideoIndex(index);
          }
        });
      },
      {
        root: feedRef.current,
        threshold: 0.75,
      }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    observerRef.current = observer;

    return () => observer.disconnect();
  }, [reels, showComments, uploadModal]);

  // =========================
  // GLOBAL MUTE EFFECT
  // =========================
  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) video.muted = isGloballyMuted;
    });
  }, [isGloballyMuted]);

  const toggleMute = () => {
    setIsGloballyMuted((prev) => !prev);
    setShowMuteIndicator(true);
    setTimeout(() => setShowMuteIndicator(false), 1000);
  };

  // =========================
  // COMMENT HANDLERS
  // =========================
  const handleOpenComments = (reel, e) => {
    e.stopPropagation();
    pauseAllVideos();
    setSelectedReel(reel);
    setShowComments(true);
  };

  const handleCloseComments = (e) => {
    if (e) e.stopPropagation();
    setShowComments(false);
    setSelectedReel(null);
    setComments([]);
    setCommentText("");
    resumeCurrentVideo();
  };

  // =========================
  // MODAL HANDLERS
  // =========================
  const handleOpenModal = (e) => {
    e.stopPropagation();
    pauseAllVideos();
    setUploadModal(true);
  };

  const handleCloseModal = () => {
    setUploadModal(false);
    resumeCurrentVideo();
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="bg-black text-white min-h-screen relative">
      <div
        ref={feedRef}
        className="fixed overflow-y-scroll snap-y snap-mandatory scroll-smooth"
        style={{
          top: "60px",
          bottom: "80px",
          left: 0,
          right: 0,
        }}
      >
        {reels.map((reel, index) => (
          <div
            key={reel._id}
            className="h-full snap-start relative bg-black"
            onClick={toggleMute}
          >
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={reel.videoUrl}
              loop
              muted={isGloballyMuted}
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute bottom-6 right-4 flex flex-col gap-6 z-10">
              <button
                onClick={(e) => handleOpenComments(reel, e)}
                className="text-white"
              >
                💬
              </button>

              <button
                onClick={(e) => handleOpenModal(e)}
                className="text-white"
              >
                ➕
              </button>
            </div>
          </div>
        ))}
      </div>

      {showComments && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-50"
          onClick={handleCloseComments}
        />
      )}

      <CreateReelModal
        isOpen={uploadModal}
        onClose={handleCloseModal}
        onSuccess={fetchReels}
      />
    </div>
  );
}

export default ChillDashboard;