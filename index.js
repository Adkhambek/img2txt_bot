require("dotenv").config();
const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.TOKEN);

// Error Handling
bot.catch((err, ctx) => {
    return ctx.reply("Something wrong !", { parse_mode: "HTML" });
});

// Public
bot.start((ctx) => {
    ctx.reply("OK");
});

module.exports = bot;
