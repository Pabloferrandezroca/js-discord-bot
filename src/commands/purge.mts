import { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType, ChatInputCommandInteraction, MessageFlags, ChannelType, TextChannel } from 'discord.js'
import { Bot } from '../class/Bot.mts'
import { AppData } from '../class/Appdata.mts'
import { checkCache } from '../lib/gemini.mts'
import { DatabaseManager } from '../class/DatabaseManager.mts'
import { Log } from '../class/Log.mts'

const purgeCommand = new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Comando realizar borrados masivos')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts(InteractionContextType.Guild)
    .addSubcommand(subCommand => subCommand
        .setName('channel')
        .setDescription('Comando para borrar TODOS los mensajes de un canal')
        .addChannelOption(option =>
            option.setName('canal')
                .setName('channel')
                .setDescription('El canal donde eliminar los mensajes')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        )
        .addStringOption(option =>
            option.setName('codigo_de_seguridad')
                .setName('code')
                .setDescription('El código de seguridad proporcionado por el bot')
                .setRequired(true)
        )
    )
    .addSubcommandGroup(group => group
        .setName('bot')
        .setDescription('Para aspectos relacionados con el bot')
        .addSubcommand(subcommand => subcommand
            .setName('messages')
            .setDescription('Para borrar los mensajes del bot')
            .addIntegerOption(option =>
                option.setName('count')
                    .setName('count')
                    .setDescription('Cantidad de mensajes a borrar desde el más reciente')
                    .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('threads')
            .setDescription('Para borrar los threads del bot')
            .addIntegerOption(option =>
                option.setName('count')
                    .setName('count')
                    .setDescription('Cantidad de threads a borrar desde el más reciente')
                    .setRequired(true)
            )
        )
    )
    .addSubcommandGroup(group => group
        .setName('chatbot')
        .setDescription('Para aspectos relacionados con el chatbot')
        .addSubcommand(subcommand => subcommand
            .setName('cache')
            .setDescription('Para borrar la cache del chatbot')
        )
    )

async function channelGroup(interaction: ChatInputCommandInteraction) {
    if (interaction.options.getSubcommand() === 'channel') {
        let channel = interaction.options.getChannel('channel') as TextChannel
        let code = interaction.options.getString('code')
        if(code !== Bot.securityCode){
            interaction.reply({content: 'Codigo de verificación incorrecto'})
            return
        }

        interaction.reply({content: 'Eliminando mensajes', flags: MessageFlags.Ephemeral})
        // var numBulkDelete = parseFloat(3) + originalNum
        // channel.bulkDelete(numBulkDelete).catch(err => message.channel.send(`Error: messages older than 14 days cannot be deleted by this bot. Operation cancelled.`))
        
        let deleted
        do {
            // const messages = await channel.messages.fetch({ limit: 100 })
            // if (messages.size === 0) break;
            deleted = await channel.bulkDelete(100, true)
            
            //await new Promise(resolve => setTimeout(resolve, 500))
          } while (deleted.size > 0);
    }
}

async function chatbotGroup(interaction: ChatInputCommandInteraction) {
    if (interaction.options.getSubcommand() === 'cache') {
        await interaction.reply({content: '⏳ Actualizando cache (entre 10s y 10m)'})
        AppData.fs_doc_info.lastUpdate.setDate(AppData.fs_doc_info.lastUpdate.getDate() - 1)
        await AppData.save()
        await checkCache()
        await interaction.editReply({content: '🟢 Cache actualizada correctamente!'})
    }
}

async function botGroup(interaction: ChatInputCommandInteraction) {
    switch (interaction.options.getSubcommand()) {
        case 'messages':
            if(interaction.options.getInteger('count') <= 0){
                await interaction.reply({content: 'No puedes borrar menos de 1 mensaje', flags: MessageFlags.Ephemeral})
                return
            }

            await interaction.deferReply()

            let messages = await DatabaseManager.listMessages(interaction.options.getInteger('count'))
            const canales = await interaction.guild.channels.fetch();
            for (const [canalId, canal] of canales) {
                if (canal.type !== ChannelType.GuildText){continue}
                for (let mess of messages) {
    
                    try {
                        let mensajeId = mess.id_message
                        const mensaje = await canal.messages.fetch(mensajeId);
    
                        if (mensaje) {
                            if (mensaje.deletable) {
                                await mensaje.delete();
                                DatabaseManager.deleteMessage(mensajeId)
                                console.log(`Mensaje ${mensajeId} borrado del canal ${canal.name}`);
                            } else {
                                console.log(`No se puede borrar el mensaje ${mensajeId}`);
                            }
                        }
                    } catch (err) {
                        // Ignorar si el mensaje no está en ese canal
                        if (err.code === 10008) { // 10008 = Unknown Message
                            console.log(`Error en canal ${canal.name}:`, err.message);
                        } else {
                            throw err
                        }
                    }
                }
            }

            Log.success(`Borrados correctamente ${messages.length} mensajes`, 1)
            await interaction.deleteReply()
            break;

        case 'threads':
            if(interaction.options.getInteger('count') <= 0){
                await interaction.reply({content: 'No puedes borrar menos de 1 thread', flags: MessageFlags.Ephemeral})
                return
            }
            await interaction.deferReply()
            let threads = await DatabaseManager.listThreads(interaction.options.getInteger('count'))
            await interaction.deleteReply()
            break;
        default:
            break;
    }
}

async function purgeAction(interaction: ChatInputCommandInteraction) {
    switch (interaction.options.getSubcommandGroup()) {
        case 'bot':
            await botGroup(interaction)
            break;
        case 'channel':
            await channelGroup(interaction)
            break;
        case 'chatbot':
            await chatbotGroup(interaction)
            break;
        default:
            break;
    }
}

export { purgeCommand, purgeAction }