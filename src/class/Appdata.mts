import { writeJsonFile } from "../lib/filesHelper.mts"


export class AppData {

    public static APP_DATA_PATH: string

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

        await writeJsonFile(this.APP_DATA_PATH, content)
    }
}