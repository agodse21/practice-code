const express=require("express");
const {UserController}=require("../controllers/User.controller");
// const { Authentication } = require("../middlewares/Authentication");

const UserRouter=express.Router();
UserRouter.post('/login',UserController.Login)
UserRouter.post('/signup',UserController.SignUp)
// UserRouter.post("/calculateEMI",Authentication,EmiController.CalculateEmi);
// UserRouter.get("/getProfile",Authentication, EmiController.GetProfile);
module.exports={
    UserRouter
}