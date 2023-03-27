const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET, MAX_AGE } = require("../config/config");
const Student = require("../models/student");
const Teacher = require("../models/teacher");
const {
  validateRegisterCredentials,
} = require("../validators/registerValidator");

module.exports.registerStudent = async (req, res) => {
  try {
    const { newUser } = req.body;
    // const { isValid, message } = validateRegisterCredentials(newUser);
    // if (!isValid) {
    //   const errorMessages = message.join("\r\n");
    //   res.status(400).json({
    //     action: "USER_VALIDATION_ERROR",
    //     errorMessages: errorMessages,
    //   });
    //   return;
    // }

    const checkUser = await Student.findOne({ email: newUser.email });
    if (checkUser == null) {
      const user = new Student(newUser);
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();
      const token = jwt.sign({ id: user._id }, SECRET, {
        expiresIn: MAX_AGE,
      });
      res.cookie("token", token, { httpOnly: true, maxAge: MAX_AGE * 1000 });
      res.status(200).json({
        action: "STUDENT_REGISTERED",
        email: user.email,
        role: "student",
      });
    } else {
      res.status(200).json({ action: "USER_EXISTS" });
    }
  } catch (err) {
    res.status(500).json({ action: "Something wrong" });
  }
};

module.exports.registerTeacher = async (req, res) => {
  try {
    const { newUser } = req.body;
    // const { isValid, message } = validateRegisterCredentials(newUser);
    // if (!isValid) {
    //   const errorMessages = message.join("\r\n");
    //   res.status(400).json({
    //     action: "USER_VALIDATION_ERROR",
    //     errorMessages: errorMessages,
    //   });
    //   return;
    // }

    const checkUser = await Teacher.findOne({ email: newUser.email });
    if (checkUser == null) {
      const user = new Teacher(newUser);
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();
      const token = jwt.sign({ id: user._id }, SECRET, {
        expiresIn: MAX_AGE,
      });
      res.cookie("token", token, { httpOnly: true, maxAge: MAX_AGE * 1000 });
      res.status(200).json({
        action: "TEACHER_REGISTERED",
        email: user.email,
        role: "teacher",
      });
    } else {
      res.status(200).json({ action: "USER_EXISTS" });
    }
  } catch (err) {
    res.status(500).json({ action: "Something wrong" });
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email: email });
    if (student) {
      const auth = await bcrypt.compare(password, student.password);
      if (auth) {
        const token = jwt.sign(
          { id: student._id, role: student.role },
          SECRET,
          {
            expiresIn: MAX_AGE,
          }
        );
        res.cookie("token", token, { httpOnly: true, maxAge: MAX_AGE * 1000 });
        res.status(200).json({
          action: "STUDENT_LOGGED",
          email: student.email,
          role: "student",
        });
      } else res.status(200).json({ action: "WRONG_PASSWORD" });
      return;
    }
    const teacher = await Teacher.findOne({ email: email });
    if (teacher) {
      const auth = await bcrypt.compare(password, teacher.password);
      if (auth) {
        const token = jwt.sign(
          { id: teacher._id, role: teacher.role },
          SECRET,
          {
            expiresIn: MAX_AGE,
          }
        );
        res.cookie("token", token, { httpOnly: true, maxAge: MAX_AGE * 1000 });
        res.status(200).json({
          action: "TEACHER_LOGGED",
          email: teacher.email,
          role: "teacher",
        });
      } else res.status(200).json({ action: "WRONG_PASSWORD" });
    } else res.status(200).json({ action: "USER_DOESNT_EXIST" });
  } catch (err) {
    res.status(500).json({ action: "SOMETHING WRONG" });
  }
};
