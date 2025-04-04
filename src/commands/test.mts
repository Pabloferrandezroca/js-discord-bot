import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";

const testCommand = new SlashCommandBuilder()
.setName('test')
.setDescription('Comprueba que funciona correctamente la interacción')
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

let testAction = (interaction: ChatInputCommandInteraction) => {
    interaction.reply( { content: 'Todo ok!', flags: MessageFlags.Ephemeral })
}

export { testCommand, testAction }