const mongoose = require("mongoose");

// Define the schema for a post
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    previewPics: {
      type: String,
      required: true,
    },
    detailPics: {
      type: String,
      required: true,
    },
    creatorId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    like: {
      type: [mongoose.Types.ObjectId],
      default: [],
      ref: "User",
    },
    comments: {
      type: [mongoose.Types.ObjectId],
      default: [],
      ref: "Comment",
    },
  },
  { timestamps: true }
);

const postModel = mongoose.model("Posts", postSchema);
module.exports = postModel;
