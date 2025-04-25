import { readJsonFile, writeJsonFile } from "../lib/filesHelper.mts"


export class AppData {

    public static APP_DATA_PATH: string
    public static fs_doc_info = {
        cacheName: '',
        fileName: '',
        documentationPath: '',
        lastUpdate: new Date
    }

    static getProperties(): string[] {
        return Object.getOwnPropertyNames(this)
            .filter(prop => {
                return typeof this[prop] !== 'function'
                    && prop !== 'length'
                    && prop !== 'prototype'
                    && prop !== 'name'
                    && prop !== 'APP_DATA_PATH'
            });
    }

    static async loadData(): Promise<void> {
        const data = await readJsonFile(this.APP_DATA_PATH) as { [key: string]: string | number }
        for (let prop in data) {
            if (prop == 'fs_doc_info' && data[prop]) {
                this.fs_doc_info = {
                    cacheName: data[prop]['cacheName'],
                    fileName: data[prop]['fileName'],
                    documentationPath: data[prop]['documentationPath'],
                    lastUpdate: new Date(data[prop]['lastUpdate']),
                }
            } else {
                AppData[prop] = data[prop]
            }
        }
    }

    static async save(): Promise<void> {
        const staticProps = this.getProperties()

        let content = {}
        staticProps.forEach(prop => {
            content[prop] = this[prop]
        })

        await writeJsonFile(this.APP_DATA_PATH, content)
    }
}