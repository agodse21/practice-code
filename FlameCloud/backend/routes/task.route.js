const express = require("express");
const { TaskController } = require("../controllers/task.controller");


const TaskRouter = express.Router();
TaskRouter.post("/add", TaskController.AddTask);
TaskRouter.post("/remove", TaskController.RemoveTask);
TaskRouter.get("/gettask", TaskController.GetTask);
module.exports = {
  TaskRouter,
};
