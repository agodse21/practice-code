const express = require("express");
const BooksController = require("../controllers/books.controller");
const {Authentication}=require("../middleware/Authentication");
const {authorisation}=require("../middleware/authorisation")
const {FileUploader}=require("../middleware/fileuploader")
const BooksRouter = express.Router();

// BooksRouter.get("/",getNotes)

const validator = (req, res, next) => {
  const { title, category, description, author, price, rating  } = req.body;
  // console.log(title, category, description, author, price, rating )
  if (title && category && description &&author && price && rating) {
    next();
  } else {
    res
      .status(400)
      .json({
        error: "validation failed",
        message: "Please provide all fields",
      });
  }
};

BooksRouter.post("/addbook",Authentication,authorisation(["admin"]),validator, BooksController.AddBook);
BooksRouter.get("/dashboard",Authentication, BooksController.Dashboard);
BooksRouter.get("/allbooks",BooksController.GetAllBooks);
BooksRouter.patch("/updatebook/:id",Authentication,authorisation(["admin"]), BooksController.UpdateBook);
BooksRouter.delete("/deletebook/:id",Authentication,authorisation(["admin"]),BooksController.DeleteBooks);
BooksRouter.get("/getprofile",Authentication,BooksController.GetProfile)
module.exports = {
  BooksRouter
};
