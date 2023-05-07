const { Router } = require("express");
const { getAllStudentLogs } = require("../controllers/log");

const router = Router();

router.get("/:id", getAllStudentLogs);

module.exports = router;
