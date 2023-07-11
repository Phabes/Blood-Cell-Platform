const { Router } = require("express");
const {
  sendMessageToAll,
  sendMessageToOne,
  getAllStudentMessages,
} = require("../controllers/message");
const { requireAuth } = require("../middleware/authMiddleware");

const router = Router();

router.get("/:id", requireAuth, getAllStudentMessages);
router.post("/all", requireAuth, sendMessageToAll);
router.post("/one", requireAuth, sendMessageToOne);

module.exports = router;
