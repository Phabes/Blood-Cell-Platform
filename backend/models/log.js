const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  date: Date,
  sender: String,
  text: String,
  type: String,
});

const Log = mongoose.model("Log", messageSchema, "logs");
module.exports = Log;
