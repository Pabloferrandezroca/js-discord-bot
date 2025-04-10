import { ActionRowBuilder, type CacheType, ButtonBuilder, ButtonStyle, ChannelSelectMenuBuilder, ChannelType, ChatInputCommandInteraction, InteractionContextType, ModalBuilder, PermissionFlagsBits, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction, StringSelectMenuOptionBuilder, TextChannel, TextInputBuilder, TextInputStyle, InteractionCallbackResponse, Message, ChannelSelectMenuInteraction } from "discord.js";
import { configType, Configuration } from "../class/Configuration.mts";
import { replyAndDelete, wait } from "../lib/helpers.mts";

const setCommand = new SlashCommandBuilder()
    .setName('set')
    .setDescription('Aplica valores a la configuración u otros aspectos.')
    .addSubcommand(subcommand =>
        subcommand
            .setName('config')
            .setDescription('Cambiar aspectos de la configuración')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts(InteractionContextType.Guild)


const setConfigAction = async (interaction: ChatInputCommandInteraction) => {
    
    const userIdFilter = i => i.user.id === interaction.user.id
    let result = await promptSelectMenu(interaction, userIdFilter)
    if(typeof result === 'boolean'){
        return
    }
    let selection = result.response
    //let reply = result.reply
    let reply: Message<boolean>
    interaction.editReply({content:`Seleccionado: \`${selection}\``, components: []})

    let confType = Configuration.type(selection)
    let response: string|TextChannel|number|void
    if(confType === configType.string){
        let input = await promptString('Introduce el nuevo valor:', 'miModal', interaction, userIdFilter)
        if(input === false){
            return replyAndDelete(5, interaction, { content: 'Se ha cancelado el formulario o no enviado a tiempo.', components: [] })
        }

        response = input as string
    }else if(confType === configType.number){
        let input = await promptNumber('Introduce el nuevo valor:', 'miModal', interaction, userIdFilter)
        if(input === false){
            return replyAndDelete(5, interaction, { content: 'Se ha cancelado el formulario o no enviado a tiempo.', components: [] })
        }else if(input === true){
            return replyAndDelete(5, interaction, { content: 'Número inválido, abortando.', components: [] })
        }

        response = input as number
    }else if (confType === configType.textChannel){
        let input = await promptChannel(interaction, userIdFilter)
        if(typeof input === 'boolean'){
            return
        }
        response = input.response
        reply = input.reply
    }else{
        throw new Error('Tipo de la propiedad de Configuration class desconocida o no contemplada.')
    }

    Configuration.set(selection, response)
    Configuration.save()
    if(reply){
        (async () => {
            await reply.edit({ content: 'Valor aplicado correctamente', components: [] })
            await wait(5)
            reply.delete()
        })()
    }

    replyAndDelete(5, interaction, {})
}

let setAction = async (interaction: ChatInputCommandInteraction) => {
    if(interaction.options.getSubcommand() === 'config'){
        await setConfigAction(interaction)
    }
}

let promptString = async (tittle: string, id: string, interaction: ChatInputCommandInteraction, userIdFilter: (any) => boolean): Promise<string|boolean> => {
    await interaction.showModal(
        new ModalBuilder()
            .setTitle(tittle)
            .setCustomId(id)
            .addComponents(new ActionRowBuilder<TextInputBuilder>()
                .addComponents(promptText)
            )
    )

    try {
        let modalInteraction = await interaction.awaitModalSubmit({filter: userIdFilter, time: 60_000})
        return modalInteraction.fields.getTextInputValue("textPrompt")
    } catch (error) {
        return false
    }
}

let promptNumber = async (tittle: string, id: string, interaction: ChatInputCommandInteraction, userIdFilter: (any) => boolean): Promise<number|boolean> => {
    await interaction.showModal(
        new ModalBuilder()
            .setTitle(tittle)
            .setCustomId(id)
            .addComponents(new ActionRowBuilder<TextInputBuilder>()
                .addComponents(promptNumberRow)
            )
    )

    try {
        let modalInteraction = await interaction.awaitModalSubmit({filter: userIdFilter, time: 60_000})
        let input = modalInteraction.fields.getTextInputValue("numberPrompt")
        let number = Number(input)
        if(input.trim() !== '' && !isNaN(number)){
            return number
        }else{
            return true
        }
    } catch (error) {
        return false
    }
}

let promptSelectMenu = async (interaction: ChatInputCommandInteraction, userIdFilter: (any) => boolean): Promise<{response: string, reply: InteractionCallbackResponse}|boolean> => {
    const menuOptions: StringSelectMenuOptionBuilder[] = []
    Configuration.getProperties().forEach(prop => {
        menuOptions.push(new StringSelectMenuOptionBuilder()
        .setLabel(prop).setValue(prop)
    )})
    selectMenu.setOptions(menuOptions)

    let reply = await interaction.reply({
        content: 'Selecciona la configuración a cambiar:',
        components: [
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu),
            new ActionRowBuilder<ButtonBuilder>().addComponents(exitButton)
        ],
        withResponse: true
    })
    
    try {
        let messageComponentResponse = await reply.resource.message.awaitMessageComponent({ filter: userIdFilter, time: 60_000 }) as StringSelectMenuInteraction<CacheType>
        
        if(messageComponentResponse.customId === 'exit'){
            replyAndDelete(5, interaction, { content: 'Cancelado.', components: [] })
            return true
        }

        let selection = messageComponentResponse.values[0] ?? ''
        if(!Configuration.getProperties().includes(selection)){
            replyAndDelete(5, messageComponentResponse, {
                content: 'No se ha encontrado la propiedad a buscar.',
                components: []
            })
            return false
        }

        return {response: selection, reply}
        
    } catch {
        replyAndDelete(5, interaction, { content: 'No se ha respondido a tiempo. Cancelada.', components: [] })
        return false
    }
}

