const mongoose = require("mongoose");

// Define the schema for a comment
const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  postId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Posts",
  },
  commentorsId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

// Create a model from the schema
const commentModel = mongoose.model("Comment", commentSchema);

// Export the model to be used in other parts of the application
module.exports = commentModel;
