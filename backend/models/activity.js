const mongoose = require("mongoose");

const activitySchema = mongoose.Schema({
  name: String,
  max_points: Number,
  created_on: Date,
  deadline: Date,
  grades: Array
});

const Activity = mongoose.model("Activity", activitySchema, "activities");
module.exports = Activity;