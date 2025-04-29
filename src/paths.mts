import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const __data = path.join(__dirname, 'data')

export const __src = __dirname
export const CONFIG_PATH = path.join(__data, 'config.json')
export const APP_DATA_PATH = path.join(__data, 'appData.json')
export const FS_DOC_DATA_PATH = path.join(__data, 'fs_doc_data.txt')
export const DATABASE_PATH = path.join(__data, 'datos.db')