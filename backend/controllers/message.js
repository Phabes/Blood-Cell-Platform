const Log = require("../models/log");
const Message = require("../models/message");
const Student = require("../models/student");
const Teacher = require("../models/teacher");
const { validateRequestBodyExistence, validatePastDate } = require("../validators/requestBodyValidator");

module.exports.sendMessageToAll = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  try {
    const { message } = req.body;
    if (validateRequestBodyExistence([message.date, message.sender, message.text], res)) return;
    if (validatePastDate(message.date, res)) return;
    const messageToAll = new Message(message);
    await messageToAll.save();
    message.type = "message";
    const log = new Log(message);
    await log.save();
    res.status(200).json({
      action: "MESSAGE_SEND_TO_ALL",
    });
  } catch (err) {
    res.status(500).json({ action: "Something wrong" });
  }
};

module.exports.sendMessageToOne = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  try {
    const { message, receiver } = req.body;
    if (validateRequestBodyExistence([message.date, message.sender, message.text, receiver], res)) return;
    if (validatePastDate(message.date, res)) return;
    await Student.findByIdAndUpdate(receiver, {
      $addToSet: { messages: message },
    });
    message.type = "message";
    await Student.findByIdAndUpdate(receiver, {
      $addToSet: { logs: message },
    });
    res.status(200).json({
      action: "MESSAGE_SEND_TO_ONE",
    });
  } catch (err) {
    res.status(500).json({ action: "Something wrong" });
  }
};

module.exports.getAllStudentMessages = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  try {
    const studentID = req.params.id;
    const messagesToAll = await Message.find({}, { _id: 0, __v: 0 });
    const studentData = await Student.findById(studentID, {
      _id: 0,
      firstName: 0,
      lastName: 0,
      email: 0,
      password: 0,
      nick: 0,
      github: 0,
      grades: 0,
      logs: 0,
      __v: 0,
    });
    const messagesToSpecificStudent = studentData.messages;
    const allMessages = messagesToAll.concat(messagesToSpecificStudent);
    await Promise.all(
      allMessages.map(async (message) => {
        try {
          const sender = await Teacher.findById(message.sender);
          message.sender = sender.email;
          message.date = new Date(message.date);
          return message;
        } catch (e) {
          message.sender = "Person doesn't exist";
          return message;
        }
      })
    ).then((response) => {
      response.sort((a, b) => b.date - a.date);
      res.status(200).json(response);
    });
  } catch (err) {
    res.status(500).json({ action: "Something wrong" });
  }
};
