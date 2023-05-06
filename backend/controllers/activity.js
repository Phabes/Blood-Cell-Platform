const Activity = require("../models/activity");
const Log = require("../models/log");

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
    const logMessage = {
      date: activity.created_on,
      sender: "",
      text: `Activity ${activity.name} assigned`,
      type: "activity",
    };
    const log = new Log(logMessage);
    log.save();
    res.status(200).json(newActivity);
  } catch (err) {
    res.status(500).json({ action: "Something wrong" });
  }
};
