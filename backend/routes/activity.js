const { Router } = require("express");
const {
  getAllActivities,
} = require("../controllers/activity");

const router = Router();

router.get("/all", getAllActivities);

module.exports = router;