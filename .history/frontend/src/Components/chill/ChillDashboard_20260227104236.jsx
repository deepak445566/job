import React, { useEffect, useState } from "react";
import axios from "axios";

function ChillDashboard() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReels = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/chills/reels", {
        withCredentials: true,
      });
      console.log(res.data)

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

  if (loading) return <div>Loading Reels...</div>;

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory bg-black">
      {reels.map((reel) => (
        <div
          key={reel._id}
          className="h-screen snap-start flex flex-col justify-center items-center text-white relative"
        >
          {/* Video */}
          <video
            src={reel.videoUrl}
            controls
            className="h-full w-full object-cover"
          />

          {/* Overlay Content */}
          <div className="absolute bottom-10 left-5">
            <h3 className="font-bold">@{reel.user?.username}</h3>
            <p>{reel.caption}</p>
          </div>

          {/* Right Side Actions */}
          <div className="absolute right-5 bottom-20 flex flex-col gap-4">
            <button>
              ❤️ {reel.likesCount}
            </button>

            <button>
              💬 {reel.commentsCount}
            </button>

            <button>
              💾 {reel.savesCount}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChillDashboard;