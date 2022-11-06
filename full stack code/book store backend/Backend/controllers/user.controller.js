
const {UserModel}=require("../model/user.model");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt") 



const SignUp = async (req, res) => {
  const { name, email, password } = req.body;

  const isUser = await UserModel.findOne({ email });
  if (isUser) {
    res.send({ msg: "User already exists, try logging in" });
  } else {
    bcrypt.hash(password, 4, async function (err, hash) {
      if (err) {
        res.send({msg:"Something went wrong, please try again later"});
      }
      const new_user = new UserModel({
        name,
        email,
        password: hash,
      });
      try {
        await new_user.save();
        res.send({ msg: "Sign up successfull" });
      } catch (err) {
        res.send({ msg: "Something went wrong, please try again" });
      }
    });
  }
};



const Login= async (req, res) => {
    const {email, password} = req.body
    const user = await UserModel.findOne({email})
  
    if(user){
      const hashed_password = user.password;
      const user_id = user._id;
      const role=user.role
      
      bcrypt.compare(password, hashed_password, function(err, result) {
        if(err){
          res.send({"msg" : "Something went wrong, try again later"})
        }
        if(result){
          const token = jwt.sign({user_id:user_id,email:email}, process.env.SECRET_KEY);  
          res.send({msg : "Login successfull", token,role})
        }
        else{
          res.send({"msg" : "Login failed"})
        }
  });
    }else{
      res.send({msg:"user not found"})
    }
    
}



const UserController={
   SignUp,Login
 };
 
 module.exports=UserController;