import mongoose from "mongoose";
import User from "./UserModels.js";
const reelSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    videoUrl: { type: String, required: true },
    caption: { type: String, default: '' },
   
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    saves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

const Reel = mongoose.models.Reel || mongoose.model("Reel", reelSchema);
export default Reel;