const { Router } = require("express");
const {
  loginUser,
  registerStudent,
  registerTeacher,
} = require("../controllers/user");

const router = Router();

router.post("/teacher/register", registerTeacher);
router.post("/student/register", registerStudent);
router.post("/login", loginUser);

module.exports = router;
