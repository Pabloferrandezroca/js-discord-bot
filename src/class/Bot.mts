import 'dotenv/config'

import { Client, REST, Events, GatewayIntentBits } from 'discord.js'
import { Configuration } from './Configuration.mts'
import { Log } from './Log.mts'
import { notifySlashCommands } from './../lib/helpers.mts'
import { type CommandCoupleType } from './../commands/commands.mts'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers]
})

const rest = new REST().setToken(process.env.DISCORD_TOKEN)

console.clear()
console.log(`\n[--------------------------- logs -----------------------------]\n`)

Log.info('Iniciando sesión...')
await client.login(process.env.DISCORD_TOKEN)
Log.success(`Sesión iniciada como ${client.user.tag}`, 1)

await Configuration.init()
let slashCommands = (await import('./../commands/commands.mts')) as unknown as CommandCoupleType
notifySlashCommands()

export class Bot {
  public static client = client
  public static rest = rest
  public static slashCommands = slashCommands
}

export type BotType = typeof Bot