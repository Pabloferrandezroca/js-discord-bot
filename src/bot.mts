import { Client, Events, GatewayIntentBits } from 'discord.js'
import { REST } from '@discordjs/rest'
import { Configuration } from './class/Configuration.mts'
import { Log } from './class/Log.mts'

import 'dotenv/config'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers]
})

const rest = new REST().setToken(process.env.DISCORD_TOKEN)

// any porque hay errores de tipado sin sentido
let bot: any = { 
  client,
  rest
}

async function initBot()
{
  
  
  
  Log.info('Iniciando sesión...')
  await bot.client.login(process.env.DISCORD_TOKEN)
  Log.success(`Sesión iniciada como ${client.user.tag}`)

  await Configuration.init()
  
  // console.log("Eliminando interacciones antiguas")
  // await rest.put(Routes.applicationCommands(process.env.DISCORD_APP_ID), { body: [] })
  //   .then(() => console.log('Slash commands cleared.'))
  //   .catch(console.error);
  // console.log("Interacciones antiguas eliminadas")

  let commands = []
  let slashCommands = await import('./commands/commands.mts')
  for (let propiedad in slashCommands) {
    commands.push(slashCommands[propiedad]["command"])
  }

  /*try {
    console.log(`==> Informando sobre la existencia de ${slashCommands.length} comandos de aplicación.`.blue)

    const data = await rest.put(
      Routes.applicationCommands(process.env.DISCORD_APP_ID),
      { body: slashCommands },
    ) as [any]

    //console.log(data)
    console.log(`\t-> Recargados correctamente ${data.length} comandos de aplicación.`.green);
  } catch (error) {
    console.error(error);
  }*/

  bot.slashCommands = slashCommands

  console.log(`\n[--------------------------- logs -----------------------------]\n`.cyan);
  //console.log(await rest.get(Routes.applicationCommands(process.env.DISCORD_APP_ID), { body: [] }))
}

export { bot, initBot, client }