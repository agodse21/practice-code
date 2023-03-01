const express = require("express");
const { userController } = require("../controllers/user.controller");
const userRouter = express.Router();

userRouter.post("/signup", userController.SignUp);
userRouter.post("/signin", userController.SignIn);

module.exports = {
  userRouter,
};
