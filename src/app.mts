//iniciar el bot
import './class/Bot.mts'

import { Events, EmbedBuilder, MessageFlags, Client, ChannelType } from 'discord.js'
import { Bot } from './class/Bot.mts'

import { welcome } from './res/embedMessages.mts'
import { Log } from './class/Log.mts'
import { Configuration } from './class/Configuration.mts'
import { checkCache, generarMensajeHuerfano } from './lib/gemini.mts'
import { splitFromJumpLines, wait } from './lib/helpers.mts'
import { DatabaseManager } from './class/DatabaseManager.mts'

Bot.client.on(Events.GuildMemberAdd, async member => {
  if (Configuration.welcomeChannelID === undefined) {
    Log.warn('Canal de bienvenida no configurado bienvenida, añadelo usando el comando set')
    return
  }
  else {
    welcome
      .setTitle('Hola ' + member.user.displayName + ", Bienvendido a facturascripts!")
    let idMess = await Configuration.welcomeChannelID.send({ content: `<@${member.id}>` })
    let idEmb = await Configuration.welcomeChannelID.send({ embeds: [welcome] })
    DatabaseManager.addMessage(idMess.id)
    DatabaseManager.addMessage(idEmb.id)
  }
})

Bot.client.on(Events.MessageCreate, async message => {
  if(message.mentions.has(Bot.client.user) && message.author.id !== Bot.client.user.id){
    if (Configuration.helpIAChannel === undefined) {
      Log.warn('Canal de ayuda no configurado, añadelo usando el comando set')
      return
    }

    if(message.channel.id === Configuration.helpIAChannel.id){

      await message.react('⌛')

      // en caso de estar actualizando el cache avisa al usuario.
      if(Bot.isUpdatingCache()){
        let response = await message.reply(`<@${message.author.id}> actualmente estoy actualizando mi conocimiento sobre la documentación de facturascripts, puedo tardar hasta 5-10 minutos. Te responderé en cuanto termine ||(borraré este mensaje cuando acabe)||.`)
        await Bot.awaitCacheLoading()
        await response.delete()
      }

      await message.channel.sendTyping()
      let aiResp = await generarMensajeHuerfano(
        message.content,
        `
        Eres un inteligencia artificial experta en resolver dudas sobre programación y más concretamente FacturaScripts. Responde de forma directa, breve y precisa, como si ya estuvieras en medio de una conversación. No saludes ni te extiendas innecesariamente.

        Si según tu criterio la respuesta requiere una explicación larga o varios pasos, sugiere al usuario ejecutar el comando \`/help chatbot start\` para iniciar una conversación más detallada pero también responde a la pregunta que te ha hecho.

        Tu respuesta no debe superar los 2000 caracteres. Si es posible, responde en una sola frase o directamente con el dato solicitado solo si no requiere de explicación.
        `
      )
      await message.reactions.resolve('⌛').users.remove(Bot.client.user.id)
      let sepparatedMessages = splitFromJumpLines(aiResp, 2000)
      let last = message
      for (const mensaje of sepparatedMessages) {
        last = await last.reply({ content: mensaje })
        DatabaseManager.addMessage(last.id)
      }

    }else{
      if(message.channel.type == ChannelType.PublicThread || message.channel.type == ChannelType.PrivateThread){
        return
      }
      let resp = await message.reply({ content: `Solo te puedo responder en el canal <#${Configuration.helpIAChannel.id}>` })
      let id = resp.id
      DatabaseManager.addMessage(id)
      await wait(10);
      await resp.delete()
      DatabaseManager.deleteMessage(id)
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