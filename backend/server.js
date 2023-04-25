const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/user");
const messageRoute = require("./routes/message");
const activityRoute = require("./routes/activity");
const categoryRoute = require("./routes/category");

const { CONNECTION_URL } = require("./config/config");
const PORT = process.env.PORT || 4000;

const app = express();


app.use(
  cors({
    credentials: true,
    origin: "http://localhost:4200",
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRoute);
app.use("/message", messageRoute);
app.use("/activity", activityRoute);
app.use("/category", categoryRoute);
mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`SERVER RUNNING ON PORT ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });
