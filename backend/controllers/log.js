const Log = require("../models/log");
const Student = require("../models/student");

module.exports.getAllStudentLogs = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  try {
    const studentID = req.params.id;
    const logsToAll = await Log.find({}, { _id: 0, __v: 0 });
    const studentData = await Student.findById(studentID, {
      _id: 0,
      firstName: 0,
      lastName: 0,
      email: 0,
      password: 0,
      nick: 0,
      github: 0,
      grades: 0,
      messages: 0,
      __v: 0,
    });
    const logsToSpecificStudent = studentData.logs;
    const allLogs = logsToAll.concat(logsToSpecificStudent);
    allLogs.map((log) => {
      log.date = new Date(log.date);
    });
    allLogs.sort((a, b) => b.date - a.date);
    res.status(200).json(allLogs);
  } catch (err) {
    res.status(500).json({ action: "Something wrong" });
  }
};
