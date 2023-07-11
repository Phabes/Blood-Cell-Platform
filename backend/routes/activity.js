const { Router } = require("express");
const { getAllActivities, addActivity } = require("../controllers/activity");
const { requireAuth } = require("../middleware/authMiddleware");

const router = Router();

router.get("/all", getAllActivities);
router.post("/add", requireAuth, addActivity);

module.exports = router;
