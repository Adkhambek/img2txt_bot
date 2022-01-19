const axios = require("axios");

module.exports = async (ctx, TOKEN) => {
    const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
    const response = await axios.get(
        `https://api.telegram.org/bot${TOKEN}/getFile?file_id=${fileId}`
    );
    const filePath = await response.data.result.file_path;
    return `https://api.telegram.org/file/bot${TOKEN}/${filePath}`;
};
