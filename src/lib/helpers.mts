import { ChannelType, TextChannel, type RepliableInteraction } from "discord.js";
import { client } from "../bot.mts"
import 'colors'


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
        const channel = await client.channels.fetch(channelID);
        if (channel && channel.type === ChannelType.GuildText) {
            return channel;
        } else {
            console.log(`==> Aviso: El canal insertado (${channelID}) no es de texto, cambialo por otro.`.yellow)
            return null;
        }
    } catch (error) {
        console.error(`Error al obtener el canal (${channelID}):`, error);
        return null;
    }
}