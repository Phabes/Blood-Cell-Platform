const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  nick: String,
  github: String,
  messages: Array,
  // messages: [
  //   {
  //     date: Date,
  //     sender: String,
  //     text: String,
  //   },
  // ],
  grades: Array,
  logs: Array,
});

const Student = mongoose.model("Student", studentSchema, "students");
module.exports = Student;
