const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET, MAX_AGE, GITHUB_TOKEN } = require("../config/config");
const Student = require("../models/student");
const Teacher = require("../models/teacher");
const {
  validateRegisterCredentials,
} = require("../validators/registerValidator");

module.exports.registerStudent = async (req, res) => {
  try {
    const { newUser } = req.body;
    const { isValid, message } = validateRegisterCredentials(
      newUser,
      "student"
    );
    if (!isValid) {
      const errorMessages = message.join("\r\n");
      res.status(400).json({
        action: "USER_VALIDATION_ERROR",
        errorMessages: errorMessages,
      });
      return;
    }
    const checkTeacher = await Teacher.findOne({ email: newUser.email });
    if (checkTeacher != null) {
      res.status(200).json({ action: "USER_EXISTS" });
      return;
    }

    const checkStudent = await Student.findOne({ email: newUser.email });
    if (checkStudent == null) {
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
      return;
    }
    res.status(200).json({ action: "USER_EXISTS" });
  } catch (err) {
    res.status(500).json({ action: "Something wrong" });
  }
};

module.exports.registerTeacher = async (req, res) => {
  try {
    const { newUser } = req.body;
    const { isValid, message } = validateRegisterCredentials(
      newUser,
      "teacher"
    );
    if (!isValid) {
      const errorMessages = message.join("\r\n");
      res.status(400).json({
        action: "USER_VALIDATION_ERROR",
        errorMessages: errorMessages,
      });
      return;
    }
    const checkStudent = await Student.findOne({ email: newUser.email });
    if (checkStudent != null) {
      res.status(200).json({ action: "USER_EXISTS" });
      return;
    }

    const checkTeacher = await Teacher.findOne({ email: newUser.email });
    if (checkTeacher == null) {
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
      return;
    }
    res.status(200).json({ action: "USER_EXISTS" });
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
          { expiresIn: MAX_AGE }
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
          { expiresIn: MAX_AGE }
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

module.exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find()
    // .select({
    //   _id: 1,
    //   firstName: 1,
    //   lastName: 1,
    //   email: 1,
    //   nick: 1,
    //   github: 1,
    // });
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ action: "SOMETHING WRONG" });
  }
};

module.exports.getCommits = async (req, res) => {
  try {
    const { studentsCommitData } = req.body;
    await Promise.all(
      studentsCommitData.map((student) => {
        return fetch(
          `https://api.github.com/repos/${student.owner}/${student.repo}/commits`,
          {
            headers: {
              Authorization: `token ${GITHUB_TOKEN}`,
            },
          }
        );
      })
    )
      .then((responses) => {
        return Promise.all(responses.map((response) => response.json()));
      })
      .then((responses) => {
        return responses.map((response) => {
          if (response[0].commit.author.date)
            return response[0].commit.author.date;
          return "Error";
        });
      })
      .then((data) => {
        res.status(200).json(data);
      });
  } catch (err) {
    res.status(500).json({ action: "SOMETHING WRONG" });
  }
};
