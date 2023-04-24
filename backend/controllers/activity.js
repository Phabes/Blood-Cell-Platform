const Activity = require("../models/activity");

module.exports.getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find();
    res.status(200).json(activities);
  } catch (err) {
    res.status(500).json({ action: "Something wrong" });
  }
};

module.exports.addActivity = async (req, res) => {
  try {
    const activity = req.body;
    const newActivity = new Activity(activity);
    newActivity.save();
    res.status(200).json(newActivity);
  } catch (err) {
    res.status(500).json({ action: "Something wrong" });
  }
};