let promptChannel = async (interaction: ChatInputCommandInteraction, userIdFilter: (any) => boolean): Promise<{response: TextChannel, reply: Message<boolean>}|boolean>=> {
    let reply = await interaction.followUp({
        content: 'Selecciona la configuración a cambiar:',
        components: [
            new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(promptChannelRow),
            new ActionRowBuilder<ButtonBuilder>().addComponents(exitButton)
        ],
        withResponse: true
    })
    
    try {
        let messageComponentResponse = await reply.awaitMessageComponent({ filter: userIdFilter, time: 60_000 }) as ChannelSelectMenuInteraction<CacheType>
        
        if(messageComponentResponse.customId === 'exit'){
            replyAndDelete(5, interaction, { content: 'Cancelado.', components: [] })
            return true
        }
        const channelId = messageComponentResponse.values[0]
        const channel = await interaction.client.channels.fetch(channelId) as TextChannel
        return {response: channel, reply}
        
    } catch {
        replyAndDelete(5, interaction, { content: 'No se ha respondido a tiempo. Cancelada.', components: [] })
        return false
    }
}

const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('selection')
    .setPlaceholder('...')

const promptChannelRow = new ChannelSelectMenuBuilder()
    .setCustomId('channelSelector')
    .setChannelTypes(ChannelType.GuildText)
    .setPlaceholder('...')

const promptNumberRow = new TextInputBuilder()
    .setCustomId('numberPrompt')
    .setLabel('Introduce el valor numérico:')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Ejemplo: 42')
    .setRequired(true);

const promptText = new TextInputBuilder()
    .setCustomId('textPrompt')
    .setLabel('Escribe el valor a asignar:')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('')
    .setRequired(true);

const exitButton = new ButtonBuilder()
    .setCustomId("exit")
    .setStyle(ButtonStyle.Secondary)
    .setLabel('Salir')


export { setCommand, setAction }