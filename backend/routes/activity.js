const { Router } = require("express");
const {
  getAllActivities, addActivity,
} = require("../controllers/activity");

const router = Router();

router.get("/all", getAllActivities);
router.post("/add", addActivity)

module.exports = router;