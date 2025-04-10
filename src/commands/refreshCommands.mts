import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, InteractionContextType, MessageFlags, PermissionFlagsBits, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextChannel } from "discord.js";

const refreshCommandsCommand = new SlashCommandBuilder()
.setName('reset')
.setDescription('Borra y vuelve a registrar los comandos disponibles en el bot.')
.addStringOption(option => {
    return option.setName('category')
    .setDescription('Un test válido')
    .setRequired(true)
    .addChoices(
        { name: 'Funny', value: 'gif_funny' },
        { name: 'Meme', value: 'gif_meme' },
        { name: 'Movie', value: 'gif_movie' },
    )
})
.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
.setContexts(InteractionContextType.Guild)

const row = new ActionRowBuilder<ButtonBuilder>()
.addComponents(
    new ButtonBuilder()
    .setCustomId('cancel')
    .setLabel('Cancel')
    .setStyle(ButtonStyle.Secondary)
)
// const row2 = new ActionRowBuilder<StringSelectMenuBuilder>()
// .addComponents(
//     new StringSelectMenuBuilder()
//     .addOptions()
// )

let refreshCommandsAction = async (interaction: ChatInputCommandInteraction): Promise<void> => {
    
    // await interaction.deferReply()

    // let channel = interaction.client.channels.cache.get(interaction.channelId) as TextChannel
    // channel.send('Hello here!')

    // await wait(3)

    await interaction.reply( { content: "test", components: [row] })
    // interaction.reply( { content: 'Comandos actualizados correctamente', flags: [MessageFlags.Ephemeral, MessageFlags.Loading] })
    // interaction.followUp({ flags: MessageFlags.Loading })
    // interaction.client.user.setActivity({ flags: MessageFlags.Loading })
}

export { refreshCommandsCommand, refreshCommandsAction }