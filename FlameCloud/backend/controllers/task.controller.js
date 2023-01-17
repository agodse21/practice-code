const { TaskModel } = require("../model/task.model");
const AddTaskFromTelegram = async (task) => {
  const new_Task = new TaskModel(task);
  await new_Task.save();
  console.log(new_Task);
  return `Task Added! With id: "${new_Task._id}" (please save id ,you can delete your task by using this id, use /remove for delete task) `;
};
const AddTask = async (req, res) => {
  const { task_title, task_description, status } = req.body;
  const new_Task = new TaskModel({
    task_title,
    task_description,
    status,
  });
  await new_Task.save();
  res.send({ msg: "Task Added!" });
};
const RemoveTask = async (req, res) => {};
const RemoveTaskFromTelegram = async (TaskId) => {
  const del=await TaskModel.findOneAndDelete({ _id: TaskId });
  console.log(del)
  return `Task Deleted!`
};

const GetTask = async (req, res) => {
  const task = await TaskModel.find({});
  res.send(task);
};
const TaskController = {
  AddTask,
  RemoveTask,
  GetTask,
  AddTaskFromTelegram,
  RemoveTaskFromTelegram 
};
module.exports = {
  TaskController,
};
