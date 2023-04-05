const { Router } = require("express");
const {
  getAllCategories,
} = require("../controllers/category");

const router = Router();

router.get("/all", getAllCategories);

module.exports = router;