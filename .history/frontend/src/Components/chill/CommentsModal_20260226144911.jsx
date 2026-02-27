import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaPaperPlane, FaHeart, FaRegHeart } from 'react-icons/fa';

import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContextProvider';

const CommentsModal = ({ reelId, onClose, onCommentAdded }) => {
  const { user, axios, setShowLogin } = useAppContext();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const commentsEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchComments();
    // Focus input after modal opens
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`/api/reels/${reelId}/comments`);
      setComments(data.comments);
    } catch (error) {
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to comment');
      setShowLogin(true);
      onClose();
      return;
    }

    if (!newComment.trim()) return;

    setSubmitting(true);

    try {
      const { data } = await axios.post(`/api/reels/${reelId}/comments`, {
        text: newComment.trim()
      });

      setComments(prev => [data.comment, ...prev]);
      setNewComment('');
      onCommentAdded(data.comment);
      
      // Scroll to top to show new comment
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      toast.error('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId, liked) => {
    if (!user) {
      toast.error('Please login to like');
      return;
    }

    try {
      await axios.post(`/api/comments/${commentId}/like`);
      setComments(prev =>
        prev.map(comment =>
          comment._id === commentId
            ? {
                ...comment,
                likes: liked
                  ? comment.likes.filter(id => id !== user._id)
                  : [...comment.likes, user._id],
                likesCount: liked ? comment.likesCount - 1 : comment.likesCount + 1
              }
            : comment
        )
      );
    } catch (error) {
      toast.error('Error liking comment');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  <img
                    src={comment.user?.avatar || '/default-avatar.png'}
                    alt={comment.user?.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">
                        {comment.user?.username}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{comment.text}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <button
                        onClick={() => handleLikeComment(
                          comment._id,
                          comment.likes?.includes(user?._id)
                        )}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
                      >
                        {comment.likes?.includes(user?._id) ? (
                          <FaHeart className="text-red-500" size={12} />
                        ) : (
                          <FaRegHeart size={12} />
                        )}
                        <span>{comment.likesCount || 0}</span>
                      </button>
                      <button className="text-xs text-gray-500 hover:text-gray-700">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={commentsEndRef} />
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No comments yet. Be the first to comment!
            </div>
          )}
        </div>

        {/* Comment Input */}
        <form onSubmit={handleSubmit} className="border-t p-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength="500"
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <FaPaperPlane size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentsModal;