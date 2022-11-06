const mongoose=require('mongoose');
const Bookschema=new mongoose.Schema({
    user_id:{type:String,required:true},
    title:{type:String,required:true},
    description:{type:String,required:true},
    category:{type:String,required:true},
     author:{type:String,required:true},
     price:{type:Number,required:true},
     rating:{type:Number,required:true}
    //  image:{type:String,required:true}
});
const BooksModel=mongoose.model("books",Bookschema);

module.exports={BooksModel};