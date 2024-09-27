const express = require("express");
const routes = express.Router(); // Create an instance of the router
const {
  updateUserInfo,
  updatePassword,
  deleteUser,
  // forgotPassword,
  // updateRole,
} = require("../controllers/user"); // Import controller functions
const { verify } = require("../middlewares/verify");

// Route to update user information
routes.put("/user", verify, updateUserInfo);

// Route to change the user's password
routes.put("/change-password", verify, updatePassword);

// // Route to handle forgotten password
// routes.put("/forgot-password", forgotPassword);

// Route to delete a user
routes.delete("/delete-user", verify, deleteUser);

// // Route to change the role of the users
// routes.put("/change-role", verify, updateRole);

// Export the router to be used in other parts of the application
module.exports = routes;
