const { Router } = require("express");
const {
  sendMessageToAll,
  sendMessageToOne,
} = require("../controllers/message");

const router = Router();

router.post("/all", sendMessageToAll);
router.post("/one", sendMessageToOne);

module.exports = router;
