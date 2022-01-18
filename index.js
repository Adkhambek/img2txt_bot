require("dotenv").config();
const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.TOKEN);

// Error Handling
bot.catch((err, ctx) => {
    console.log(err);
    return ctx.reply("Something wrong !", { parse_mode: "HTML" });
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
/usage - To get your usage info     
/help - To show this message        
/contact - To get contact of the developer`,
        {
            parse_mode: "HTML",
            reply_to_message_id: messageId,
        }
    );
});

module.exports = bot;
