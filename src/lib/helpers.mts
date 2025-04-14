import { ChannelType, Client, REST, Routes, TextChannel, type RepliableInteraction } from "discord.js";
import { Log } from "../class/Log.mts";
import { type CommandCoupleType } from "../commands/commands.mts";


export async function replyAndDelete(timeout: number, instance: RepliableInteraction, content: {}){
    instance.editReply(content)
    await wait(timeout)
    instance.deleteReply()
}

export function wait(seconds) : Promise<void>
{
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

export async function fetchTextChannel(client: Client, channelID: string): Promise<TextChannel | void> {
    try {
        const channel = await client.channels.fetch(channelID);
        if (channel && channel.type === ChannelType.GuildText) {
            return channel;
        } else {
            Log.warn(`Aviso: El canal insertado (${channelID}) no es de texto, cambialo por otro.`)
            return null;
        }
    } catch (error) {
        Log.error(`Error al obtener el canal (${channelID}):`)
        return null;
    }
}

export async function notifySlashCommands(rest: REST, slashCommands: CommandCoupleType): Promise<[any]>
{
    let commands = []
    for (let propiedad in slashCommands) {
        commands.push(slashCommands[propiedad]["command"])
    }
    
    // Log.info(`Informando sobre la existencia de ${slashCommands.length} comandos de aplicación.`)

    const data = await rest.put(
        Routes.applicationCommands(process.env.DISCORD_APP_ID),
        { body: commands },
    ) as [any]

    // Log.success(`Recargados correctamente ${data.length} comandos de aplicación.`, 1)
    return data
}

export async function notifyDeleteSlashCommands(rest: REST): Promise<void>
{
    
    // Log.info(`Eliminando interacciones en discord`)

    return await rest.put(Routes.applicationCommands(process.env.DISCORD_APP_ID), { body: [] }) as any

    // Log.success(`Interacciones antiguas eliminadas correctamente`, 1)
}

export async function getDiscordSlashCommands(rest: REST, slashCommands: CommandCoupleType): Promise<[any]>
{
    let commands = []
    for (let propiedad in slashCommands) {
        commands.push(slashCommands[propiedad]["command"])
    }
    
    Log.info(`Obteniendo interacciones remotas en discord`)

    let comandos = (await rest.get(Routes.applicationCommands(process.env.DISCORD_APP_ID), { body: [] })) as [any]

    Log.success(`Obtenidas ${comandos.length} reacciones`, 1)

    return comandos
}

export async function generateSecurityCode(length: number): Promise<string>
{
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}