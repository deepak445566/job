import React, { useState, useEffect } from "react";
import axios from "axios";

function CreateReelModal({ isOpen, onClose, onSuccess }) {
  const [caption, setCaption] = useState("");
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [uploading, setUploading] = useState(false);

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

  const handleClose = () => {
    setVideo(null);
    setVideoPreview("");
    setCaption("");
    onClose();
  };

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
    <div className="fixed inset-0 bg-black bg-opacity-90 z-[100] flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-lg relative animate-fadeIn">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Create new reel</h2>
          <button
            onClick={handleClose}
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
  );
}

export default CreateReelModal;