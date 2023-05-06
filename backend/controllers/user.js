const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET, MAX_AGE, GITHUB_TOKEN } = require("../config/config");
const mongoose = require("mongoose");
const Activity = require("../models/activity");
const Log = require("../models/log");
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
      console.log(errorMessages);
      res.status(200).json({
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
      console.log("student not null");
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
        _id: user._id,
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
        _id: user._id,
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
        const token = jwt.sign({ id: student._id, role: "student" }, SECRET, {
          expiresIn: MAX_AGE,
        });
        res.cookie("token", token, { httpOnly: true, maxAge: MAX_AGE * 1000 });
        res.status(200).json({
          action: "STUDENT_LOGGED",
          _id: student._id,
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
        const token = jwt.sign({ id: teacher._id, role: "teacher" }, SECRET, {
          expiresIn: MAX_AGE,
        });
        res.cookie("token", token, { httpOnly: true, maxAge: MAX_AGE * 1000 });
        res.status(200).json({
          action: "TEACHER_LOGGED",
          _id: teacher._id,
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
    const students = await Student.find({}, { password: 0 });
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
          if (response[0])
            if (response[0].commit)
              if (response[0].commit.author)
                if (response[0].commit.author.date)
                  return response[0].commit.author.date;
          return "Invalid Student Github Link";
        });
      })
      .then((data) => {
        res.status(200).json(data);
      });
  } catch (err) {
    res.status(500).json({ action: "SOMETHING WRONG" });
  }
};

module.exports.findUser = async (req, res) => {
  const { role, _id } = res.locals;
  if (role == "teacher") {
    const teacher = await Teacher.findById(_id);
    res.status(200).json({
      action: "VERIFIED",
      _id: _id,
      email: teacher.email,
      role: role,
    });
  } else if (role == "student") {
    const student = await Student.findById(_id);
    res.status(200).json({
      action: "VERIFIED",
      _id: _id,
      email: student.email,
      role: role,
    });
  } else {
    res.status(200).json({ action: "NOT_PERMISSIONED_USER" });
  }
};

module.exports.logoutUser = async (req, res) => {
  res.cookie("token", "", { httpOnly: true, maxAge: 1 });
  res.status(200).json({ action: "USER_LOGOUT" });
};

module.exports.changeGrade = async (req, res) => {
  try {
    const student = await Student.findOne({ nick: req.body.nick });
    const id = new mongoose.Types.ObjectId(req.body.act);

    const studentId = student._id;
    const activity = await Activity.findOne({ _id: id });

    if (student && activity) {
      const grades = student.grades;
      const index = grades.findIndex(
        (e) => e.activity.valueOf() === req.body.act
      );
      const date = new Date();
      const logs = student.logs;
      const logMessage = {
        date: date,
        sender: "",
        text: `Grade for activity ${activity.name} changed to ${req.body.grade}`,
        type: "grade_update",
      };
      if (index >= 0) {
        grades[index].grade = req.body.grade;
      } else {
        // activity not found so we need to add new one
        grades.push({ grade: req.body.grade, activity: id });
        logMessage.text = `You received ${req.body.grade} for activity ${activity.name}`;
        logMessage.type = "grade_added";
      }
      logs.push(logMessage);
      await Student.updateOne(
        { nick: req.body.nick },
        { grades: grades, logs: logs }
      );
      // update also activites db

      const grades_ = activity.grades;
      const index_ = grades_.findIndex(
        (e) => e.student_id.valueOf() === studentId.valueOf()
      );
      if (index_ >= 0) {
        grades_[index_].grade = req.body.grade;
      } else {
        grades_.push({ student_id: studentId, grade: req.body.grade });
      }
      await Activity.updateOne({ _id: id }, { grades: grades_ });

      res.status(200).json(grades);
    } else {
      // student not found
      res.status(500).json({ action: "student or activity not found" });
    }
  } catch (err) {
    res.status(500).json({ action: "something wrong" });
  }
};
