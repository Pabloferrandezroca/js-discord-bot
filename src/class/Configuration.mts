import { writeJsonFile } from "../lib/filesHelper.mts"
import { Client, TextChannel } from "discord.js"
import { fetchTextChannel } from "../lib/helpers.mts"

export enum configType {
    string,
    textChannel,
    number
}

type validValues = string|number|TextChannel

export class Configuration {

    public static CONFIG_PATH

    public static prefix = '!'
    public static welcomeChannelID: TextChannel
    public static warningChannelID: TextChannel

    public static propertiesMap = {
        prefix: configType.string,
        welcomeChannelID: configType.textChannel,
        warningChannelID: configType.textChannel
    }

    static getProperties() : string[]
    {
        return Object.keys(this.propertiesMap)
    }

    static getPropertyType(property: string): configType
    {
        return this.propertiesMap[property]
    }

    static type(property: string): configType
    {
        if(this.propertiesMap[property] === undefined){throw new Error('No existe la propiedad buscada, revisa el código.')}
        return this.propertiesMap[property]
    }

    static async save(): Promise<void>
    {
        const staticProps = this.getProperties()
        
        let content = {}
        staticProps.forEach(prop => {
            if(this.type(prop) == configType.textChannel && this[prop] !== undefined){
                content[prop] = this[prop].id
            }else{
                content[prop] = this[prop]
            }
        })

        await writeJsonFile(this.CONFIG_PATH, content)
    }

    static set(property: string, value: validValues)
    {
        this[property] = value
    }
}