import mongoose from "mongoose";

const doubtSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
    },

    subject: {
      type: String,
      required: true,
    },

    tags: [String],

    isResolved: {
      type: Boolean,
      default: false,
    },

    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Doubt = mongoose.models.Doubt || mongoose.model("Doubt", doubtSchema);
export default Doubt;