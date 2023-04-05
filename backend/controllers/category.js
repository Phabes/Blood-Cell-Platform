const Category = require("../models/category");

module.exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find()
        res.status(200).json(categories);
    } catch (err) {
      res.status(500).json({ action: "Something wrong" });
    }
  };