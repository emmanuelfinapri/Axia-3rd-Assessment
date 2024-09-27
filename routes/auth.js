const express = require("express");
const {
  loginUser,
  register,
  logoutUser,
  OauthRegister,
} = require("../controllers/auth");
const { verify } = require("../middlewares/verify");
const routes = express.Router();

// Route to register a new user
routes.post("/user", register);
// Route to log in a user
routes.post("/login", loginUser);
// Route to log out a user
routes.post("/logout", verify, logoutUser);
// Route for credential account
routes.post("/oauth", OauthRegister);

module.exports = routes;
