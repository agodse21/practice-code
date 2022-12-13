const {Router}=require("express");
const userRouter=Router()
const { UserController} =require("../controllers/user.controller")
userRouter.post("/signup",UserController.Signup)
userRouter.post("/login",UserController.Login)

module.exports={
    userRouter
}