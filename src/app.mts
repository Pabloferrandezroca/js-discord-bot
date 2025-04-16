//iniciar el bot
import './class/Bot.mts'

import { Events, EmbedBuilder, MessageFlags, Client } from 'discord.js'
import { Bot } from './class/Bot.mts'

import { welcome } from './res/embedMessages.mts'
import { Log } from './class/Log.mts'
import { Configuration } from './class/Configuration.mts'
import { generarMensajeHuerfano } from './lib/gemini.mts'

Bot.client.on(Events.GuildMemberAdd, async member => {
  if (Configuration.welcomeChannelID === undefined) {
    Log.warn('Canal de bienvenida no configurado bienvenida, añadelo usando el comando set')
    return

  }
  else {
    welcome
      .setTitle('Hola ' + member.user.displayName + ", Bienvendido a facturascripts!")
    await Configuration.welcomeChannelID.send({ content: `<@${member.id}>` })
    await Configuration.welcomeChannelID.send({ embeds: [welcome] })
  }

})

Bot.client.on(Events.MessageCreate, async message => {
  if(message.mentions.has(Bot.client.user)){
    let respuesta = await generarMensajeHuerfano(message.content)
    message.reply({ content: respuesta.toString() })
  }
})

Bot.client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isChatInputCommand()) {
    let command = Bot.slashCommands[interaction.commandName]

    if (command) {
      command['action'](interaction)
    } else {
      interaction.reply(`No hay ningún comando nombrado \`${interaction.commandName}\`!`)
    }
  }
})