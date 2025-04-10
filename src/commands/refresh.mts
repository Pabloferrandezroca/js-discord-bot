import { MessageFlags, PermissionFlagsBits, REST, Routes, SlashCommandBuilder } from "discord.js";
import { commands } from "./commands.mts";

const refreshCommand = new SlashCommandBuilder()
    .setName('refresh')
    .setDescription('Comando para refrescar los comandos del bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

async function refresh(interaction) {
    const rest = new REST().setToken(process.env.DISCORD_TOKEN)
    console.log("Eliminando interacciones antiguas")
    await rest.put(Routes.applicationCommands(process.env.DISCORD_APP_ID), { body: [] })
        .then(() => console.log('Slash commands cleared.'))
        .catch(console.error);
    console.log("Interacciones antiguas eliminadas")

    let slashCommands = []
    for (let propiedad in commands) {
        if (commands[propiedad][0]?.toJSON) {
            slashCommands.push(commands[propiedad][0].toJSON());
        }
    }

    try {
        console.log(`Informando sobre la existencia de ${slashCommands.length} comandos de aplicación(/).`);

        const data = await rest.put(
            Routes.applicationCommands(process.env.DISCORD_APP_ID),
            { body: slashCommands },
        ) as [any]

        //console.log(data)
        console.log(`Recargados correctamente ${data.length} comandos de aplicación(/).`);
        interaction.reply({ content: `Recargados correctamente ${data.length} comandos de aplicación(/).`, flags: MessageFlags.Ephemeral })
    } catch (error) {
        console.error(error);
        interaction.reply({ content: `Error al recargar los comandos: ${error}`, flags: MessageFlags.Ephemeral })
    }
}
export { refreshCommand, refresh }