import { ChannelType, ChatInputCommandInteraction, InteractionContextType, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { configType, Configuration } from "../class/Configuration.mts"

const setCommand = new SlashCommandBuilder()
    .setName('set')
    .setDescription('Cambiar aspectos de la configuración')

Configuration.getProperties().forEach(prop => {
    setCommand.addSubcommand(subcommand => {
        subcommand
            .setName(prop.toLocaleLowerCase())
            .setDescription('Una propiedad de la configuración')
        let confType = Configuration.getPropertyType(prop)
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
    let originProp = Configuration.getProperties().find(item => item.toLocaleLowerCase() === prop)
    let value
    let confType = Configuration.getPropertyType(originProp)
    if(confType === configType.string){
        value = interaction.options.getString('value')
    }else if(confType === configType.number){
        value = interaction.options.getNumber('value')
    }else if (confType === configType.textChannel){
        value = interaction.options.getChannel('value')
    }


    interaction.reply({ content: `comando \`${prop}\`, valor: \`${value}\`` })
    Configuration.set(originProp, value)
    console.log(originProp, Configuration.getProperties(), value)
    Configuration.save()
}


export { setCommand, setAction }