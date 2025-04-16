import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Collection, Message, MessageFlags, ModalBuilder, SlashCommandBuilder, TextChannel, TextInputBuilder, TextInputStyle, type Snowflake } from "discord.js";
import { User } from "../class/User.mts";
import { Configuration } from "../class/Configuration.mts";
import { Log } from "../class/Log.mts";

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

  //interaction.deferReply()
  if (interaction.channelId !== AI_CHANNEL.id) {
    await interaction.reply({ content: "El comando solo funciona en el canal programacion", flags: MessageFlags.Ephemeral })
    return
  }

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
    await interaction.editReply({ content: 'Estas actualmente en una sesión de chat. Usa `help endchat` para cerrar el chat.', components: [] })
    return
  }

  user.startChat(interaction.user.displayName)
  await interaction.deleteReply()
  let AIMessage: Message = await AI_CHANNEL.send(`Hola <@${user.getID()}>, ¿en que puedo ayudarte hoy?`)
  user.lastIAMessage = AIMessage
  while (true) {
    try {
      const collected = await AI_CHANNEL.awaitMessages({
        filter: msg => msg.reference?.messageId === user.lastIAMessage.id && msg.author.id === user.getID(),
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
      let generatedMessage = await user.sendMessage(userResponse.content)
      if(generatedMessage.length > 2000){
        generatedMessage = generatedMessage.substring(0, 2000)
      }
      Log.info(`Ha respondido: ${generatedMessage}`)
      if(generatedMessage.includes('$$END_CHAT$$')) {
        let replyMessage = generatedMessage.replace('$$END_CHAT$$', '').trimEnd() + 
        '\n - **Se ha cerrado la conversación (dada por finalizada)**'
        user.lastIAMessage = await userResponse.reply({
          content: replyMessage
        })
        user.endChat()
        return
      }

      user.lastIAMessage = await userResponse.reply({
        content: generatedMessage
      })

    } catch (err) {
      await AIMessage.edit(AIMessage.content + '\n - **Se ha cerrado la conversación (error interno del bot)**')
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
    let replyMessage = user.lastIAMessage.content +
    '\n - **Se ha cerrado la conversación (cerrada por el usuario)**'
    user.lastIAMessage = await user.lastIAMessage.edit({
      content: replyMessage
    })
    user.endChat()
    await interaction.reply({
      content: "Se ha cerrado la conversación correctamente.", 
      flags: MessageFlags.Ephemeral
    })
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