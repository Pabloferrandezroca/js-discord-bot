//iniciar el bot
import './class/Bot.mts'

import { Events, EmbedBuilder, MessageFlags } from 'discord.js'
import { Bot } from './class/Bot.mts' 

import { welcome } from './res/embedMessages.mts'
import { Log } from './class/Log.mts'
try {



Bot.client.on(Events.GuildMemberAdd, async member => {
  welcome.setTitle('Hola ' + member.user.displayName + ", Bienvendido a facturascripts!")
  member.send({ embeds: [welcome] })
})

  Bot.client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()) {
      let command = Bot.slashCommands[interaction.commandName]

      if (command) {
        //para no parar la ejecución
        command['action'](interaction)
      } else {
        await interaction.reply(`No hay ningún comando nombrado \`${interaction.commandName}\`!`)
      }
    }
  })
} catch (error) {
  Log.error('Error: ' + error.message)
  error.stack.split("\n").forEach((mess: string) => {
    Log.error(mess, 1)
  })
  // if (interaction.replied) {
  //   interaction.editReply({ components: [], content: `Ha habido un error con el comando ${interaction.commandName}` })
  // } else {
  //   interaction.reply({ components: [], content: `Ha habido un error con el comando ${interaction.commandName}`, flags: MessageFlags.Ephemeral })
  // }
}