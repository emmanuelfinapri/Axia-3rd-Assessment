// Importing required modules
const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Function to update user information
const updateUserInfo = async (req, res) => {
  const { password, ...others } = req.body;
  const { id, username } = req.user;

  try {
    const updatedUser = await userModel.findByIdAndUpdate(id, others, {
      new: true,
    });
    const message = `Hey ${username} you just updated your info`;
    res.status(200).json({ message, updatedUser }); // Status 200 for successful update
  } catch (error) {
    res.status(500).json({ message: error.message }); // Status 500 for server error
  }
};

// Function to update a user's password
const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body; // Extract old password, and new password from request body
  const { id } = req.user;
  const salt = bcrypt.genSaltSync(10); // Generate salt for hashing

  try {
    // Retrieve the user by ID
    const getUser = await userModel.findById(id);
    // Verify the old password matches the stored password
    const verify = bcrypt.compareSync(oldPassword, getUser.password);
    if (!verify) {
      return res.status(400).json({ message: "Old password does not match" }); // Status 400 for bad request
    }

    // Hash the new password
    const hashedPassword = bcrypt.hashSync(newPassword, salt);
    // Update the user's password in the database
    await userModel.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    // Send a success response
    res.status(200).json({ message: "Password updated successfully" }); // Status 200 for successful update
  } catch (error) {
    // Send an error response if there's an exception
    res.status(500).json({ message: error.message }); // Status 500 for server error
  }
};

// Function to handle forgot password
const forgotPassword = async (req, res) => {
  const { newPassword } = req.body; // Extract new password from request body
  const { id } = req.user;
  const salt = bcrypt.genSaltSync(10); // Generate salt for hashing
  const hashedPassword = bcrypt.hashSync(newPassword, salt); // Hash the new password

  try {
    // Retrieve the user by ID
    const getUser = await userModel.findById(id);
    if (!getUser) {
      return res
        .status(404)
        .json({ message: "Sorry, this user does not exist" }); // Status 404 for not found
    }

    // Update the user's password in the database
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    // Send a response with the updated user data
    res.status(200).json(updatedUser); // Status 200 for successful update
  } catch (error) {
    // Send an error response if there's an exception
    res.status(500).json({ message: error.message }); // Status 500 for server error
  }
};

// Function to delete a user
const deleteUser = async (req, res) => {
  const { id, username } = req.user;
  try {
    await userModel.findByIdAndDelete(id);
    res
      .clearCookie("user_token")
      .status(200)
      .json({
        message: `Hey ${username}, you have just deleted your account, sad to see you go`,
      }); // Status 200 for successful deletion
  } catch (error) {
    res.status(500).json({ message: "Sorry something went wrong" }); // Status 500 for server error
  }
};

const updateRole = async (req, res) => {
  const { id } = req.body;
  const { role } = req.user;
  if (role !== "SuperAdmin" && role !== "Admin") {
    return res
      .status(403)
      .json({ message: "You don't have permission to update roles" }); // Status 403 for forbidden
  }
  try {
    await userModel.findByIdAndUpdate(id, { role: "Admin" }, { new: true });
    res.status(200).json({
      message: "You have now changed this User's role to be an Admin",
    }); // Status 200 for successful update
  } catch (error) {
    res.status(500).json({ message: error.message }); // Status 500 for server error
  }
};

// Exporting all functions for use in other parts of the application
module.exports = {
  updateUserInfo,
  updatePassword,
  deleteUser,
  forgotPassword,
  updateRole,
};
