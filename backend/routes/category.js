const { Router } = require("express");
const {
  getAllCategories,
  assignActivity,
  addCategory,
  assignSubcategory,
} = require("../controllers/category");
const { requireAuth } = require("../middleware/authMiddleware");

const router = Router();

router.get("/all", getAllCategories);
router.post("/add", requireAuth, addCategory);
router.post("/assign_subcategory", requireAuth, assignSubcategory);
router.post("/assign_activity", requireAuth, assignActivity);

module.exports = router;
