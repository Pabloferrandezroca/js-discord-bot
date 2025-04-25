import { ChannelType, Client, Guild, REST, Routes, TextChannel, type RepliableInteraction } from "discord.js";
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

export function generateSecurityCode(length: number): string
{
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export async function replaceMentionsWithUsernames(input: string,guild: Guild): Promise<string> 
{
    const mentionRegex = /<@!?(\d+)>/g///<@!?(\d+)>/g => incluye roles
    const matches = [...input.matchAll(mentionRegex)]

    const uniqueIds = [...new Set(matches.map(match => match[1]))]

    const userMap: Record<string, string> = {}

    for (const id of uniqueIds) {
        try {
            const member = await guild.members.fetch(id)
            userMap[id] = `<@${member.user.username}>`
        } catch {
            userMap[id] = "<@usuario-desconocido>"
        }
    }
    return input.replace(mentionRegex, (_, id) => userMap[id] || `<@${id}>`)
}

export async function replaceUsernamesWithMentions(input: string,guild: Guild): Promise<string>
{
    const usernameRegex = /@([a-zA-Z0-9_\.]+)/g
    const matches = [...input.matchAll(usernameRegex)]
  
    const uniqueUsernames = [...new Set(matches.map(match => match[1]))]
    const userMap: Record<string, string> = {}
  
    const members = await guild.members.fetch()
    for (const username of uniqueUsernames) {
        // Log.warn(username)
        const member = members.find(member => {
            // Log.warn(`${member.user.username} ${username}`, 1)
            return member.user.username === username
        })

        if (member) {
            userMap[username] = `@${member.id}`
        } else {
            userMap[username] = `@${username}`
        }
    }
  
    return input.replace(usernameRegex, (_, username) => userMap[username] || `@${username}`)
  }

  export function splitFromJumpLines(text: string, maxLength: number): string[] {
    if (text.length <= maxLength) return [text]
  
    const secciones: string[] = []
  
    let restante = text
  
    while (restante.length > maxLength) {
      // Tomamos los primeros 2000 caracteres
      const fragmento = restante.slice(0, maxLength)
      const ultimoSalto = fragmento.lastIndexOf('\n')
  
      // Si hay un salto de línea dentro del fragmento
      const puntoCorte = ultimoSalto !== -1 ? ultimoSalto + 1 : maxLength
  
      let fraseSaltoLinea = restante.slice(0, puntoCorte)
      if (fraseSaltoLinea.endsWith('\n')) {
        fraseSaltoLinea = fraseSaltoLinea.slice(0, -1);
      }
      if (fraseSaltoLinea.startsWith('\n')) {
        fraseSaltoLinea = fraseSaltoLinea.slice(1);
      }
      secciones.push(fraseSaltoLinea)
      restante = restante.slice(puntoCorte)
    }
  
    // Agregamos lo que queda (menos de 2000 caracteres)
    if (restante.length > 0) {
      secciones.push(restante)
    }
  
    return secciones
  }