const { Router } = require("express");
const {
  getAllCategories, assignActivity,
} = require("../controllers/category");

const router = Router();

router.get("/all", getAllCategories);
router.post("/assign", assignActivity)

module.exports = router;