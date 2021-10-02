import { Bot } from 'grammy'

const bot = new Bot(process.env.BOT_TOKEN || '')

bot.command('start', ctx => ctx.reply("Hello world!"))

bot.on('message', ctx => ctx.reply('Test dev'))

bot.start()