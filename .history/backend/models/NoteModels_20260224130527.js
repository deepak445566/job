import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
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
      trim: true,
    },

    subject: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    fileType: {
      type: String, // pdf, image, doc
      required: true,
    },

    tags: [String],

    downloads: {
      type: Number,
      default: 0,
    },

    bookmarks: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
  },
  { timestamps: true }
);

const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);
export default Note;