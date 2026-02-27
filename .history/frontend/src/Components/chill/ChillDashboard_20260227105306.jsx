import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

function ChillDashboard() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [caption, setCaption] = useState("");
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);

  const videoRefs = useRef([]);

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
        setCaption("");
        setVideo(null);
        fetchReels();
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setUploading(false);
    }
  };

  // =========================
  // TIKTOK STYLE AUTO PLAY
  // =========================
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;

          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.8 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [reels]);

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="bg-black text-white min-h-screen">

      {/* =========================
          CREATE REEL SECTION
      ========================== */}
      {/* <div className="p-4 border-b border-gray-700">
        <form onSubmit={handleCreateReel} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Write caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="p-2 rounded bg-gray-800"
          />

          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
            className="p-2"
          />

          <button
            type="submit"
            disabled={uploading}
            className="bg-blue-600 p-2 rounded hover:bg-blue-700"
          >
            {uploading ? "Uploading..." : "Upload Reel"}
          </button>
        </form>
      </div> */}

      {/* =========================
          REELS FEED
      ========================== */}
      <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
        {reels.map((reel, index) => (
          <div
            key={reel._id}
            className="h-screen snap-start flex justify-center items-center relative"
          >
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={reel.videoUrl}
              loop
             
              autoPlay
              playsInline
              className="h-full w-full object-cover"
            />

            {/* Caption Section */}
            <div className="absolute bottom-10 left-5">
              <h3 className="font-bold">@{reel.user?.username}</h3>
              <p>{reel.caption}</p>
            </div>

            {/* Action Buttons */}
            <div className="absolute right-5 bottom-20 flex flex-col gap-4">
              <button>❤️ {reel.likesCount}</button>
              <button>💬 {reel.commentsCount}</button>
              <button>💾 {reel.savesCount}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChillDashboard;