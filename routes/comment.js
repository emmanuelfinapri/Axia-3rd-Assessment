const express = require("express");
const {
  makeComment,
  editComment,
  deleteComment,
  getComment,
  getAllComments,
} = require("../controllers/comment"); // Import controller functions
const { verify } = require("../middlewares/verify");
const router = express.Router(); // Create an instance of the router

// Route to create a new comment
router.post("/comments", verify, makeComment);

// Route to get a comment
router.get("/comments", verify, getComment);

// Route to get all comments
router.get("/comment", getAllComments);

// Route to update an existing comment
router.put("/comments", editComment);

// Route to delete a comment
router.delete("/comments", deleteComment);

// Export the router to be used in other parts of the application
module.exports = router;
