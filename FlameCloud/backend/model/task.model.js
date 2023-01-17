const mongoose = require("mongoose");
const TaskSchema = new mongoose.Schema(
  {
    task_title: { type: String, required: true },
    task_description: { type: String, required: true },
    status: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const TaskModel = mongoose.model("Task", TaskSchema);

module.exports = {
  TaskModel,
};
