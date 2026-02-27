import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reel: { type: mongoose.Schema.Types.ObjectId, ref: 'Reel', required: true },
    text: { type: String, required: true }
  },
  { timestamps: true }
);

const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
export default Comment;