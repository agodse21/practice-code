const { Telegraf } = require("telegraf");
const express = require("express");
const { connection } = require("./config/db");
const axios = require("axios");
require("dotenv").config();
const cors = require("cors");
const { TaskRouter } = require("./routes/task.route");
const { TaskController } = require("./controllers/task.controller");
const { UserController } = require("./controllers/User.controller");
const { SaveTempUser } = require("./middleware/TempUser");
const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send({ msg: "home" });
});

app.use("/task", TaskRouter);

bot.startWebhook("/webhook", null, 5000);

bot.command("start", (ctx) => {
  ctx.reply("Welcome! Please use the /user command to authenticate.");
});
//flamecloud_denoBot  5860527655:AAGz8lS_yAApBhroEWdtasra5-eS2onMJ7c
// AmolTetrisBot 5807067744:AAFzDVnPcc05ivogyE9QMHAemnF7kBzek3s
bot.command("user", (ctx) => {
  if (ctx.message) {
    let user = {
      name: ctx.message.from.first_name,
      telgram_user_id: ctx.message.from.id,
    };
    ctx.reply(UserController.LoginUsingTelegram(user));
    ctx.reply(`Hello ${ctx.message.from.first_name}! Your Telegram user ID is ${ctx.message.from.id}.You can try for /add task in trello board or /remove task from trello board , you want to see your all task /getmytask or you can visit Trell board /open_my_trello_board
        `);
  } else {
    ctx.reply(
      "You are not logged in. Please use the /login command to authenticate."
    );
  }
});

bot.command("add", (ctx) => {
  ctx.reply(
    `Thank you! please provide your task in below format. for ex: "addTask_taskTitle_taskDescription_status(pending,doing,done)"`
  );
});
bot.command("getmytask", async (ctx) => {
  const user_id = ctx.message.from.id;
  let data = await TaskController.GetTaskTelegram(user_id);

  // console.log(data)

  ctx.reply(`Thank you! Here list of you added task on Trello board`);
  if (data.length == 0) {
    ctx.reply("Your Task list is empty! you can Add Task using /add");
  } else {
    data.map((ele, index) => {
      ctx.reply(
        `Task Title: ${ele.task_title}, Task Description: ${ele.task_description}`
      );
    });
  }
});
bot.command("remove", (ctx) => {
  ctx.reply(
    `Thank you! please provide your task id in below format. for ex: "remove_TaskId:123"`
  );
});
bot.command("open_my_trello_board", (ctx) => {
  // SaveTempUser(ctx.message.from.id);

  bot.telegram.sendMessage(
    ctx.from.id,
    `Please follow this link: <a href="${process.env.LOCALHOST}/${ctx.message.from.id}">${process.env.LOCALHOST}</a>`,
    { parse_mode: "HTML" }
  );
});

bot.use(async (ctx) => {
  if (ctx.message.text.includes("addTask")) {
    const taskArr = ctx.message.text.split("_");

    const task_title = taskArr[1];
    const task_description = taskArr[2];
    const status = taskArr[3];
    const user_id = ctx.message.from.id;

    ctx.reply(
      TaskController.AddTaskFromTelegram({
        task_title,
        task_description,
        status,
        user_id,
      })
    );
  } else if (ctx.message.text.includes("remove_TaskId")) {
    const TaskId = ctx.message.text.split(":");
    const user_id = ctx.message.from.id;
    // console.log(TaskId);
    ctx.reply(TaskController.RemoveTaskFromTelegram(user_id, TaskId[1]));
  } else {
    ctx.reply("Please Provide correct command!");
  }
});

bot.launch();
app.listen(PORT, async () => {
  try {
    await connection;
    console.log("Connected Succesfull to db");
  } catch (err) {
    console.log("error from db");
    console.log(err);
  }
  console.log(`listing on port ${PORT}`);
});
