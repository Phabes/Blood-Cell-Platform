const Activity = require("../models/activity");
const Category = require("../models/category");

module.exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ action: "Something wrong" });
  }
};

module.exports.addCategory = async (req, res) => {
  try {
    const category = req.body;
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
  try {
    const { categoryID, subcategoryID } = req.body;
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
  try {
    const { categoryID, activityID } = req.body;
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
