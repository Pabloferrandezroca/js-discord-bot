import { ChannelType, Routes, TextChannel, type RepliableInteraction } from "discord.js";
import { Log } from "../class/Log.mts";
import { Bot } from "../class/Bot.mts";


export async function replyAndDelete(timeout: number, instance: RepliableInteraction, content: {}){
    instance.editReply(content)
    await wait(timeout)
    instance.deleteReply()
}

export function wait(seconds) : Promise<void>
{
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

export async function fetchTextChannel(channelID: string): Promise<TextChannel | void> {
    try {
        const channel = await Bot.client.channels.fetch(channelID);
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

export async function notifySlashCommands(): Promise<[any]>
{
    let commands = []
    let slashCommands = Bot.slashCommands
    for (let propiedad in slashCommands) {
        commands.push(slashCommands[propiedad]["command"])
    }
    
    Log.info(`Informando sobre la existencia de ${slashCommands.length} comandos de aplicación.`)

    const data = await Bot.rest.put(
        Routes.applicationCommands(process.env.DISCORD_APP_ID),
        { body: slashCommands },
    ) as [any]

    Log.success(`Recargados correctamente ${data.length} comandos de aplicación.`, 1)
    return data
}

export async function notifyDeleteSlashCommands(): Promise<void>
{
    let commands = []
    let slashCommands = Bot.slashCommands
    for (let propiedad in slashCommands) {
        commands.push(slashCommands[propiedad]["command"])
    }
    
    Log.info(`Eliminando interacciones en discord`)

    await Bot.rest.put(Routes.applicationCommands(process.env.DISCORD_APP_ID), { body: [] })

    Log.success(`Interacciones antiguas eliminadas correctamente`, 1)
}

export async function getDiscordSlashCommands(): Promise<[any]>
{
    let commands = []
    let slashCommands = Bot.slashCommands
    for (let propiedad in slashCommands) {
        commands.push(slashCommands[propiedad]["command"])
    }
    
    Log.info(`Obteniendo interacciones remotas en discord`)

    let comandos = (await Bot.rest.get(Routes.applicationCommands(process.env.DISCORD_APP_ID), { body: [] })) as [any]

    Log.success(`Obtenidas ${comandos.length} reacciones`, 1)

    return comandos
}