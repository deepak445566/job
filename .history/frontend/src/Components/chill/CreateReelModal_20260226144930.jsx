import React, { useState, useRef } from 'react';
import { FaTimes, FaVideo, FaSpinner } from 'react-icons/fa';

import toast from 'react-hot-toast';

const CreateReelModal = ({ onClose, onReelCreated }) => {
  const { axios } = useAppContext();
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a video file');
        return;
      }

      // Check file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast.error('Video size should be less than 50MB');
        return;
      }

      setVideoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      toast.error('Please select a video');
      return;
    }

    if (!caption.trim()) {
      toast.error('Please add a caption');
      return;
    }

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('caption', caption);

    setUploading(true);
    setUploadProgress(0);

    try {
      const { data } = await axios.post('/api/reels', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      if (data.success) {
        onReelCreated(data.reel);
        toast.success('Reel uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading reel:', error);
      toast.error(error.response?.data?.message || 'Failed to upload reel');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const clearVideo = () => {
    setVideoFile(null);
    setVideoPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white rounded-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Create New Reel</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4">
          {/* Video Upload Area */}
          {!videoPreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
            >
              <FaVideo className="mx-auto text-4xl text-gray-400 mb-3" />
              <p className="text-gray-600 mb-2">Click to select or drag and drop</p>
              <p className="text-sm text-gray-500">MP4, MOV, or WebM (max 50MB)</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative mb-4">
              <video
                ref={videoRef}
                src={videoPreview}
                className="w-full rounded-lg max-h-96"
                controls
              />
              <button
                type="button"
                onClick={clearVideo}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
              >
                <FaTimes size={16} />
              </button>
            </div>
          )}

          {/* Caption Input */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              maxLength="2200"
            />
            <p className="text-right text-sm text-gray-500">
              {caption.length}/2200
            </p>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Uploading...</span>
                <span className="text-sm font-medium text-gray-700">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading || !videoFile || !caption.trim()}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {uploading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              'Post Reel'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateReelModal;