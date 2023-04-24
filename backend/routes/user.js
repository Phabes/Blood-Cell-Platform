const { Router } = require("express");
const {
  loginUser,
  registerStudent,
  registerTeacher,
  getStudents,
  getCommits,
  findUser,
  logoutUser,
  changeGrade
} = require("../controllers/user");
const { requireAuth } = require("../middleware/authMiddleware");

const router = Router();

router.post("/teacher/register", registerTeacher);
router.post("/student/register", registerStudent);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/students", getStudents);
router.post("/students/commits", getCommits);
router.post("/authUser", requireAuth, findUser);
router.post("/students/changes", changeGrade);

module.exports = router;
