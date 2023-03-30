const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  nick: String,
  github: String,
});

const Student = mongoose.model("Student", studentSchema, "students");
module.exports = Student;