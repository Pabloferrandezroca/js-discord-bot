import { ChatInputCommandInteraction, EmbedBuilder, InteractionContextType, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Configuration } from "../class/Configuration.mts";
import { welcome } from "../app.mts";
import { commands } from "./commands.mts";

const conf = Configuration.getConfiguration()

const viewCommand = new SlashCommandBuilder()
    .setName('view')
    .setDescription('Comando para ver la configuracion, miembros del canal, etc...')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts(InteractionContextType.Guild)
    .addSubcommand(subcommand =>
        subcommand
            .setName('config')
            .setDescription('Cambiar aspectos de la configuración')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('status')
            .setDescription('Ver los miembros del canal')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('welcome')
            .setDescription('Prevuisualizar el mensaje de bienvenida')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('list')
            .setDescription('Ver la lista de comandos')
    )

async function viewAction(interaction: ChatInputCommandInteraction) {
    const category = interaction.options.getSubcommand();
    switch (category) {
        case 'config':
            let outMess = '';
            conf.getProperties().forEach((property) => {
                outMess += `- \`${property} = ${conf[property]}\`\n`
            });
            let embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Propiedades')
                .setDescription(outMess)
                .setTimestamp()
            interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });

            break;
        case 'status':
            async function getMembers(channel) {
                let channelUsers = [];
                let channelBots = [];
                const members = await channel.guild.members.fetch();
                members.forEach(member => {
                    if (member.user.bot === false) {
                        channelUsers.push(member.user.username);
                    }
                    else {
                        channelBots.push(member.user.username);
                    }
                });
                let channelMembers = channelUsers.length + channelBots.length
                let embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('Miembros del servidor')
                    .addFields(
                        { name: 'Miembros', value: channelMembers.toString() },
                        { name: 'Usuarios', value: channelUsers.length.toString() },
                        { name: 'Bots', value: channelBots.length.toString() }
                    )
                return embed;
            };
            let mensaje = await getMembers(interaction.channel);
            interaction.reply({ embeds: [mensaje], flags: MessageFlags.Ephemeral });
            break;
        case 'welcome':
            welcome.setTitle('Hola ' + interaction.user.displayName + ", Bienvendido a facturascripts!")
            interaction.reply({ embeds: [welcome], flags: MessageFlags.Ephemeral });
            break;
        case 'list':
            let list = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Lista de comandos')
                .setDescription('Lista de comandos disponibles')
                .addFields(
                    ...Object.entries(commands).map(([name, { command, action }]) => ({
                        name: `/${name}`,
                        value: command.description || 'Sin descripción',
                        inline: false
                    }))
                )
                interaction.reply({ embeds: [list], flags: MessageFlags.Ephemeral });
            break;
        default:
            interaction.reply({ content: 'Comando no valido', flags: MessageFlags.Ephemeral });
            break;
    }
}

export { viewCommand, viewAction }