import { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType, GatewayIntentBits, type Channel, TextChannel, MessageFlags } from 'discord.js'
import { Configuration } from '../class/Configuration.mts'

const conf = Configuration
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
    let configuracion = conf.getProperties()
    let razon = interaction.options.getString('razon')
    Configuration.warningChannelID.send({content: razon})
}

export { warnCommand, warnAction }