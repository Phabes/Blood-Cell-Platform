const Activity = require("../models/activity");
const Category = require("../models/category");
const { validateRequestBodyExistence, validatePastDate } = require("../validators/requestBodyValidator");

module.exports.getAllCategories = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ action: "Something wrong" });
  }
};

module.exports.addCategory = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  try {
    const category = req.body;
    if (validateRequestBodyExistence([category.name, category.created_on], res)) return;
    if (validatePastDate(category.created_on, res)) return;
    const newCategory = new Category(category);
    newCategory.save();
    res.status(200).json({
      action: "CATEGORY CORRECTLY ASSIGNED",
      category: newCategory,
    });
  } catch (err) {
    res.status(500).json({ action: "Something wrong" });
  }
};

module.exports.assignSubcategory = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  try {
    const { categoryID, subcategoryID } = req.body;
    if (validateRequestBodyExistence([categoryID, subcategoryID], res)) return;
    await Category.findByIdAndUpdate(categoryID, {
      $addToSet: { sub_categories: subcategoryID },
    });
    res.status(200).json({
      action: "SUBCATEGORY CORRECTLY ASSIGNED",
    });
  } catch (err) {
    Category.findByIdAndDelete(req.body.subcategoryID);
    res.status(500).json({ action: "Something wrong" });
  }
};

module.exports.assignActivity = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  try {
    const { categoryID, activityID } = req.body;
    if (validateRequestBodyExistence([categoryID, activityID], res)) return;
    await Category.findByIdAndUpdate(categoryID, {
      $addToSet: { activities: Object(activityID) },
    });
    res.status(200).json({
      action: "ACTIVITY CORRECTLY ASSIGNED",
    });
  } catch (err) {
    Activity.findByIdAndDelete(req.body.activityID);
    res.status(500).json({ action: "Something wrong" });
  }
};
