const { Router } = require("express");
const {
  sendMessageToAll,
  sendMessageToOne,
  getAllStudentMessages,
} = require("../controllers/message");

const router = Router();

router.get("/:id", getAllStudentMessages);
router.post("/all", sendMessageToAll);
router.post("/one", sendMessageToOne);

module.exports = router;
