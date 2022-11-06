const express=require("express");
const {connection}=require("./config/db");
const cors = require("cors")
const {UsersRouter}=require("./Routes/user.route");
const {BooksRouter}=require("./Routes/book.route")
const app=express();
require("dotenv").config();

app.use(express.json());
app.use(cors())
app.use(function(req,res,next){
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    next();
})
app.use("/user",UsersRouter);
app.use("/books",BooksRouter);
app.get("/",(req,res)=>{
    res.send("home")
})
app.listen(process.env.PORT,async()=>{
    try{
        await connection;
        console.log("Connected to db Successfully")
    }catch(err){
        console.log("error to connecting");
        console.log(err)
    }
    console.log(`Lising on port ${process.env.PORT}`)
})