import { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType, ChatInputCommandInteraction, MessageFlags, ChannelType, TextChannel } from 'discord.js'
import { Bot } from '../class/Bot.mts'

const deleteCommand = new SlashCommandBuilder()
    .setName('delete')
    .setDescription('Comando realizar borrados masivos')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts(InteractionContextType.Guild)
    .addSubcommand(subcommand => subcommand
        .setName('thread')
        .setDescription('Para borrar el hilo en el que se ejecute este mensaje.')
    )

async function deleteAction(interaction: ChatInputCommandInteraction) {
    if (interaction.options.getSubcommand() === 'thread') {
        await interaction.deferReply({flags: MessageFlags.Ephemeral})


        switch(interaction.channel.type){
            case ChannelType.PublicThread:
            case ChannelType.PrivateThread:
            case ChannelType.AnnouncementThread:
                interaction.editReply({content: 'Borrando thread'})
                if (interaction.channel.archived === false) {
                    await interaction.channel.setArchived(true, 'Archivar antes de eliminar');
                }
                interaction.channel.delete()
                break;
            default:
                interaction.editReply({content: 'Esto no es un thread'})
                break;
        }
    }
}

export { deleteCommand, deleteAction }