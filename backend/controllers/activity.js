const Activity = require("../models/activity");

module.exports.getAllActivities = async (req, res) => {
    try {
        const activities = await Activity.find()
        res.status(200).json(activities);
    } catch (err) {
      res.status(500).json({ action: "Something wrong" });
    }
  };