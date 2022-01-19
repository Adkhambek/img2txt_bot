const { createWorker, createScheduler } = require("tesseract.js");

exports.getText = async (lang, image) => {
    const worker = createWorker();
    await worker.load();
    await worker.loadLanguage(lang);
    await worker.initialize(lang);

    const {
        data: { text },
    } = await worker.recognize(image);

    await worker.terminate();

    return text;
};

exports.getTextFast = async (lang, image) => {
    const scheduler = createScheduler();
    for (let i = 0; i < 4; i++) {
        const w = createWorker();
        await w.load();
        await w.loadLanguage(lang);
        await w.initialize(lang);
        scheduler.addWorker(w);
    }
    const rets = await Promise.all(
        Array(10)
            .fill(0)
            .map(() => scheduler.addJob("recognize", image))
    );
    await scheduler.terminate();
    return rets.map(({ data: { text } }) => text);
};
