const {BooksModel}=require("../model/book.model");
const {UserModel}=require("../model/user.model");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt")

const DeleteBooks=async(req,res)=>{
    const id=req.params.id;
   const user_id = req.body.user_id
    await BooksModel.deleteOne({user_id:user_id,_id:id});

            res.send({msg:"Book deleted"});
       
}
const UpdateBook=async(req,res)=>{
    const id=req.params.id;

    const { title, category, description,user_id, author, price, rating } = req.body;
    // const img=`./uploads/${req.file.originalname}`
    await BooksModel.updateOne({user_id:user_id,_id:id},{$set:{title:title, category:category, description:description, author:author, price:price, rating:rating}});
            res.send({msg:"Book Updated"});
        
}

const Dashboard=async(req, res)=>{
    const {user_id} = req.body
    const user =await  UserModel.findOne({_id : user_id})
    const {name, email} = user
    res.send({user:{name, email},})
}  
const GetAllBooks=async(req, res)=>{
    const result=await BooksModel.find();
    res.send(result)
}  
const Cart=(req,res)=>{
res.send(`Here are the products in your cart.`)   
}
const GetProfile= async(req,res)=>{
        const {user_id} = req.body
        const user =await  UserModel.findOne({_id : user_id})
        const {name, email,role} = user
        res.send({name, email,role})
  
}
const AddBook=async(req,res)=>{
   const { title, category, description,user_id, author, price, rating } = req.body;
    // const img=`./uploads/${req.file.originalname}`
    // const img=req.file;
    // console.log(img)
    const new_books=new BooksModel({
       title:title,
       category:category,
        description:description,
       author:author,
       price:price,
       rating:rating,
       user_id,
    //    image:img
    });
    await new_books.save();
    res.send({msg:"Book Added"})
}
const Feedback=(req,res)=>{
      res.send("Product Feedback taken")
}






const BooksController={
    AddBook,Dashboard,GetAllBooks,DeleteBooks,UpdateBook,GetProfile
//    Dashboard,Products,Cart,CreateProduct,Feedback
    // CreateNotes,ReadNotes,UpdateNotes,DeleteNotes
};

module.exports=BooksController;