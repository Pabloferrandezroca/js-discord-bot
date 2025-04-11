import { Client, SlashCommandBuilder, PermissionFlagsBits, InteractionContextType, GatewayIntentBits, type Channel, TextChannel, MessageFlags } from 'discord.js'
import { Configuration } from '../class/Configuration.mts'


const conf = Configuration
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers]
})
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
    conf.getProperties().forEach(async (property) => {
        if (property === 'warningChannelID') {
            const channel = await client.channels.fetch(conf[property]);
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