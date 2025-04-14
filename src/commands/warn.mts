import { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType, ChatInputCommandInteraction, MessageFlags } from 'discord.js'
import { Configuration } from '../class/Configuration.mts'
import { Log } from '../class/Log.mts';

const warnCommand = new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Comando para dar adertencias')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts(InteractionContextType.Guild)
    .addUserOption(option =>
        option.setName('usuario')
            .setDescription('Usuario al que se le va a dar la advertencia')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('razon')
          .setDescription('Razón de la advertencia')
          .setRequired(true));

async function warnAction(interaction: ChatInputCommandInteraction) {
    if (Configuration.warningChannelID === undefined) {
        Log.warn('No se ha configurado el canal de warnings, añadelo usando el comando set')
        Log.warn('Abortando', 1)
        await interaction.reply({
            content: 'No se ha podido realizar la acción porque no existe ningún canal de warnings configurado.',
            flags: MessageFlags.Ephemeral
        })
        return
    }
    else{
        let razon = interaction.options.getString('razon')
        let user = interaction.options.getUser('usuario')
        await Configuration.warningChannelID.send({content: `<@${user.id}>`, embeds: [{title: 'Advertencia', description: razon}]})
    }
    
}

export { warnCommand, warnAction }