import 'dotenv/config'

import { Client, REST, GatewayIntentBits, Routes, Events } from 'discord.js'
import { Configuration } from './Configuration.mts'
import { Log } from './Log.mts'
import { slashCommandsLoadTasks, slashCommands } from './../commands/commands.mts'
import { fileExists, readJsonFile, writeJsonFile } from '../lib/filesHelper.mts'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_PATH = __dirname.endsWith('class') ? path.join(__dirname, '..', 'data', 'config.json') : path.join(__dirname, 'data', 'config.json')

console.clear()
console.log(`\n[--------------------------- logs -----------------------------]\n`)


Log.info('Iniciando sesión...')
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers]
})

const rest = new REST().setToken(process.env.DISCORD_TOKEN)

await new Promise<void>(async (resolve, reject) => {
  client.once(Events.ClientReady, async client => {
    resolve()
  })
  client.login(process.env.DISCORD_TOKEN)
})
Log.success(`Sesión iniciada como ${client.user.tag}`, 1)


Log.info('Gestionando Configuración')
Configuration.CONFIG_PATH = CONFIG_PATH
if(!fileExists(CONFIG_PATH)){
  writeJsonFile(CONFIG_PATH, {})
}

if(!await fileExists(CONFIG_PATH)){
    await Configuration.save()
    Log.success(`Configuración creada en: ${CONFIG_PATH}`, 1)
}else{
    await Configuration.loadConfig(await readJsonFile(CONFIG_PATH))
    Log.success(`Configuración cargada en: ${CONFIG_PATH}`, 1)
}


Log.info('Cargando slash commands')
slashCommandsLoadTasks.forEach(async loadFunction => await loadFunction())
Log.success('Slash commands cargados', 1)

Log.info(`Notificando discord de la existencia de ${slashCommands.length} comandos`)
await rest.put(
    Routes.applicationCommands(process.env.DISCORD_APP_ID),
    { body: Object.values(slashCommands).map(c => c.command) },
)
.then((data: [any]) => Log.success(`Recargados correctamente ${data.length} comandos de aplicación.`, 1))
.catch(err => Log.error('Ha habido un error recargando los comandos disponibles.', 1) )

export class Bot {
  public static client = client
  public static rest = rest
  public static slashCommands = slashCommands
}

Log.success(`✅ Bot listo en ${(Math.floor(performance.now()) / 1000).toString().replace('.',',')}s`)