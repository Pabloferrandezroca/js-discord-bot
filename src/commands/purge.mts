import { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType, ChatInputCommandInteraction, MessageFlags, ChannelType, TextChannel } from 'discord.js'
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
                .setName('channel')
                .setDescription('El canal donde eliminar los mensajes')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        )
        .addStringOption(option =>
            option.setName('codigo_de_seguridad')
                .setName('code')
                .setDescription('El código de seguridad proporcionado por el bot')
                .setRequired(true)
        )
    )
    .addSubcommandGroup(group => group
        .setName('bot')
        .setDescription('Para aspectos relacionados con el bot')
        .addSubcommand(subcommand => subcommand
            .setName('messages')
            .setDescription('Para borrar los mensajes del bot')
        )
        .addSubcommand(subcommand => subcommand
            .setName('threads')
            .setDescription('Para borrar los threads del bot')
        )
    )

async function purgeAction(interaction: ChatInputCommandInteraction) {
    if (interaction.options.getSubcommand() === 'channel') {
        let channel = interaction.options.getChannel('channel') as TextChannel
        let code = interaction.options.getString('code')
        if(code !== Bot.securityCode){
            interaction.reply({content: 'Codigo de verificación incorrecto'})
            return
        }

        interaction.reply({content: 'Eliminando mensajes', flags: MessageFlags.Ephemeral})
        // var numBulkDelete = parseFloat(3) + originalNum
        // channel.bulkDelete(numBulkDelete).catch(err => message.channel.send(`Error: messages older than 14 days cannot be deleted by this bot. Operation cancelled.`))
        
        let deleted
        do {
            // const messages = await channel.messages.fetch({ limit: 100 })
            // if (messages.size === 0) break;
            deleted = await channel.bulkDelete(100, true)
            
            //await new Promise(resolve => setTimeout(resolve, 500))
          } while (deleted.size > 0);
    }
}

export { purgeCommand, purgeAction }