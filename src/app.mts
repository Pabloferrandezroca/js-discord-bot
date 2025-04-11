//iniciar el bot
import './class/Bot.mts'

import { Events, EmbedBuilder } from 'discord.js'
import { Bot } from './class/Bot.mts' 

import { welcome } from './res/embedMessages.mts'



Bot.client.on(Events.GuildMemberAdd, async member => {
  welcome
    .setTitle('Hola ' + member.user.displayName + ", Bienvendido a facturascripts!")
  
  member.send({ embeds: [welcome] })
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