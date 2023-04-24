const { Router } = require("express");
const {
  loginUser,
  registerStudent,
  registerTeacher,
  getStudents,
  getCommits,
  changeGrade,
} = require("../controllers/user");

const router = Router();

router.post("/teacher/register", registerTeacher);
router.post("/student/register", registerStudent);
router.post("/login", loginUser);
router.get("/students", getStudents);
router.post("/students/commits", getCommits);
router.post("/students/changes", changeGrade);

module.exports = router;
