require("dotenv").config();
const bot = require("./index");
const express = require("express");

if (process.env.NODE_ENV === "production") {
    bot.telegram.setWebhook(process.env.BASE_URL + process.env.SECRET_PATH);
    const app = express();
    app.get("/", (req, res) => res.send("Test"));
    app.use(bot.webhookCallback(process.env.SECRET_PATH));
    app.listen(process.env.PORT, () => {
        console.log("Bot running in production mode ...");
    });
} else {
    bot.launch()
        .then(() => console.log("Bot running in development mode..."))
        .catch((err) => console.log(err));
}
