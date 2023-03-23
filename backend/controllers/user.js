const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET, MAX_AGE } = require("../config/config");
const User = require("../models/user");

module.exports.registerUser = async (req, res) => {
  try {
    const { newUser } = req.body;
    const checkUser = await User.findOne({ email: newUser.email });
    if (checkUser == null) {
      const user = new User(newUser);
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();
      const token = jwt.sign({ id: user._id }, SECRET, {
        expiresIn: MAX_AGE,
      });
      res.cookie("token", token, { httpOnly: true, maxAge: MAX_AGE * 1000 });
      res.status(200).json({
        action: "USER_REGISTERED",
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(200).json({ action: "USER_EXISTS" });
    }
  } catch (err) {
    res.status(500).json({ action: "Something wrong" });
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        const token = jwt.sign({ id: user._id, role: user.role }, SECRET, {
          expiresIn: MAX_AGE,
        });
        res.cookie("token", token, { httpOnly: true, maxAge: MAX_AGE * 1000 });
        res
          .status(200)
          .json({ action: "USER_LOGGED", email: user.email, role: user.role });
      } else res.status(200).json({ action: "WRONG_PASSWORD" });
    } else res.status(200).json({ action: "USER_DOESNT_EXIST" });
  } catch (err) {
    res.status(500).json({ action: "Something wrong" });
  }
};
