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

    public prefix = '!'
    public welcomeChannelID: TextChannel
    public warningChannelID: TextChannel

    public propertiesMap = {
        prefix: configType.string,
        welcomeChannelID: configType.textChannel,
        warningChannelID: configType.textChannel
    }

    private client: Client
    protected static singleton: Configuration

    private constructor(client: Client) {
        this.client = client
    }

    static getConfiguration(client?: Client)
    {
        if (!this.singleton) {
            if (!client) {
                console.error("==> Error: Debes proporcionar el cliente de Discord la primera vez que se inicializa la configuración.".red)
                process.exit(1)
            }

            const config = new this(client)
            
            this.singleton = config
        }

        return this.singleton
    }

    async loadConfig(data: {[key: string]: string|number})
    {
        for (let prop in data) {
            if(this.type(prop) == configType.textChannel && data[prop] !== undefined){
                this[prop] = await fetchTextChannel(this.client, data[prop])
            }else{
                this[prop] = data[prop]
            }
            
        }
    }

    getProperties() : string[]
    {
        return Object.keys(this.propertiesMap)
    }

    getPropertyType(property: string): configType
    {
        return this.propertiesMap[property]
    }

    type(property: string): configType
    {
        if(this.propertiesMap[property] === undefined){throw new Error('No existe la propiedad buscada, revisa el código.')}
        return this.propertiesMap[property]
    }

    async save(): Promise<void>
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

    set(property: string, value: validValues)
    {
        this[property] = value
    }

    async init()
    {
        if(!await fileExists(CONFIG_PATH)){
            await this.save()
            console.log(`==> Configuración creada en: ${CONFIG_PATH}`.green)
        }else{
            await this.loadConfig(await readJsonFile(CONFIG_PATH))
            console.log(`==> Configuración cargada en: ${CONFIG_PATH}`.green)
        }
    }
}