import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    doubt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doubt",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    answerText: {
      type: String,
      required: true,
    },

    upvotes: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],

    isAccepted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Answer = mongoose.models.Answer || mongoose.model("Answer", answerSchema);
export default Answer;