//iniciar el bot
import './class/Bot.mts'

import { Events, EmbedBuilder, MessageFlags, Client, ChannelType } from 'discord.js'
import { Bot } from './class/Bot.mts'

import { welcome } from './res/embedMessages.mts'
import { Log } from './class/Log.mts'
import { Configuration } from './class/Configuration.mts'
import { generarMensajeHuerfano } from './lib/gemini.mts'
import { wait } from './lib/helpers.mts'

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
  if(message.mentions.has(Bot.client.user) && message.author.id !== Bot.client.user.id){
    if (Configuration.helpIAChannel === undefined) {
      Log.warn('Canal de ayuda no configurado, añadelo usando el comando set')
      return
    }
    if(message.channel.id === Configuration.helpIAChannel.id){
      await message.channel.sendTyping()
      let respuesta = await generarMensajeHuerfano(
        message.content, 
        `
        Eres un inteligencia artificial experta en resolver dudas sobre programación y más concretamente FacturaScripts. Responde de forma directa, breve y precisa, como si ya estuvieras en medio de una conversación. No saludes ni te extiendas innecesariamente.

        Si según tu criterio la respuesta requiere una explicación larga o varios pasos, sugiere al usuario ejecutar el comando \`/help chatbot start\` para iniciar una conversación más detallada.

        Tu respuesta no debe superar los 2000 caracteres. Si es posible, responde en una sola frase o directamente con el dato solicitado.
        `
      )
      message.reply({ content: respuesta })
    }else{
      if(message.channel.type == ChannelType.PublicThread || message.channel.type == ChannelType.PrivateThread){
        return
      }
      let resp = await message.reply({ content: 'Solo me puedes mencionar en el canal ' + Configuration.helpIAChannel.name })
      await wait(10);
      resp.delete()
      return
    }
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