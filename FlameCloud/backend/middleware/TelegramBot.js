const { Telegraf } = require("telegraf");

require("dotenv").config();
const token = process.env.BOT_TOKEN;

const bot = new Telegraf(token);

// bot.on("message", (message) => {
//     let chat_id=message.from.id
//     let msg=message.text;
//     if(msg=="add"){
//         bot.sendMessage(chat_id,"add")
//     }else if(msg=="remove"){
//         bot.sendMessage(chat_id,"remove")
//     }

// });
// bot.on((ctx) => ctx.reply('Welcome'));
// bot.on('text', async (ctx) => {

//     // await ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`);

//     console.log(ctx)
//     await ctx.reply(`Hello ${ctx.state.role}`);
//   });

// bot.start((ctx) =>
//   ctx.reply("Welcome :)))))", {
//     reply_markup: {
//       keyboard: [[{ text: "web app", web_app: { url: web_link } }]],
//     },
//   })
// );

// const bot = new Telegraf(process.env.BOT_TOKEN)
const telegramBot = async (ctx, next) => {
  if (ctx.message.text == "hello" || ctx.message.text == "hi") {
    ctx.reply("Welcome user! This is flamecloud bot! you can handle by using below commands /add task from trello board or /remove task from trello board ");
    // console.log(ctx.message.from.username)
  } else if (ctx.message.text.includes("add")) {
    
   ctx.reply(addTask())
  } else if (ctx.message.text.includes("remove")) {
    ctx.reply("remove");
  } else {
    ctx.reply(
      "Soory i can't understand this command!, you can try /add or /remove"
    );
  }
};

const addTask=()=>{

return "hello"
}



module.exports = {
  telegramBot,
};
