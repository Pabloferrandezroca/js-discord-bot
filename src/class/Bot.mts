import 'dotenv/config'

import { Client, REST, GatewayIntentBits, Routes, Events } from 'discord.js'
import { configType, Configuration } from './Configuration.mts'
import { Log } from './Log.mts'
import { slashCommandsLoadTasks, slashCommands } from './../commands/commands.mts'
import { fileExists, readJsonFile, writeJsonFile } from '../lib/filesHelper.mts'
import { fileURLToPath } from 'url'
import path from 'path'
import { fetchTextChannel, generateSecurityCode, notifyDeleteSlashCommands, notifySlashCommands } from '../lib/helpers.mts'
import { generarMensajeHuerfano } from '../lib/gemini.mts'

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


Log.info('Cargando Configuración')
Configuration.CONFIG_PATH = CONFIG_PATH
if(!fileExists(CONFIG_PATH)){
  writeJsonFile(CONFIG_PATH, {})
}

if(!await fileExists(CONFIG_PATH)){
    await Configuration.save()
    Log.success(`Configuración creada en: ${CONFIG_PATH}`, 1)
}else{
  const data = await readJsonFile(CONFIG_PATH) as {[key: string]: string|number}
  for (let prop in data) {
    if(Configuration.type(prop) == configType.textChannel && data[prop] !== undefined){
        Configuration[prop] = await fetchTextChannel(client, data[prop] as string)
    }else{
        Configuration[prop] = data[prop]
    }
  
  }
  Log.success(`Configuración cargada en: ${CONFIG_PATH}`, 1)
}

Log.info('Revisando configuración')
Configuration.getProperties().forEach(prop => {
  if(Configuration[prop] === undefined){
    Log.warn(`[${prop}] sin valor, agregalo usando el comando set por favor.`, 1)
  }
})

Log.info('Cargando slash commands')
slashCommandsLoadTasks.forEach(async loadFunction => await loadFunction())
Log.success('Slash commands cargados', 1)

Log.info(`Actualizando ${Object.keys(slashCommands).length} comandos`)

// notifyDeleteSlashCommands(rest)
// .then(() => Log.info(`Borrados comandos antiguos de discord`, 1))
// .catch(err => {
//   Log.error('Ha habido un error en la petición de borrado a discord', 1)
//   // console.log(err)
// })

await notifySlashCommands(rest, slashCommands)
.then((data: [any]) => Log.success(`Actualizados correctamente ${data.length} comandos`, 1))
.catch(err => {
  Log.error('Ha habido un error en la petición de actualización de los comandos de aplicación', 1)
  // console.log(err)
})


export class Bot {
  public static client = client
  public static rest = rest
  public static slashCommands = slashCommands
  public static securityCode = generateSecurityCode(6)
}

Log.warn(`Código de seguridad para comandos sensibles: [${Bot.securityCode}]`)

Log.success(`✅ Bot listo en ${(Math.floor(performance.now()) / 1000).toString().replace('.',',')}s`)