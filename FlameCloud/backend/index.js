const { Telegraf } = require("telegraf");
const express = require("express");
const { connection } = require("./config/db");
const axios = require("axios");
require("dotenv").config();
const cors = require("cors");
const { TaskRouter } = require("./routes/task.route");
const { TaskController } = require("./controllers/task.controller");
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

// Handle the OAuth callback
bot.command("oauth_callback", (ctx) => {
  // Verify the request signature
  if (
    !telegraf.utils.verifyRequestSignature(ctx.request, process.env.BOT_TOKEN)
  ) {
    ctx.throw(401, "Unauthorized");
  }

  console.log(ctx);
  // Extract the authorization code from the query parameters
  const code = ctx.update.query.code;

  // Use the authorization code to request an access token
  axios
    .post(
      "https://api.telegram.org/bot" +
        process.env.BOT_TOKEN +
        "/getAccessToken",
      { code: code }
    )
    .then((response) => {
      //Validate the access token
      axios
        .get(
          "https://api.telegram.org/bot" + process.env.BOT_TOKEN + "/getUser",
          { token: response.access_token }
        )
        .then((userInfo) => {
          // Store the access token and user's information in a database or session
          ctx.session.access_token = response.access_token;
          ctx.session.user = userInfo;
          ctx.reply("Authentication successful!");
        });
    })
    .catch((error) => {
      ctx.reply("An error occured during the authentication process: " + error);
    });
});

bot.command("start", (ctx) => {
  ctx.reply("Welcome! Please use the /user command to authenticate.");
});

bot.command("user", (ctx) => {
  if (ctx.message) {
    ctx.reply(`Hello ${ctx.message.from.first_name}! Your Telegram user ID is ${ctx.message.from.id}.You can try for /add task in trello board or /remove task from trello board 
        `);
  } else {
    ctx.reply(
      "You are not logged in. Please use the /login command to authenticate."
    );
  }
});

bot.command("add", (ctx) => {
  ctx.reply(
    `Thank you! please provide your task in below format. for ex: "addTask_taskTitle_taskDescription_status"`
  );
});
bot.command("remove", (ctx) => {
    ctx.reply(
      `Thank you! please provide your task id in below format. for ex: "remove_TaskId:123"`
    );
  });
bot.use(async (ctx) => {
  if (ctx.message.text.includes("addTask")) {
    const taskArr = ctx.message.text.split("_");
    const task_title = taskArr[1];
    const task_description = taskArr[2];
    const status = taskArr[3];
    ctx.reply(TaskController.AddTaskFromTelegram({task_title,task_description,status}))
  }else if(ctx.message.text.includes("remove_TaskId")){
    const TaskId=ctx.message.text.split(":");
    ctx.reply(TaskController.RemoveTaskFromTelegram(TaskId))
  }
  else{
    ctx.reply("Please Provide correct command!")
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
