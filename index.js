const express = require("express");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const postRoute = require("./routes/post");
const commentRoute = require("./routes/comment");
const authRoute = require("./routes/auth");
const cookieparser = require("cookie-parser");
dotenv.config();
const mongoose = require("mongoose");
// creating instance of our applicarion
const app = express();

// create connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("connected"))
  .catch(() => console.log("error"));

// middleware to extract the body
app.use(express.json()); // for JSON used in our body
app.use(cookieparser());

// get secretkey
const PORT = process.env.PORT || 5000;

const secret = process.env.secret;
console.log(secret);

app.get("/", (req, res) => {
  res.send("Welcome Home");
});
// getting all Routes
app.use(userRoute);
app.use(postRoute);
app.use(commentRoute);
app.use(authRoute);

// this listen() method is used to start a web server and
// listen to the connections on the specified host and port.
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
