const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  date: Date,
  sender: String,
  text: String,
});

const Message = mongoose.model("Message", messageSchema, "messages");
module.exports = Message;
