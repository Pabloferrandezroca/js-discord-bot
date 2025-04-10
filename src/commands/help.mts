import { ActionRowBuilder, ChatInputCommandInteraction, MessageFlags, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { User } from "../class/User.mts";

const helpCommand = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Comando para pedirle ayuda al chatbot')


// solo recibe el mensaje si el canal es llamado *programaci*
async function help(interaction: ChatInputCommandInteraction) {
    if (interaction.channel?.name.toLocaleLowerCase().includes("programaci")) {
        const modal = new ModalBuilder()
            .setCustomId('helpModal')
            .setTitle('¿En qué puedo ayudarte?');

        const textInput = new TextInputBuilder()
            .setCustomId('helpInput')
            .setLabel('Escribe tu duda o mensaje')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Escribe aqui')
            .setRequired(true);

        const row = new ActionRowBuilder<TextInputBuilder>().addComponents(textInput);
        modal.addComponents(row);

        await interaction.showModal(modal);
    }
    else {
        interaction.reply({ content: "El comando solo funciona en el canal programacion", flags: MessageFlags.Ephemeral })
    }
    interaction.client.on('interactionCreate', async interaction => {
      if (interaction.isModalSubmit() && interaction.customId === 'helpModal') {
        let user = User.getUser(interaction.user.id);
        const userInput = interaction.fields.getTextInputValue('helpInput');
        let respuesta = await user.sendMessage(userInput, interaction.user.username);
        await interaction.reply({
          content: `${respuesta}`,
        })
      }
    })
}

export { helpCommand, help }