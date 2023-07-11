const Activity = require("../models/activity");
const Log = require("../models/log");
const {
  validateRequestBodyExistence,
  validatePastDate,
} = require("../validators/requestBodyValidator");

module.exports.getAllActivities = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  try {
    const activities = await Activity.find();
    res.status(200).json(activities);
  } catch (err) {
    res.status(500).json({ action: "Something wrong" });
  }
};

module.exports.addActivity = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  try {
    const activity = req.body;
    if (
      validateRequestBodyExistence(
        [activity.name, activity.max_points, activity.created_on],
        res
      )
    )
      return;
    if (validatePastDate(activity.created_on, res)) return;
    if (activity.max_points < 1) {
      res
        .status(400)
        .json({
          action:
            "Wrong data input - max_points should be greater or equal to 1",
        });
      return;
    }
    const newActivity = new Activity(activity);
    await newActivity.save();
    const logMessage = {
      date: activity.created_on,
      sender: "",
      text: `Activity ${activity.name} assigned`,
      type: "activity",
    };
    const log = new Log(logMessage);
    await log.save();
    res.status(200).json(newActivity);
  } catch (err) {
    res.status(500).json({ action: "Something wrong" });
  }
};
