const express = require("express");
const { connection } = require("./config/db");
const { UserRouter } = require("./routes/user.route");
const { Telegraf } = require("telegraf");
require("dotenv").config();
const cors = require("cors");
const { telegramBot } = require("./middleware/TelegramBot");
const token = process.env.BOT_TOKEN;

const bot = new Telegraf(token);

require("dotenv").config;
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send({ msg: "home" });
});

app.use("/user", UserRouter);
bot.use(telegramBot)
bot.startWebhook('/webhook', null, 5000);
bot.command('oauth_callback', ctx => {
  // Handle the OAuth callback logic here

});
bot.on('text', (ctx) => {

  return ctx.reply(`${ctx.message.from.username}`)
})


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
