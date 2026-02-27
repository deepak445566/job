import mongoose from "mongoose";

const reelSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    video: {  // ✅ video object banao
      url: { type: String, required: true },
      publicId: { type: String, required: true },
      duration: { type: Number, default: 0 }
    },
    caption: { type: String, default: '' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    saves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

const Reel = mongoose.models.Reel || mongoose.model("Reel", reelSchema);
export default Reel;