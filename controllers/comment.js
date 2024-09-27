// Importing the required models
const commentModel = require("../models/comment");
const userModel = require("../models/user");
const postModel = require("../models/post");

// Function to create a new comment
const makeComment = async (req, res) => {
  const { comment, postId } = req.body;
  const { id } = req.user;

  try {
    // first create the comment
    const newComment = new commentModel({ comment, commentorsId: id, postId });
    const savedComment = await newComment.save();
    // modify tthe post comments field
    await postModel.findByIdAndUpdate(postId, {
      $push: { comments: savedComment.id },
    });
    res.json({ message: "comment made successfully" });
  } catch (error) {
    // Log the error message if there's an exception
    console.log(error.message);
  }
};

// Function to edit an existing comment
const editComment = async (req, res) => {
  const { id, comment } = req.body; // Extract the comment ID and new comment text from the request body

  try {
    // Find the comment to be edited by its ID
    const commentInfo = await commentModel.findById(id);

    // If the comment doesn't exist, send a 404 error response
    if (!commentInfo) {
      return res
        .status(404)
        .json({ message: "Sorry, this comment does not exist" });
    }

    // Update the comment with the new text
    await commentModel.findByIdAndUpdate(id, { comment: comment });

    // Send a success response after updating the comment
    res.json({ message: "Comment updated successfully" });
  } catch (error) {
    // Log the error message if there's an exception
    console.log(error.message);
  }
};

// Function to delete an existing comment
const deleteComment = async (req, res) => {
  const { id } = req.body; // Extract the comment ID from the request body

  try {
    // Find the comment to be deleted by its ID
    const commentInfo = await commentModel.findById(id);

    // If the comment doesn't exist, send a 404 error response
    if (!commentInfo) {
      return res
        .status(404)
        .json({ message: "Sorry, this comment does not exist" });
    }

    // Delete the comment from the database
    await commentModel.findByIdAndDelete(id);

    // Send a success response after deleting the comment
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    // Log the error message if there's an exception
    console.log(error.message);
  }
};

const getComment = async (req, res) => {
  const { commentId } = req.query;
  try {
    const oneComment = await commentModel
      .findById(commentId)
      .populate({ path: "commentorsId", select: "username email gender" })
      .populate({ path: "postId", select: "title desc" });
    res.json(oneComment);
  } catch (error) {
    console.log(error);
  }
};

const getAllComments = async (req, res) => {
  try {
    const allComments = await commentModel
      .find()
      .populate({ path: "postId", select: "title desc" })
      .populate({ path: "commentorsId", select: "username email" });
    res.json(allComments);
  } catch (error) {
    console.log(error.message);
  }
};

// Export the functions to be used in other parts of the application
module.exports = {
  makeComment,
  editComment,
  deleteComment,
  getComment,
  getAllComments,
};
