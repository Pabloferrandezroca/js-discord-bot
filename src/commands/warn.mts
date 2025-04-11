import { Client, GatewayIntentBits, Events, TextChannel, EmbedBuilder, REST, Routes, MessageFlags, Embed, Message, SlashCommandBuilder, PermissionFlagsBits, InteractionContextType } from 'discord.js'
import { Configuration } from '../class/Configuration.mts'


const conf = Configuration.getConfiguration()

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
    conf.getProperties().forEach((property) => {
        console.log(`- \`${property} = ${Configuration[property]}\``)
    });
}

export { warnCommand, warnAction }