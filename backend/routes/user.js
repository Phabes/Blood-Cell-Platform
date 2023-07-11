const { Router } = require("express");
const {
  loginUser,
  registerStudent,
  registerTeacher,
  getStudents,
  getCommits,
  findUser,
  logoutUser,
  changeGrade,
  getTeachers,
  getOneStudent,
  getOneTeacher,
  changePassword
} = require("../controllers/user");
const { requireAuth } = require("../middleware/authMiddleware");

const router = Router();

router.post("/teacher/register", registerTeacher);
router.post("/student/register", registerStudent);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/students", getStudents);
router.post("/students/commits", requireAuth, getCommits);
router.post("/authUser", requireAuth, findUser);
router.post("/students/changes", changeGrade);
router.get("/teachers", getTeachers);
router.get("/student/:id", getOneStudent);
router.get("/teacher/:id", getOneTeacher);
router.post("/students/change/pass", changePassword);
module.exports = router;
