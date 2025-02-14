require("dotenv").config();

const mongoose = require("mongoose");
mongoose.connect(process.env.CONNECTION_STRING);
const User = require("./models/user.model");

const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.json({ data: "Hello" });
});

app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName) {
    return res
      .status(400)
      .json({ error: true, message: "Full Name is Required." });
  }
  if (!email) {
    return res.status(400).json({ error: true, message: "Email is Required." });
  }
  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is Required." });
  }
  const isUser = await User.findOne({ email: email });
  if (isUser) {
    return res.json({
      error: true,
      message: "User Already Exist.",
    });
  }
  const user = new User({
    fullName,
    email,
    password,
  });
  await user.save();
  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "36000m",
  });
  res.json({
    error: false,
    user,
    accessToken,
    message: "Registration Successful.",
  });
});
app.listen(8000);

module.exports = app;