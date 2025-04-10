import path from "path"
import { fileURLToPath } from 'url'
import { fileExists, readJsonFile, writeJsonFile } from "../lib/filesHelper.mts"
import { Client, TextChannel } from "discord.js"
import 'colors'
import { fetchTextChannel } from "../lib/helpers.mts"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_PATH = __dirname.endsWith('class') ? path.join(__dirname, '..', 'data', 'config.json') : path.join(__dirname, 'data', 'config.json')

if(!fileExists(CONFIG_PATH)){
    writeJsonFile(CONFIG_PATH, {})
}

export enum configType {
    string,
    textChannel,
    number
}

type validValues = string|number|TextChannel

export class Configuration {

    public static prefix = '!'
    public static welcomeChannelID: TextChannel

    public static propertiesMap = {
        prefix: configType.string,
        welcomeChannelID: configType.textChannel
    }

    static async loadConfig(data: {[key: string]: string|number})
    {
        for (let prop in data) {
            if(this.type(prop) == configType.textChannel && data[prop] !== undefined){
                this[prop] = await fetchTextChannel(data[prop] as string)
            }else{
                this[prop] = data[prop]
            }
            
        }
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
            }
        })

        await writeJsonFile(CONFIG_PATH, content)
    }

    static set(property: string, value: validValues)
    {
        this[property] = value
    }

    static async init()
    {
        console.log(`==> Gestionando Configuración`.blue)
        if(!await fileExists(CONFIG_PATH)){
            await this.save()
            console.log(`\t-> Configuración creada en: ${CONFIG_PATH}`.green)
        }else{
            await this.loadConfig(await readJsonFile(CONFIG_PATH))
            console.log(`\t-> Configuración cargada en: ${CONFIG_PATH}`.green)
        }
    }
}