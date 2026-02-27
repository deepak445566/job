import React, { useState, useEffect, useRef } from 'react';

import { FiHeart, FiBookmark, FiMessageCircle, FiUpload } from 'react-icons/fi';
import { FaHeart, FaBookmark } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContextProvider';

function ChillDashboard() {
  const { user, axios, mode, toggleMode } = useAppContext();
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Video refs for playback
  const videoRefs = useRef({});
  const observerRef = useRef();

  // Fetch reels
  useEffect(() => {
    fetchReels();
  }, []);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const videoId = entry.target.dataset.videoId;
        const videoElement = videoRefs.current[videoId];

        if (videoElement) {
          if (entry.isIntersecting) {
            videoElement.play().catch(() => {});
          } else {
            videoElement.pause();
          }
        }
      });
    }, options);

    // Observe all video elements
    Object.values(videoRefs.current).forEach((video) => {
      if (video) observerRef.current.observe(video);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [reels]);

  const fetchReels = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/chi/reels?page=${currentPage}&limit=5`);
      
      if (data.success) {
        if (currentPage === 1) {
          setReels(data.reels);
        } else {
          setReels(prev => [...prev, ...data.reels]);
        }
        setHasMore(currentPage < data.pagination.totalPages);
      }
    } catch (error) {
      toast.error('Failed to fetch reels');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setCurrentPage(prev => prev + 1);
      fetchReels();
    }
  };

  // Handle video selection
  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a video file');
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast.error('Video size should be less than 50MB');
        return;
      }
      setSelectedVideo(file);
    }
  };

  // Handle reel upload
  const handleUploadReel = async (e) => {
    e.preventDefault();
    
    if (!selectedVideo) {
      toast.error('Please select a video');
      return;
    }

    if (!caption.trim()) {
      toast.error('Please add a caption');
      return;
    }

    if (mode === 'study') {
      toast.error('Switch to chill mode first!');
      toggleMode();
      return;
    }

    const formData = new FormData();
    formData.append('video', selectedVideo);
    formData.append('caption', caption);

    try {
      setUploading(true);
      const { data } = await axios.post('/api/reels', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.success) {
        toast.success('Reel uploaded!');
        setShowUploadModal(false);
        setCaption('');
        setSelectedVideo(null);
        setCurrentPage(1);
        fetchReels();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload');
    } finally {
      setUploading(false);
    }
  };

  // Handle like
  const handleLike = async (reelId, isLiked) => {
    try {
      const { data } = await axios.put(`/api/reels/${reelId}/${isLiked ? 'unlike' : 'like'}`);
      
      if (data.success) {
        setReels(reels.map(reel => 
          reel._id === reelId 
            ? { 
                ...reel, 
                isLiked: !isLiked,
                likesCount: isLiked ? reel.likesCount - 1 : reel.likesCount + 1 
              }
            : reel
        ));
      }
    } catch (error) {
      toast.error('Failed to like');
    }
  };

  // Handle save
  const handleSave = async (reelId, isSaved) => {
    try {
      const { data } = await axios.put(`/api/reels/${reelId}/${isSaved ? 'unsave' : 'save'}`);
      
      if (data.success) {
        setReels(reels.map(reel => 
          reel._id === reelId 
            ? { ...reel, isSaved: !isSaved, savesCount: isSaved ? reel.savesCount - 1 : reel.savesCount + 1 }
            : reel
        ));
      }
    } catch (error) {
      toast.error('Failed to save');
    }
  };

  return (
    <div className="h-screen bg-black overflow-hidden relative">
      {/* Upload Button */}
      <button
        onClick={() => setShowUploadModal(true)}
        className="fixed bottom-6 right-6 z-10 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition"
      >
        <FiUpload size={24} />
      </button>

      {/* Reels Container - TikTok Style */}
      <div 
        className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        onScroll={(e) => {
          const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
          if (bottom) loadMore();
        }}
      >
        {reels.map((reel, index) => (
          <div
            key={reel._id}
            className="h-screen snap-start snap-always relative flex items-center justify-center"
          >
            {/* Video */}
            <video
              ref={el => videoRefs.current[reel._id] = el}
              data-video-id={reel._id}
              src={reel.videoUrl}
              className="h-full w-full object-contain"
              loop
              playsInline
              muted={false}
            />

            {/* Overlay Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
              <div className="flex items-center gap-2 mb-2">
                <img 
                  src={reel.user?.avatar || '/default-avatar.png'} 
                  alt={reel.user?.name}
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <span className="font-semibold">{reel.user?.name}</span>
              </div>
              <p className="text-sm mb-2">{reel.caption}</p>
            </div>

            {/* Action Buttons - Right Side */}
            <div className="absolute right-4 bottom-20 flex flex-col gap-4">
              {/* Like Button */}
              <button
                onClick={() => handleLike(reel._id, reel.isLiked)}
                className="flex flex-col items-center"
              >
                {reel.isLiked ? (
                  <FaHeart className="text-red-500 text-3xl" />
                ) : (
                  <FiHeart className="text-white text-3xl" />
                )}
                <span className="text-white text-xs mt-1">{reel.likesCount}</span>
              </button>

              {/* Comment Button */}
              <button className="flex flex-col items-center">
                <FiMessageCircle className="text-white text-3xl" />
                <span className="text-white text-xs mt-1">{reel.commentsCount}</span>
              </button>

              {/* Save Button */}
              <button
                onClick={() => handleSave(reel._id, reel.isSaved)}
                className="flex flex-col items-center"
              >
                {reel.isSaved ? (
                  <FaBookmark className="text-yellow-500 text-3xl" />
                ) : (
                  <FiBookmark className="text-white text-3xl" />
                )}
                <span className="text-white text-xs mt-1">{reel.savesCount}</span>
              </button>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="h-screen flex items-center justify-center">
            <div className="text-white">Loading...</div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-white font-semibold">Upload Reel</h2>
              <button onClick={() => setShowUploadModal(false)}>
                <IoClose className="text-white text-2xl" />
              </button>
            </div>

            <form onSubmit={handleUploadReel}>
              {/* Video Input */}
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Select Video</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoSelect}
                  className="w-full text-white"
                  required
                />
              </div>

              {/* Caption Input */}
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Caption</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                  rows="3"
                  placeholder="Write a caption..."
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload Reel'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChillDashboard;