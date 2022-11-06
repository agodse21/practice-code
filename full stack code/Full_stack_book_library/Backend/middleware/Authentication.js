const jwt=require("jsonwebtoken");
require("dotenv").config();



const Authentication=(req,res,next)=>{
    const token=req.headers?.authorization?.split(" ")[1];
    if(!token){
        res.send({msg:"please Login "})
    }
    const decoded=jwt.verify(token,process.env.SECRET_KEY);
   
    const {user_id,email,role}=decoded;
    if(decoded){
        req.body.user_id=user_id;
        req.body.email = email;
        req.body.role = role;
        next()
    }else{
        res.send({msg:"please Login "})
    
    }
}

module.exports={
    Authentication
}