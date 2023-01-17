const jwt=require("jsonwebtoken");
require("dotenv").config();
const {UserModel}=require("../model/user.model");
const Authentication=(req,res,next)=>{
    console.log(req)
    // const token = req?.headers?.authorization?.split(" ")[1];
    const token=req.headers?.authorization?.split(" ")[1];
    console.log(token)
    if(!token){
        res.send({msg:"please login"})
    }
   
    const decoded=jwt.verify(token,process.env.SECRET_KEY);
    const {user_id,email}=decoded
    if(decoded){
        req.body.user_id=user_id;
        next()
    }else{
        res.send({msg:"please login first"})
    }
}


module.exports={
    Authentication
}