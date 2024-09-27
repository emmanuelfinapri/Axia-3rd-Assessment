// Importing the required model
const postModel = require("../models/post");

// Function to create a new post
const makePost = async (req, res) => {
  const { creatorId, ...others } = req.body; // Extract the request body
  const { id } = req.user;
  const newPost = new postModel({ ...others, creatorId: id }); // Create a new post instance

  try {
    // Save the new post to the database
    await newPost.save();
    // Send a success response
    res.json({ message: "Post created successfully" });
  } catch (error) {
    // Send an error response if there's an exception
    res.json({ message: error.message });
  }
};

// Function to get all posts
const getAllPost = async (req, res) => {
  try {
    // Retrieve all posts from the database
    const allPost = await postModel
      .find()
      .populate({ path: "comments", select: "comment postId commentorsId" });
    // Send a response with all posts
    res.json(allPost);
  } catch (error) {
    // Send an error response if there's an exception
    res.json({ message: error.message });
  }
};

// Function to get a single post by ID
const getSinglePost = async (req, res) => {
  const { id } = req.params; // Extract the post ID from the request parameters

  try {
    // Retrieve a single post by its ID
    const singlePost = await postModel
      .findById(id)
      .populate({ path: "comments", select: "comment postId commentorsId" });
    // Send a response with the post
    res.json(singlePost);
  } catch (error) {
    // Send an error response if there's an exception
    res.json({ message: error.message });
  }
};

// Function to update a post
const updatePost = async (req, res) => {
  const { id, creatorId, ...others } = req.body; // Extract post ID, creator ID, and other update fields

  // Retrieve the post to be updated by its ID
  const post = await postModel.findById(id);

  // Check if the post belongs to the creator making the request
  if (post.creatorId.toString() !== creatorId) {
    return res.json({ message: "You can only update your own post" });
  }

  try {
    // Update the post with new data
    await postModel.findByIdAndUpdate(id, others, { new: true });
    // Send a success response
    res.json({ message: "Post updated successfully" });
  } catch (error) {
    // Send an error response if there's an exception
    res.json({ message: error.message });
  }
};

// Function to delete a post
const deletePost = async (req, res) => {
  const { id, creatorId } = req.body; // Extract post ID and creator ID from the request body

  // Retrieve the post to be deleted by its ID
  const post = await postModel.findById(id);

  // Check if the post belongs to the creator making the request
  if (post.creatorId.toString() !== creatorId) {
    return res.json({ message: "You can only delete your own post" });
  }

  try {
    // Delete the post from the database
    await postModel.findByIdAndDelete(id);
    // Send a success response
    res.json({ message: "Post has been deleted successfully" });
  } catch (error) {
    // Send an error response if there's an exception
    res.json({ message: error.message });
  }
};

// Function to like or dislike a post
const likePost = async (req, res) => {
  const { id, userId } = req.body; // Extract post ID and user ID from the request body
  const thePost = await postModel.findById(id); // Retrieve the post by its ID

  // Check if the post exists
  if (!thePost) {
    return res.json({ message: "This post does not exist" });
  }

  // Array to hold all likes
  const gottenLikes = thePost.like;

  // Check if the user has already liked the post
  const checkUserInArray = gottenLikes.includes(userId);

  if (!checkUserInArray) {
    // Add the user to the likes array if they haven't liked the post
    gottenLikes.push(userId);
    res.json({ message: `You have liked this post` });
  } else {
    // Remove the user from the likes array if they have already liked the post
    const getIndex = gottenLikes.indexOf(userId);
    gottenLikes.splice(getIndex, 1);
    res.json({ message: `You have disliked this post` });
  }

  // Update the likes in the database
  try {
    await postModel.findByIdAndUpdate(id, { like: gottenLikes }, { new: true });
  } catch (error) {
    // Send an error response if there's an exception
    res.json({ message: error.message });
  }
};

// Export all functions for use in other parts of the application
module.exports = {
  makePost,
  getAllPost,
  getSinglePost,
  updatePost,
  deletePost,
  likePost,
};
