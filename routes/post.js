const express = require("express");
const {
  makePost,
  getAllPost,
  getSinglePost,
  updatePost,
  deletePost,
  likePost,
} = require("../controllers/post"); // Import controller functions
const { verify } = require("../middlewares/verify");
const routes = express.Router(); // Create an instance of the router

// Route to create a new post
routes.post("/post", verify, makePost);

// Route to get all posts
routes.get("/post", getAllPost);

// Route to get a single post by ID
routes.get("/post/:id", verify, getSinglePost);

// Route to update an existing post
routes.put("/post", updatePost);

// Route to delete a post
routes.delete("/post", deletePost);

// Route to like or dislike a post
routes.post("/post/like", likePost);

// Export the router to be used in other parts of the application
module.exports = routes;
