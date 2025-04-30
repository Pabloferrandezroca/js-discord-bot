import 'dotenv/config'

import { Client, REST, GatewayIntentBits, Routes, Events } from 'discord.js'
import { configType, Configuration } from './Configuration.mts'
import { Log } from './Log.mts'
import { slashCommandsLoadTasks, slashCommands } from './../commands/commands.mts'
import { fileExists, readJsonFile, writeJsonFile } from '../lib/filesHelper.mts'
import { fetchTextChannel, generateSecurityCode, notifySlashCommands } from '../lib/helpers.mts'
import { AppData } from './Appdata.mts'
import { awaitCacheLoading, checkCache, isUpdatingCache } from '../lib/gemini.mts'
import { APP_DATA_PATH, CONFIG_PATH, DATABASE_PATH } from '../paths.mts'
import { DatabaseManager } from './DatabaseManager.mts'
import { existsSync } from 'fs'

console.clear()
console.log(`\n[--------------------------- logs -----------------------------]\n`)


Log.info('Iniciando sesión...')
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
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
if(!await fileExists(CONFIG_PATH)){
  await writeJsonFile(CONFIG_PATH, {})
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


Log.info('Cargando datos de la aplicación')
if(!fileExists(APP_DATA_PATH)){
  await writeJsonFile(APP_DATA_PATH, {})
  Log.success(`Datos de aplicación creados en: ${APP_DATA_PATH}`, 1)
}else{
  await AppData.loadData()
  Log.success(`Datos de aplicación cargados en: ${APP_DATA_PATH}`, 1)

  
}

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

Log.info('Cargando base de datos')
DatabaseManager.create()
Log.success('Base de datos cargada', 1)

export class Bot {
  public static client = client
  public static rest = rest
  public static slashCommands = slashCommands
  public static securityCode = generateSecurityCode(6)
  public static isUpdatingCache(): boolean
  {
    return isUpdatingCache()
  }
  public static async awaitCacheLoading(): Promise<void>
  {
    await awaitCacheLoading()
  }
}

Log.warn(`Código de seguridad para comandos sensibles: [${Bot.securityCode}]`)

Log.success(`✅ Bot listo en ${(Math.floor(performance.now()) / 1000).toString().replace('.',',')}s`)

//actualizar cache si ha caducado o no existe
checkCache()