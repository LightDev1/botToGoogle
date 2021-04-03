import dotenv from 'dotenv';
dotenv.config();

import { Telegraf } from 'telegraf';
import { getPictures, clearPicsArray } from './searching.js';
import fsExtra from 'fs-extra';
import path from 'path';

const __dirname = path.resolve();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply(`
Привет ${ctx.message.from.first_name}!

Что умеет этот бот:
- Искать картинки в гугле. Для этого досточно лишь написать что вы хотите найти

  Например: \"фотки котиков\" -> бот отправит несколько картинок по этому запросу

Примечание: Боту нужно время чтобы обработать все изображения, так что может быть задержка
`));


bot.on('text', async (ctx) => {
    try {
        ctx.reply('Бот ищет картинки по вашему запросу. Это может занять пару минут');

        const countOfPictures = await getPictures(ctx.message.text);

        for (let i = 0; i < countOfPictures; i++) {
            ctx.replyWithPhoto({ source: `./images/img_${i}.png` });
        }

        fsExtra.emptyDir(path.join(__dirname, 'images'));

        clearPicsArray();
    } catch (error) {
        console.log(error);
        ctx.reply('Возникла ошибка, попробуйте снова');
    }
});

bot.launch();

console.log('Бот был запущен');