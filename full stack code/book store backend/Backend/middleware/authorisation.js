const jwt=require("jsonwebtoken");
require("dotenv").config();
const {UserModel}=require("../model/user.model")

const authorisation = (permittedrole) => {
    return async (req, res, next) => 
    {
    const email = req.body.email
  
    const user = await UserModel.findOne({email : email})
    const Rrole =  req.body.role;
 const role=user.role
        if(permittedrole.includes(role)){
            req.body.email = email
            req.body.role=Rrole
            next()
        }
        else{
            res.send({msg:"Not authorised"})
        }
    }
}
module.exports={
    authorisation
}