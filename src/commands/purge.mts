// if (message.content.startsWith(prefix) && message.content.includes("bulk")) {
//     if (message.guild.me.hasPermission('ADMINISTRATOR')) {
//       if (message.member.hasPermission('ADMINISTRATOR') || message.member.hasPermission('MANAGE_MESSAGES')) {
//         message.channel.send(`How many messages (1-95) would you like to delete? Use \`${prefix} cancel\` to cancel.`);
//         const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
//         console.log(collector)
//         collector.on('collect', message => {
//           if (message.content.trim() === `${prefix} cancel`) {
//             message.channel.send(`Operation cancelled.`)
//           } else {
//             if (isNaN(message.content.trim())) {
//               message.channel.send(`Response must contain only a number between 1 and 95. Operation cancelled.`)
//             } else {
//               if (message.content.trim() > 95) {
//                 message.channel.send(`You cannot delete more than 95 messages. Operation cancelled.`)
//               } else if (message.content.trim() < 1) {
//                 message.channel.send(`Answer cannot be less than 1. Operation cancelled.`)
//               } else {
//                 var originalNum = parseFloat(message.content.trim())
//                 var numBulkDelete = parseFloat(3) + originalNum
//                 message.channel.bulkDelete(numBulkDelete).catch(err => message.channel.send(`Error: messages older than 14 days cannot be deleted by this bot. Operation cancelled.`))
//               }
//             }
//           }
//           collector.stop()
//         })
//       } else {
//         message.channel.send(`You don't have permission to execute this command.`)
//       }
//     } else {
//       message.channel.send(`Purge Bot somehow doesn't have the necessary permissions to execute this command. Ensure the bot has an administrator role.`)
//     }
//   }

import { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType, ChatInputCommandInteraction, MessageFlags, ChannelType, TextChannel, TextChannel } from 'discord.js'
import { Bot } from '../class/Bot.mts'

const purgeCommand = new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Comando realizar borrados masivos')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts(InteractionContextType.Guild)
    .addSubcommand(subCommand => subCommand
        .setName('channel')
        .setDescription('Comando para borrar TODOS los mensajes de un canal')
        .addChannelOption(option =>
            option.setName('canal')
                .setName('cannel')
                .setDescription('El canal donde eliminar los mensajes')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        )
        .addStringOption(option =>
            option.setName('codigo de seguridad')
                .setName('code')
                .setDescription('El código de seguridad proporcionado por el bot')
                .setRequired(true)
        )
    )

async function actionAction(interaction: ChatInputCommandInteraction) {
    if (interaction.options.getSubcommand() === 'channel') {
        let channel = interaction.options.getChannel('channel') as TextChannel
        let code = interaction.options.getString('code')
        // var numBulkDelete = parseFloat(3) + originalNum
        // channel.bulkDelete(numBulkDelete).catch(err => message.channel.send(`Error: messages older than 14 days cannot be deleted by this bot. Operation cancelled.`))
        
        channel.bulkDelete(99999, true)
        // try {
        //     let messagesCount = 0
        //     do {
        //         let messages = await channel.messages.fetch({ limit: 100 })

        //         messagesCount = messages.size
        //         //Iterate through the messages here with the variable "messages".
        //         messages.forEach(message => message.delete())
        //     } while (messagesCount);
        // } catch (error) {
        //     console.log(error)
        // }
    }
}

export { purgeCommand, actionAction }