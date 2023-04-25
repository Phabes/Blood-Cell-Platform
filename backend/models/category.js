const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: String,
  created_on: Date,
  sub_categories: [mongoose.Schema.ObjectId],
  activities: [mongoose.Schema.ObjectId],
});

const Category = mongoose.model("Category", categorySchema, "categories");
module.exports = Category;
