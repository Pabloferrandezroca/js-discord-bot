import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Collection, Message, MessageFlags, ModalBuilder, SlashCommandBuilder, TextChannel, TextInputBuilder, TextInputStyle, ThreadAutoArchiveDuration, type Snowflake } from "discord.js";
import { User } from "../class/User.mts";
import { Configuration } from "../class/Configuration.mts";
import { Log } from "../class/Log.mts";
import { Bot } from "../class/Bot.mts";
import { replaceMentionsWithUsernames, replaceUsernamesWithMentions, splitFromJumpLines } from "../lib/helpers.mts";

const helpCommand = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Comando para pedirle ayuda al chatbot')
  .addSubcommandGroup(sucommandGroup => {
    return sucommandGroup
      .setName('chatbot')
      .setDescription('Subcomandos del chatbot de ayuda.')
      .addSubcommand(command => command
        .setName('start')
        .setDescription('Te comunica con una AI para resolver tus dudas de programación.')
      )
      .addSubcommand(command => command
        .setName('stop')
        .setDescription('Termina la conversación con el chatbot si estas todavía en ello.')
      )
  })

const startChatbotAction = async (interaction: ChatInputCommandInteraction) => {
  const AI_CHANNEL = Configuration.helpIAChannel

  //await interaction.deferReply()
  // if (interaction.channelId !== AI_CHANNEL.id) {
  //   await interaction.reply({ content: "El comando solo funciona en el canal programacion", flags: MessageFlags.Ephemeral })
  //   return
  // }

  let replyMessageText = `<@${interaction.user.id}> se va a abrir un chat con un chatbot para que te ayude.\n`
    + '- Responderá a tu mensaje cuando sea una **respuesta** al **último** mensaje enviado del bot.\n'
    + '- No puede ver las imágenes que le envies (solo el texto).\n'
    + '- Se cerrará el chat automáticamente después de 15 minutos.\n'
    + '¿Desea iniciar el chat?'

  let interactionReply = await interaction.reply({
    content: replyMessageText,
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(acceptButton, cancelButton)
    ],
    flags: MessageFlags.Ephemeral,
    withResponse: true
  })

  try {
    let response = await interactionReply.resource.message.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id, time: 60_000 })

    if (response.customId === 'cancel') {
      await interaction.deleteReply()
      return
    }

  } catch (e) {
    console.log(e)
    await interaction.editReply({ content: 'No se ha elegido una opción a tiempo. Cancelada.', components: [] })
    return
  }

  const user = User.getUser(interaction.user)
  if (user.isInChat()) {
    await interaction.editReply({ 
      content: `Estas actualmente en una sesión de chat. Usa \`help endchat\` para cerrar el chat.`
      , components: []
    })
    //Hola <@${user.getID()}>, ¿en que puedo ayudarte hoy?
    return
  }
  user.startChat(interaction.user.displayName)

  const thread = await AI_CHANNEL.threads.create({
    name: 'Asistente virtual',
    autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,
    reason: 'Hilo para ser asistido por asistente y no molestar en el canal principal.',
  })

  //await thread.members.add(user.getID())
  await interaction.deleteReply()
  let AIMessage = await thread.send(`Hola <@${user.getID()}>, ¿en que puedo ayudarte hoy?`)
  user.lastIAMessage = AIMessage
  while (user.isInChat()) {
    try {
      const collected = await thread.awaitMessages({
        filter: msg => msg.author.id !== Bot.client.user.id,
        max: 1,
        time: 15 * 60 * 1000
      })

      if(collected.size === 0){
        await AIMessage.edit(AIMessage.content + '\n - **Se ha cerrado la conversación por inactividad**')
        user.endChat()
        return
      }
      const userResponse = collected.first();

      await (userResponse.channel as TextChannel).sendTyping()

      let usermsg = await replaceMentionsWithUsernames(userResponse.content, userResponse.guild)
      //userResponse.content.replaceAll(`<@${Bot.client.user.id}>`, `<@${Bot.client.user.username}>`)
      let generatedMessage = await user.sendMessage(`[User:${userResponse.author.username}]:` + usermsg)
      generatedMessage = await replaceUsernamesWithMentions(generatedMessage, userResponse.guild)
      // Log.info(generatedMessage)
      // if(generatedMessage.length > 2000){
      //   Log.warn('pilla mas de 2000')
      //   generatedMessage = generatedMessage.substring(0, 2000)
      // }

      if(generatedMessage.includes('$$END_CHAT$$')) {
        let msg = generatedMessage.replace('$$END_CHAT$$', '').trimEnd()
        if(msg.trim() !== ""){
          let sepparatedMessages = splitFromJumpLines(msg, 2000)
          let last = userResponse
          for (const mensaje of sepparatedMessages) {
            last = await last.reply({content: mensaje})
          }
          user.lastIAMessage = last
        }
        await user.lastIAMessage.reply('- **Se ha cerrado la conversación (dada por finalizada)**')
        user.endChat()
        return
      }else{
        let sepparatedMessages = splitFromJumpLines(generatedMessage, 2000)
        let last = userResponse
        for (const mensaje of sepparatedMessages) {
          last = await last.reply({content: mensaje})
        }
        user.lastIAMessage = last
      }

      

    } catch (err) {
      AIMessage.reply('- **Se ha cerrado la conversación (error interno del bot)**')
      console.error(err)
      user.endChat()
      return
    }
  }
}

async function stopChatbotAction(interaction: ChatInputCommandInteraction)
{
  let user = User.getUser(interaction.user)
  if(user.isInChat()){
    user.lastIAMessage = await user.lastIAMessage.reply('- **Se ha cerrado la conversación (cerrada por el usuario)**')
    user.endChat()
    // await interaction.reply({
    //   content: "Se ha cerrado la conversación correctamente.", 
    //   flags: MessageFlags.Ephemeral
    // })
  }else{
    await interaction.reply({
      content: "No hay ninguna conversación abierta.", 
      flags: MessageFlags.Ephemeral
    })
  }
}

async function helpAction(interaction: ChatInputCommandInteraction)
{
  if (interaction.options.getSubcommandGroup() === 'chatbot') {
    switch (interaction.options.getSubcommand()) {
      case 'start':
        await startChatbotAction(interaction)
        break;
      case 'stop':
        await stopChatbotAction(interaction)
        break;
      default:
        break;
    }
  }
}

const cancelButton = new ButtonBuilder()
  .setCustomId("cancel")
  .setStyle(ButtonStyle.Secondary)
  .setLabel('Cancelar')

const acceptButton = new ButtonBuilder()
  .setCustomId("accept")
  .setStyle(ButtonStyle.Primary)
  .setLabel('Aceptar')

export { helpCommand, helpAction }