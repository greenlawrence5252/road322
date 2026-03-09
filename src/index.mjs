import 'dotenv/config'
import { Telegraf } from 'telegraf'
import { createReadStream } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import { sendToApi } from './sendToApi.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const APK_PATH = resolve(__dirname, '../public/Road24.apk')

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start(async (ctx) => {
  const { id, username, first_name, last_name } = ctx.from

  try {
    await sendToApi({ id, username, first_name, last_name })
  } catch (err) {
    console.error('sendToApi error:', err.message)
  }

  await ctx.replyWithDocument(
    { source: createReadStream(APK_PATH), filename: 'ROAD24.apk' },
    {
      caption: `✅ROAD24 yanada qulay bo'ldi\n\nJarimalar va penyalarga chegirmalar hamda keshbek allaqachon ilovada`,
    }
  )
})

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())

app.get('/', (req, res) => {
  res.json({ ok: true })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

;(async () => {
  await bot.telegram.deleteWebhook({ drop_pending_updates: true })
  bot.launch()
  console.log('Bot started')
})()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
