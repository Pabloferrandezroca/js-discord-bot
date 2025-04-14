import { ChannelType, ChatInputCommandInteraction, InteractionContextType, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { configType, Configuration } from "../class/Configuration.mts"
import { Log } from "../class/Log.mts";

const setCommand = new SlashCommandBuilder()
    .setName('set')
    .setDescription('Cambiar aspectos de la configuración')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts(InteractionContextType.Guild)

const setLoadCommand = async () => {
    setCommand.addSubcommandGroup(subGroup => {
        subGroup
            .setName('var')
            .setDescription('Para cambiar variables de configuración del bot')

        Configuration.getProperties().forEach(prop => {
            subGroup.addSubcommand(subcommand => {
                subcommand
                    .setName(prop.toLocaleLowerCase())
                    .setDescription('Una propiedad de la configuración')
                let confType = Configuration.getPropertyType(prop)
                if (confType === configType.string) {
                    subcommand.addStringOption(option =>
                        option
                            .setName('value')
                            .setDescription('Nuevo string a reemplazar')
                            .setRequired(true)
                    )
                } else if (confType === configType.number) {
                    subcommand.addNumberOption(option =>
                        option
                            .setName('value')
                            .setDescription('Nuevo numero a reemplazar')
                            .setRequired(true)
                    )
                } else if (confType === configType.textChannel) {
                    subcommand.addChannelOption(option =>
                        option
                            .setName('value')
                            .addChannelTypes(ChannelType.GuildText)
                            .setDescription('Nuevo canal de texto a reemplazar')
                            .setRequired(true)
                    )
                }

                return subcommand
            })
        })
        return subGroup
    })
}

let setAction = async (interaction: ChatInputCommandInteraction) => {
    if(interaction.options.getSubcommandGroup() === 'var'){
        let prop = interaction.options.getSubcommand()
        let originProp = Configuration.getProperties().find(item => item.toLocaleLowerCase() === prop)
        let value, display
        let confType = Configuration.getPropertyType(originProp)
        if(confType === configType.string){
            value = interaction.options.getString('value')
            display = value
        }else if(confType === configType.number){
            value = interaction.options.getNumber('value')
            display = value
        }else if (confType === configType.textChannel){
            value = interaction.options.getChannel('value')
            display = value.name
        }


        interaction.reply({ content: `comando \`${prop}\`, valor: \`${display}\`` })
        Configuration.set(originProp, value)
        Configuration.save()
        Log.success(`Configuración modificada:`)
        Log.success(`'${originProp}' => [${value}]`, 1)
        }
}


export { setCommand, setAction, setLoadCommand }