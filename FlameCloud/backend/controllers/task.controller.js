const { TaskModel } = require("../model/task.model");
const AddTaskFromTelegram = (task) => {
  const new_Task = new TaskModel(task);
  new_Task.save();
  console.log(new_Task);
  return `Task Added! With id: "${new_Task._id}" (please save id ,you can delete your task by using this id, use /remove for delete task) `;
};
const AddTask = async (req, res) => {
  const { task_title, task_description, task_status, user_id } = req.body;
  const new_Task = new TaskModel({
    task_title: task_title,
    task_description: task_description,
    status: task_status,
    user_id: user_id,
  });
  await new_Task.save();
  res.send({ msg: "Task Added!" });
};
const RemoveTask = async (req, res) => {
  const { user_id, id } = req.body;
  const dele = await TaskModel.findOneAndDelete({
    _id: id,
    user_id: user_id,
  });
  if (dele) {
    res.send({ msg: "Task deleted!" });
  } else {
    res.send({ msg: "Please check details once!" });
  }
};
const RemoveTaskFromTelegram = (user_id, TaskId) => {
  const del = TaskModel.findOneAndDelete({
    _id: TaskId,
    user_id: user_id,
  });
  return `Task Deleted!with id: ${TaskId}`;
};

const GetTask = async (req, res) => {
  const { id } = req.params;
  const { status } = req.query;

  const task = await TaskModel.find({ user_id: id, status: status });
  res.send(task);
};
const GetTaskTelegram = async (user_id) => {
  const task = await TaskModel.find({ user_id: user_id });
  //   console.log(task)
  return task;
};
const UpdateStatus = async (req, res) => {
  const { user_id, id, status } = req?.body;
  const updated = await TaskModel.findOneAndUpdate(
    { user_id: user_id, _id: id },
    { status },
    { new: true }
  );
  if (updated) {
    res.send({ msg: `updated successfully!` });
  } else {
    res.send({ msg: `Please check details once!` });
  }
};
const TaskController = {
  AddTask,
  RemoveTask,
  GetTaskTelegram,
  GetTask,
  AddTaskFromTelegram,
  RemoveTaskFromTelegram,
  UpdateStatus,
};
module.exports = {
  TaskController,
};
