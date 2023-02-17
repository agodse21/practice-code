const express = require("express");
const { TaskController } = require("../controllers/task.controller");


const TaskRouter = express.Router();
TaskRouter.post("/add", TaskController.AddTask);
TaskRouter.delete("/remove", TaskController.RemoveTask);
TaskRouter.get("/gettask/:id", TaskController.GetTask);
TaskRouter.patch("/updatestatus",TaskController.UpdateStatus)
module.exports = {
  TaskRouter,
};
