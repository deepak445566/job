import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAppContext } from "../../context/AppContextProvider";

function CreateReelModal({ isOpen, onClose, onSuccess }) {
    const { axios } = useAppContext();
  const [caption, setCaption] = useState("");
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideo(file);
      
      // Clean up previous preview URL
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideo(file);
      
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
    }
  };

  const handleClose = () => {
    setVideo(null);
    setVideoPreview("");
    setCaption("");
    setDragActive(false);
    onClose();
  };

  const handleCreateReel = async (e) => {
    e.preventDefault();

    if (!video) return;

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("videoFile", video);

    try {
      setUploading(true);

      const res = await axios.post(
        "/api/chills/reels",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        handleClose();
        onSuccess();
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-fadeIn">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-light text-gray-900 tracking-wide">
            Create new reel
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleCreateReel} className="p-6">
          {/* Video Upload Area */}
          {!videoPreview ? (
            <div 
              className={`mb-6 transition-all duration-200 ${
                dragActive ? 'scale-102' : ''
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <label className={`
                block w-full h-64 border-2 border-dashed rounded-xl 
                transition-all cursor-pointer overflow-hidden
                ${dragActive 
                  ? 'border-gray-400 bg-gray-50' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                }
              `}>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoSelect}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center h-full px-4">
                  <div className="w-16 h-16 mb-4 rounded-full bg-gray-50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600 text-center mb-1">
                    <span className="font-medium text-gray-900">Click to upload</span> or drag and drop
                  </span>
                  <span className="text-xs text-gray-400 text-center">
                    MP4, WebM, or MOV (max. 100MB)
                  </span>
                </div>
              </label>
            </div>
          ) : (
            /* Video Preview */
            <div className="relative mb-6 rounded-xl overflow-hidden bg-black aspect-video">
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
                className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-700 rounded-full p-2 shadow-lg transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Caption Input */}
          <div className="mb-6">
            <textarea
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows="3"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-light hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !video}
              className={`
                flex-1 px-4 py-3 rounded-xl font-light transition-all
                ${uploading || !video
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
                }
              `}
            >
              {uploading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t border-b border-white mr-2"></div>
                  <span className="text-sm">Uploading...</span>
                </div>
              ) : (
                <span className="text-sm">Share to Reels</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateReelModal;