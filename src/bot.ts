import { Bot, Context, session, SessionFlavor } from "grammy"
import Queue from 'bull'
import { Router } from '@grammyjs/router'

const remindQueue = new Queue('remind-staging')

interface SessionData {
  route: '/' | '/reg' ,
  isAuthenticated: boolean
}

type MyContext = Context & SessionFlavor<SessionData>

if (process.env.BOT_TOKEN === undefined) throw Error("BOT_TOKEN is missing.")
export const bot = new Bot<MyContext>(process.env.BOT_TOKEN)

bot.use(session({ initial: (): SessionData => ({ route: '/', isAuthenticated: false }) }))

bot.command('start', async ctx => ctx.reply('Hello world!'))

remindQueue.process((job) => {
  return bot.api.sendMessage(job.data.tg_user_id, job.data.message)
})

bot.command('register', async (ctx) => {
  if (ctx.session.isAuthenticated) {
    await ctx.reply('Already authenticated')
  } else {
    await ctx.reply('Enter passphrase')
    ctx.session.route = '/reg'
  }
})

const router = new Router<MyContext>(ctx => ctx.session.route)

router.route('/reg', async (ctx) => { 
  if (process.env.PASSPHRASE === ctx.msg?.text) {
    await ctx.reply('Nice')
    ctx.session.isAuthenticated = true
    ctx.session.route = '/'
  }
})

router.route('/', async (ctx) => {
  if (ctx.session.isAuthenticated) {
    await ctx.reply('Hello dude')
  } else {
    await ctx.reply('Hello')
  }
})

bot.use(router)