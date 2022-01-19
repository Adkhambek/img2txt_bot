require("dotenv").config();
const { Telegraf, Markup, Scenes, session } = require("telegraf");
const TOKEN = process.env.TOKEN;
const bot = new Telegraf(TOKEN);
const { getText } = require("./utils/tesseract");
const imgUrl = require("./utils/imgUrl");
const steps = new Scenes.WizardScene(
    "STEPS",
    async (ctx) => {
        ctx.wizard.state.image = imgUrl(ctx, TOKEN);
        ctx.wizard.state.messageId = ctx.message.message_id;
        ctx.reply(
            "Please Select desired langauge:",
            Markup.inlineKeyboard([
                Markup.button.callback("English", "eng"),
                Markup.button.callback("Uzbek", "uzb"),
                Markup.button.callback("Russian", "rus"),
            ])
        );
        return ctx.wizard.next();
    },
    async (ctx) => {
        const language = (ctx.wizard.state.langauge =
            ctx.update.callback_query.data);
        const image = await ctx.wizard.state.image;
        const messageId = ctx.wizard.state.messageId;
        ctx.deleteMessage();
        ctx.reply(`Extracting text please wait ...`);
        const text = await getText(language, image);
        console.log(text);
        await ctx.reply(`<b>Here is extracted Text:</b> \n\n ${text}`, {
            parse_mode: "HTML",
            reply_to_message_id: messageId,
        });
        return ctx.scene.leave();
    }
);

const stage = new Scenes.Stage([steps]);
bot.use(session());
bot.use(stage.middleware());

// Error Handling
bot.catch((err, ctx) => {
    return ctx.reply("Something wrong !", { parse_mode: "HTML" });
});

// Public
bot.start((ctx) => {
    const firstName = ctx.message.chat.first_name;
    const messageId = ctx.message.message_id;
    ctx.reply(
        `Hi! ${firstName} 😀

I am an Optical Character Recognizer Bot 🤖. 

Just send a clear image 🖼️ and I will recognize the text in the image and send it as a message!`,
        { reply_to_message_id: messageId }
    );
});

bot.on("photo", (ctx) => {
    ctx.scene.enter("STEPS");
});

module.exports = bot;
