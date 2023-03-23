const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: String,
  surname: String,
  email: String,
  password: String,
  role: String,
});

const User = mongoose.model("User", userSchema, "users");
module.exports = User;
