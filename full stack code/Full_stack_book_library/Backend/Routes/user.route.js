const express=require("express");
const UserController=require("../controllers/user.controller")

const UsersRouter=express.Router();


UsersRouter.post("/signup", UserController.SignUp)
UsersRouter.post("/login", UserController.Login);

module.exports={
    UsersRouter
}