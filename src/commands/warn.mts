import { Client, SlashCommandBuilder, PermissionFlagsBits, InteractionContextType, GatewayIntentBits, type Channel, TextChannel, MessageFlags } from 'discord.js'
import { Configuration } from '../class/Configuration.mts'

const warnCommand = new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Comando para dar adertencias')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts(InteractionContextType.Guild)
    .addStringOption(option =>
        option.setName('razon')
          .setDescription('Razón de la advertencia')
          .setRequired(true));

async function warnAction(interaction) {
    Configuration.getProperties().forEach(async (property) => {
        if (property === 'warningChannelID') {
            const channel = Configuration[property]
            if (channel.isTextBased && channel instanceof TextChannel) {
                channel.send('hola');
            }
            else{
                interaction.reply({ content: 'El canal no es un canal de texto', ephemeral: true });
            }
        }
    });
}

export { warnCommand, warnAction }