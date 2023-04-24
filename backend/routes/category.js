const { Router } = require("express");
const {
  getAllCategories, assignActivity, addCategory, assignSubcategory,
} = require("../controllers/category");

const router = Router();

router.get("/all", getAllCategories);
router.post("/add", addCategory);
router.post("/assign_subcategory", assignSubcategory);
router.post("/assign_activity", assignActivity);

module.exports = router;