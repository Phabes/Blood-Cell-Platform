const Message = require("../models/message");
const Student = require("../models/student");

module.exports.sendMessageToAll = async (req, res) => {
  try {
    const { message } = req.body;
    const messageToAll = new Message(message);
    await messageToAll.save();
    res.status(200).json({
      action: "MESSAGE_SEND_TO_ALL",
    });
  } catch (err) {
    res.status(500).json({ action: "Something wrong" });
  }
};

module.exports.sendMessageToOne = async (req, res) => {
  try {
    const { message, receiver } = req.body;
    await Student.findByIdAndUpdate(receiver, {
      $addToSet: { messages: message },
    });
    res.status(200).json({
      action: "MESSAGE_SEND_TO_ONE",
    });
  } catch (err) {
    res.status(500).json({ action: "Something wrong" });
  }
};
