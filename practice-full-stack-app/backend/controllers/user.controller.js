const { userModel } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SignUp = async (req, res) => {
  const { name, email, password } = req.body;

  const isUser = await userModel.findOne({ email });
  if (isUser) {
    res.send({ msg: "user Already exist" });
  } else {
    bcrypt.hash(password, 4, async function (err, hash) {
      if (err) {
        res.send({ msg: "Something went wrong try after sometime" });
      }
      
      const new_user = new userModel({
        name,
        email,
        password: hash,
       
      });
      try {
        await new_user.save();
        res.send({ msg: "Signup Sucessfully" });
      } catch (err) {
        res.send({ msg: "someting went wrong,please try again" });
      }
    });
  }
};
const SignIn = async (req, res) => {
  const {email,password} =req.body;
  
};

const userController = {
  SignIn,
  SignUp,
};

module.exports = {
  userController,
};
