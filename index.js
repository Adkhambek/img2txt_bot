require("dotenv").config();
const { Telegraf } = require("telegraf");
const TOKEN = process.env.TOKEN;
const bot = new Telegraf(TOKEN);
const axios = require("axios");
const { getText, getTextFast } = require("./utils/tesseract");

// Error Handling
bot.catch((err, ctx) => {
    console.log(err);
    return ctx.reply("Something wrong !", { parse_mode: "HTML" });
});

bot.use(async (ctx, next) => {
    try {
        if (ctx.message.photo) {
            const fileId =
                ctx.message.photo[ctx.message.photo.length - 1].file_id;
            const response = await axios.get(
                `https://api.telegram.org/bot${TOKEN}/getFile?file_id=${fileId}`
            );
            const filePath = await response.data.result.file_path;
            const photoUrl = `https://api.telegram.org/file/bot${TOKEN}/${filePath}`;
            const text = await getText("eng", photoUrl);
            ctx.reply(text);
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
        ctx.reply("something wrong");
    }
});

// Public
bot.start((ctx) => {
    const firstName = ctx.message.chat.first_name;
    const messageId = ctx.message.message_id;
    ctx.reply(
        `Hi! ${firstName} 😀

I am an Optical Character Recognizer Bot 🤖. 

Just send a clear image 🖼️ and I will recognize the text in the image and send it as a message!

Get the list of commands by /help`,
        { reply_to_message_id: messageId }
    );
});

bot.help((ctx) => {
    const messageId = ctx.message.message_id;
    ctx.reply(
        `<b>List of commands available:</b>\n        
/start - To start the bot     
/help - To show this message        
/contact - To get contact of the developer`,
        {
            parse_mode: "HTML",
            reply_to_message_id: messageId,
        }
    );
});

bot.command("contact", (ctx) => {
    ctx.reply(
        `Hey! You can find me on 
 <a href = "https://telegram.me/muzaffarovadham">Telegram</a>`,
        { parse_mode: "HTML" }
    );
});

bot.command("usage", (ctx) => {});

module.exports = bot;
