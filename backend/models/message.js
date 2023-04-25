const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  date: Date,
  sender: mongoose.Schema.ObjectId,
  text: String,
});

const Message = mongoose.model("Message", messageSchema, "messages");
module.exports = Message;
