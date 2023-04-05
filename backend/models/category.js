const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: String,
  created_on: Date,
  sub_categories: Array,
  activities: Array
});

const Category = mongoose.model("Category", categorySchema, "categories");
module.exports = Category;