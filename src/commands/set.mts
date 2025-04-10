import { ActionRowBuilder, type CacheType, ButtonBuilder, ButtonStyle, ChannelSelectMenuBuilder, ChannelType, ChatInputCommandInteraction, InteractionContextType, ModalBuilder, PermissionFlagsBits, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction, StringSelectMenuOptionBuilder, TextChannel, TextInputBuilder, TextInputStyle, InteractionCallbackResponse, Message, ChannelSelectMenuInteraction } from "discord.js";
import { configType, Configuration } from "../class/Configuration.mts"
import { replyAndDelete, wait } from "../lib/helpers.mts"

let conf = Configuration.getConfiguration()

const setCommand = new SlashCommandBuilder()
    .setName('set')
    .setDescription('Cambiar aspectos de la configuración')

conf.getProperties().forEach(prop => {
    setCommand.addSubcommand(subcommand => {
        subcommand
            .setName(prop.toLocaleLowerCase())
            .setDescription('Una propiedad de la configuración')
        let confType = conf.getPropertyType(prop)
        if(confType === configType.string){
            subcommand.addStringOption(option =>
                option
                    .setName('value')
                    .setDescription('Nuevo a aplicar')
                    .setRequired(true)
            )
        }else if(confType === configType.number){
            subcommand.addNumberOption(option =>
                option
                    .setName('value')
                    .setDescription('Nuevo a aplicar')
                    .setRequired(true)
            )
        }else if (confType === configType.textChannel){
            subcommand.addChannelOption(option =>
                option
                    .setName('value')
                    .addChannelTypes(ChannelType.GuildText)
                    .setDescription('Nuevo a aplicar')
                    .setRequired(true)
            )
        }

        return subcommand
    })
})
    
setCommand
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts(InteractionContextType.Guild)


let setAction = async (interaction: ChatInputCommandInteraction) => {
    let prop = interaction.options.getSubcommand()
    let originProp = conf.getProperties().find(item => item.toLocaleLowerCase() === prop)
    let value
    let confType = conf.getPropertyType(originProp)
    if(confType === configType.string){
        value = interaction.options.getString('value')
    }else if(confType === configType.number){
        value = interaction.options.getNumber('value')
    }else if (confType === configType.textChannel){
        value = interaction.options.getChannel('value')
    }


    interaction.reply({ content: `comando \`${prop}\`, valor: \`${value}\`` })
    conf.set(originProp, value)
    console.log(originProp, conf.getProperties(), value)
    conf.save()
}


export { setCommand, setAction }