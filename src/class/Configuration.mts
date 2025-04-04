import path from "path";
import { fileURLToPath } from 'url';
import { fileExists, readJsonFile, writeJsonFile } from "../lib/filesHelper.mts"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_PATH = path.join(__dirname, 'data', 'config.json')

if(!fileExists(CONFIG_PATH)){
    writeJsonFile(CONFIG_PATH, {})
}

class Configuration {
    public static prefix = '!'
    public static welcomeChannelID = ''

    static loadConfig(data: {[key: string]: string|number})
    {
        for (let propiedad in data) {
            this[propiedad] = data[propiedad]
        }
    }

    static getProperties() : string[]
    {
        return Object.getOwnPropertyNames(this)
            .filter(prop => {
                return typeof this[prop] !== "function" 
                && prop !== "length" 
                && prop !== "prototype" 
                && prop !== "name"
            });
    }

    static async save(): Promise<void>
    {
        const staticProps = this.getProperties()
        
        let content = {}
        staticProps.forEach(prop => {
            content[prop] = this[prop]
        })

        await writeJsonFile(CONFIG_PATH, content)
    }
}

if(!await fileExists(CONFIG_PATH)){
    await Configuration.save()
}else{
    await Configuration.loadConfig(await readJsonFile(CONFIG_PATH))
}

export { Configuration }