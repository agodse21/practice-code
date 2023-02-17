const { UserModel } = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const SignUp = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const { name, email, password } = req.body;
  const isUser = await UserModel.findOne({ email });
  if (isUser) {
    res.send({ msg: "user Already exist" });
  } else {
    bcrypt.hash(password, 4, async function (err, hash) {
      if (err) {
        res.send({ msg: "Something went wrong try after sometime" });
      }
      const new_user = new UserModel({
        name,
        email,
        password: hash,
        user_ip_address: ip,
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
const Login = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });

  if (user) {
    const hashed_pass = user.password;
    const user_id = user._id;
    bcrypt.compare(password, hashed_pass, function (err, result) {
      if (err) {
        res.send({ msg: "Something went wrong try after sometime" });
      }
      if (result) {
        const token = jwt.sign(
          { user_id: user_id, email: email },
          process.env.SECRET_KEY
        );
        res.send({ msg: "Login succesfull", token });
      } else {
        res.send({ msg: "Login Failed" });
      }
    });
  } else {
    res.send({ msg: "user not found" });
  }
};

const LoginUsingTelegram = (user) => {
  const new_user = new UserModel(user);

  new_user.save();
  return "Login Successfull!";
};

const UserController = {
  Login,
  SignUp,
  LoginUsingTelegram,
};
module.exports = {
  UserController,
};
