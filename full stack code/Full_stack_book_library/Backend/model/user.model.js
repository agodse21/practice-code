const mongoose=require('mongoose');
const UserSchema=new mongoose.Schema({
   name:{type:String,required:true},
   email:{type:String,required:true},
   password:{type:String,required:true},
   role:{type:String,enum:["customer","admin"],default:"customer"}
});
const UserModel=mongoose.model("user",UserSchema);

module.exports={UserModel};