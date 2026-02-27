import React, { useState, useRef, useEffect } from 'react';
import { 
  FaHeart, 
  FaRegHeart, 
  FaComment, 
  FaBookmark, 
  FaRegBookmark,
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaEllipsisH,
  FaShare,
  FaUserPlus,
  FaUserCheck
} from 'react-icons/fa';

import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import CommentsModal from './CommentsModal';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContextProvider';

const Reel = ({ reel, isActive }) => {
  const { user, axios, setShowLogin } = useAppContext();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [liked, setLiked] = useState(reel.isLiked || false);
  const [saved, setSaved] = useState(reel.isSaved || false);
  const [following, setFollowing] = useState(false);
  const [likesCount, setLikesCount] = useState(reel.likesCount || 0);
  const [commentsCount, setCommentsCount] = useState(reel.commentsCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (isActive) {
      const playVideo = async () => {
        try {
          await videoRef.current?.play();
          setIsPlaying(true);
        } catch (err) {
          console.log("Auto-play prevented:", err);
        }
      };
      playVideo();
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  useEffect(() => {
    if (reel.user) {
      setFollowing(reel.user.isFollowing || false);
    }
  }, [reel.user]);

  const handleVideoClick = () => {
    if (isPlaying) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like');
      setShowLogin(true);
      return;
    }

    try {
      const { data } = await axios.post(`/api/reels/${reel._id}/like`);
      setLiked(data.liked);
      setLikesCount(data.likesCount);
      
      if (data.liked) {
        toast.success('Liked!');
      }
    } catch (error) {
      toast.error('Error liking reel');
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('Please login to save');
      setShowLogin(true);
      return;
    }

    try {
      const { data } = await axios.post(`/api/reels/${reel._id}/save`);
      setSaved(data.saved);
      toast.success(data.saved ? 'Saved to collection' : 'Removed from collection');
    } catch (error) {
      toast.error('Error saving reel');
    }
  };

  const handleFollow = async () => {
    if (!user) {
      toast.error('Please login to follow');
      setShowLogin(true);
      return;
    }

    if (reel.user._id === user._id) {
      toast.error("You can't follow yourself");
      return;
    }

    try {
      const { data } = await axios.post(`/api/users/${reel.user._id}/follow`);
      setFollowing(data.following);
      toast.success(data.following ? `Following ${reel.user.username}` : `Unfollowed ${reel.user.username}`);
    } catch (error) {
      toast.error('Error following user');
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Check out this reel',
        url: window.location.href
      });
    } catch (err) {
      // Fallback to copy link
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleProfileClick = () => {
    navigate(`/profile/${reel.user.username}`);
  };

  return (
    <>
      <div className="relative h-screen w-full snap-start bg-black">
        {/* Video */}
        <video
          ref={videoRef}
          src={reel.videoUrl}
          className="h-full w-full object-cover"
          loop
          playsInline
          muted={isMuted}
          onClick={handleVideoClick}
          onTimeUpdate={handleTimeUpdate}
        />

        {/* Video Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-600">
          <div 
            className="h-full bg-red-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Video Controls Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60">
          
          {/* Right Side Actions */}
          <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6">
            {/* Like Button */}
            <button 
              onClick={handleLike}
              className="flex flex-col items-center gap-1 text-white"
            >
              <div className="text-3xl">
                {liked ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart />
                )}
              </div>
              <span className="text-xs font-semibold">{likesCount}</span>
            </button>

            {/* Comment Button */}
            <button 
              onClick={() => setShowComments(true)}
              className="flex flex-col items-center gap-1 text-white"
            >
              <FaComment className="text-3xl" />
              <span className="text-xs font-semibold">{commentsCount}</span>
            </button>

            {/* Save Button */}
            <button 
              onClick={handleSave}
              className="flex flex-col items-center gap-1 text-white"
            >
              <div className="text-3xl">
                {saved ? (
                  <FaBookmark className="text-yellow-500" />
                ) : (
                  <FaRegBookmark />
                )}
              </div>
              <span className="text-xs font-semibold">Save</span>
            </button>

            {/* Share Button */}
            <button 
              onClick={handleShare}
              className="flex flex-col items-center gap-1 text-white"
            >
              <FaShare className="text-2xl" />
              <span className="text-xs font-semibold">Share</span>
            </button>

            {/* More Options */}
            <button 
              onClick={() => setShowOptions(!showOptions)}
              className="flex flex-col items-center gap-1 text-white"
            >
              <FaEllipsisH className="text-2xl" />
            </button>
          </div>

          {/* Left Side - User Info & Caption */}
          <div className="absolute left-4 bottom-20 right-16 text-white">
            {/* User Info */}
            <div className="flex items-center gap-3 mb-3">
              <img
                src={reel.user?.avatar || '/default-avatar.png'}
                alt={reel.user?.username}
                className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
                onClick={handleProfileClick}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span 
                    className="font-bold cursor-pointer hover:underline"
                    onClick={handleProfileClick}
                  >
                    {reel.user?.username}
                  </span>
                  {reel.user?._id !== user?._id && (
                    <button
                      onClick={handleFollow}
                      className="text-xs font-semibold text-blue-400 hover:text-blue-300"
                    >
                      {following ? 'Following' : 'Follow'}
                    </button>
                  )}
                </div>
                <span className="text-xs text-gray-300">
                  {formatDistanceToNow(new Date(reel.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>

            {/* Caption */}
            <p className="text-sm mb-2 line-clamp-2">
              <span className="font-bold mr-2">{reel.user?.username}</span>
              {reel.caption}
            </p>

            {/* View Comments Link */}
            {commentsCount > 0 && (
              <button
                onClick={() => setShowComments(true)}
                className="text-xs text-gray-400 hover:text-gray-300"
              >
                View all {commentsCount} comments
              </button>
            )}
          </div>

          {/* Bottom Center - Play/Pause Indicator */}
          {!isPlaying && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-black/50 rounded-full p-4">
                <FaPlay className="text-white text-4xl" />
              </div>
            </div>
          )}

          {/* Top Right - Sound Toggle */}
          <button
            onClick={toggleMute}
            className="absolute top-4 right-4 bg-black/50 rounded-full p-2 text-white"
          >
            {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
          </button>
        </div>
      </div>

      {/* Comments Modal */}
      {showComments && (
        <CommentsModal
          reelId={reel._id}
          onClose={() => setShowComments(false)}
          onCommentAdded={(newComment) => {
            setCommentsCount(prev => prev + 1);
          }}
        />
      )}
    </>
  );
};

export default Reel;