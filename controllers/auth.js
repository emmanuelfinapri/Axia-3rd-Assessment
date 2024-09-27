const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Function to register a new user
const register = async (req, res) => {
  const { password, role, ...others } = req.body; // Extract password and other user details
  const salt = bcrypt.genSaltSync(10); // Generate salt for hashing
  const hashedPassword = bcrypt.hashSync(password, salt); // Hash the password

  const newUser = new userModel({
    ...others,
    password: hashedPassword,
    role: "Basic", // Set default role to "Basic"
  });

  try {
    // Save the new user to the database
    const savedUser = await newUser.save();

    // Send a success response with 201 status (Created)
    res.status(201).json({
      message: "Account created successfully",
      user: savedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to log in a user
const loginUser = async (req, res) => {
  const { email, password } = req.body; // Extract email and password from request body

  try {
    // Check if the user exists in the database
    const userInfo = await userModel.findOne({ email });
    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the provided password with the stored hashed password
    const verify = bcrypt.compareSync(password, userInfo.password);
    if (!verify) {
      return res.status(401).json({ message: "Password does not match" });
    }

    const aboutUser = {
      id: userInfo.id,
      role: userInfo.role,
      username: userInfo.username,
      password: userInfo.password,
    };

    // Generate a JWT token and set it as a cookie
    const token = jwt.sign(aboutUser, process.env.JWT_SECRETE);
    res.cookie("user_token", token);

    res.status(200).json({
      message: `Welcome ${userInfo.username}, you are now logged in`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to log out a user
const logoutUser = (req, res) => {
  const { username } = req.user;
  try {
    // Clear the cookie and send a 200 status (OK) for successful logout
    res
      .clearCookie("user_token")
      .status(200)
      .json({ message: `Logged out ${username} successfully` });
  } catch (error) {
    // Send a 500 status (Internal Server Error) if there's an exception
    res.status(500).json({ message: "Something went wrong" });
  }
};

// OAuth registration function
const OauthRegister = async (req, res) => {
  const { username, email, gender } = req.body;

  try {
    // Check if account exists and if it's a credential-based account
    const findOne = await userModel.findOne({ email });
    if (findOne && findOne.credentialAccount) {
      return res.status(400).json({ message: "Illegal Parameters" });
    }

    // If the account exists, log in the user by setting a cookie
    if (findOne) {
      const aboutUser = {
        id: findOne.id,
        role: findOne.role,
        username: findOne.username,
        password: findOne.password,
      };
      const token = jwt.sign(aboutUser, process.env.JWT_SECRETE);
      return res
        .cookie("user_token", token)
        .status(200)
        .json({
          message: `Welcome ${aboutUser.username}, you have successfully logged in`,
        });
    }

    // If the account doesn't exist, create a new user
    const newUser = new userModel({
      username,
      email,
      gender,
      credentialAccount: false, // Specify it's not a credential-based account
    });
    const savedUser = await newUser.save();
    const aboutUser = {
      id: savedUser.id,
      role: savedUser.role,
      username: savedUser.username,
      password: savedUser.password,
    };

    // Generate JWT token and set it as a cookie
    const token = jwt.sign(aboutUser, process.env.JWT_SECRETE);
    res
      .cookie("user_token", token)
      .status(201) // 201 status (Created) for successful registration
      .json({
        message: `Welcome ${aboutUser.username}, you have successfully registered`,
      });
  } catch (error) {
    // Send a 500 status (Internal Server Error) if there's an exception
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  register,
  loginUser,
  logoutUser,
  OauthRegister,
};
