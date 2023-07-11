const { Router } = require("express");
const { getAllStudentLogs } = require("../controllers/log");
const { requireAuth } = require("../middleware/authMiddleware");

const router = Router();

router.get("/:id", requireAuth, getAllStudentLogs);

module.exports = router;
