const express = require("express");
const app = express();
const { userRouter } = require("./routes/user.route");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRouter);

app.listen(8080, () => {
  console.log("Connected on port 8080");
});
