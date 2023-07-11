const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET, MAX_AGE, GITHUB_TOKEN } = require("../config/config");
const mongoose = require("mongoose");
const Activity = require("../models/activity");
const Student = require("../models/student");
const Teacher = require("../models/teacher");
const {
  validateRegisterCredentials,
} = require("../validators/registerValidator");

module.exports.registerStudent = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  try {
    const { newUser } = req.body;
    const { isValid, message } = validateRegisterCredentials(
      newUser,
      "student"
    );
    if (!isValid) {
      const errorMessages = message.join("\r\n");
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
      const user = new Student(newUser);
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();
      const token = jwt.sign({ id: user._id, role: "student" }, SECRET, {
        expiresIn: MAX_AGE,
      });
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: MAX_AGE * 1000,
        sameSite: "none",
        secure: true,
      });
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
  res.header("Access-Control-Allow-Credentials", true);
  try {
    const { newUser } = req.body;
    const { isValid, message } = validateRegisterCredentials(
      newUser,
      "teacher"
    );
    if (!isValid) {
      const errorMessages = message.join("\r\n");
      res.status(200).json({
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
      const token = jwt.sign({ id: user._id, role: "teacher" }, SECRET, {
        expiresIn: MAX_AGE,
      });
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: MAX_AGE * 1000,
        sameSite: "none",
        secure: true,
      });
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
  res.header("Access-Control-Allow-Credentials", true);
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email: email });
    if (student) {
      const auth = await bcrypt.compare(password, student.password);
      if (auth) {
        const token = jwt.sign({ id: student._id, role: "student" }, SECRET, {
          expiresIn: MAX_AGE,
        });
        res.cookie("token", token, {
          httpOnly: true,
          maxAge: MAX_AGE * 1000,
          sameSite: "none",
          secure: true,
        });
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
        res.cookie("token", token, {
          httpOnly: true,
          maxAge: MAX_AGE * 1000,
          sameSite: "none",
          secure: true,
        });
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
  res.header("Access-Control-Allow-Credentials", true);
  try {
    const students = await Student.find({}, { password: 0 });
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ action: "SOMETHING WRONG" });
  }
};

module.exports.getTeachers = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  try {
    const teachers = await Teacher.find({}, { password: 0 });
    res.status(200).json(teachers);
  } catch (err) {
    res.status(500).json({ action: "SOMETHING WRONG" });
  }
};

module.exports.getCommits = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
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
  res.header("Access-Control-Allow-Credentials", true);
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
  res.header("Access-Control-Allow-Credentials", true);
  res.cookie("token", "", {
    httpOnly: true,
    maxAge: 1,
    sameSite: "none",
    secure: true,
  });
  res.status(200).json({ action: "USER_LOGOUT" });
};

module.exports.changeGrade = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  try {
    const { nick, act, grade } = req.body;
    const student = await Student.findOne({ nick: nick });
    const id = new mongoose.Types.ObjectId(act);

    const studentId = student._id;
    const activity = await Activity.findOne({ _id: id });

    if (student && activity) {
      const grades = student.grades;
      const index = grades.findIndex((e) => e.activity.valueOf() === act);
      const date = new Date();
      const logs = student.logs;
      const logMessage = {
        date: date,
        sender: "",
        text: `You received ${grade}/${activity.max_points} for activity "${activity.name}"`,
        type: "grade_added",
      };
      if (index >= 0) {
        if (grades[index].grade != "") {
          if (grade != "")
            logMessage.text = `Grade for activity "${activity.name}" changed from ${grades[index].grade}/${activity.max_points} to ${grade}/${activity.max_points}`;
          else
            logMessage.text = `Grade for activity "${activity.name} deleted"`;
        }
        logMessage.type = "grade_update";
        grades[index].grade = grade;
      } else {
        // activity not found so we need to add new one
        grades.push({ grade: grade, activity: id });
      }
      logs.push(logMessage);
      await Student.updateOne({ nick: nick }, { grades: grades, logs: logs });
      // update also activites db

      const grades_ = activity.grades;
      const index_ = grades_.findIndex(
        (e) => e.student_id.valueOf() === studentId.valueOf()
      );
      if (index_ >= 0) {
        grades_[index_].grade = grade;
      } else {
        grades_.push({ student_id: studentId, grade: grade });
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

module.exports.getOneStudent = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  try {
    const studentID = req.params.id;
    const studentData = await Student.findById(studentID);

    if (studentData) {
      res.status(200).json(studentData);
    } else {
      res.status(500).json({ action: "student not found" });
    }
  } catch (err) {
    res.status(500).json({ action: "something wrong" });
  }
};

module.exports.getOneTeacher = async (req, res) => {
  try {
    const teacherID = req.params.id;
    const teacherData = await Teacher.findById(teacherID);

    if (teacherData) {
      res.status(200).json(teacherData);
    } else {
      res.status(500).json({ action: "teacher not found" });
    }
  } catch (err) {
    res.status(500).json({ action: "something wrong" });
  }
};

module.exports.changePassword = async (req, res) => {
  const { id, newpassword } = req.body;

  const student = await Student.findOne({ _id: id });

  if (student) {
    try {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(newpassword, salt);

      await Student.updateOne({ _id: id }, { password: password });

      res.status(200).json({ action: "Password changed!" });
    } catch (err) {
      res.status(500).json({ action: "something wrong" });
    }
    return res;
  }
  const user = await Teacher.findOne({ _id: id });

  if (user) {
    if (user) {
      try {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(newpassword, salt);

        await Teacher.updateOne({ _id: id }, { password: password });

        res.status(200).json({ action: "Password changed!" });
      } catch (err) {
        res.status(500).json({ action: "something wrong" });
      }
      return res;
    }
  }
};
