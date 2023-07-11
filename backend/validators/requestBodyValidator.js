module.exports.validateRequestBodyExistence = (properties, res) => {
  for (let element of properties) {
    if (element === undefined) {
      res
        .status(400)
        .json({ action: "Wrong data input - wrong request data structure" });
      return true;
    }
  }
  return false;
};

module.exports.validatePastDate = (dateString, res) => {
  let today = new Date();
  if (new Date(dateString).setHours(0, 0, 0, 0) > today.setHours(0, 0, 0, 0)) {
    res
      .status(400)
      .json({
        action: "Wrong data input - created on date should be in the past",
      });
    return true;
  }
  return false;
};
