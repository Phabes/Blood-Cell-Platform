const mongoose = require("mongoose");

const teacherSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
});

const Teacher = mongoose.model("Teacher", teacherSchema, "teachers");
module.exports = Teacher;
