const Activity = require("../models/activity");
const Category = require("../models/category");
const mongoose = require("mongoose")


module.exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find()
        res.status(200).json(categories);
    } catch (err) {
      res.status(500).json({ action: "Something wrong" });
    }
  };

  module.exports.assignActivity = async (req, res) => {
    try {
      const {categoryID, activityID} = req.body;
      await Category.findByIdAndUpdate(categoryID, {
        $addToSet: { activities: activityID},
      });
      res.status(200).json({
        action: "ACTIVITY CORRECTLY ASSIGNED"
      });
  } catch (err) {
    Activity.findByIdAndDelete(req.body.activityID);
    res.status(500).json({ action: "Something wrong" });
  }
  }