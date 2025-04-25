import 'dotenv/config'
import { DocsLoader } from '../class/DocsLoader.mjs'
import { FS_DOC_DATA_PATH } from '../paths.mjs'

await DocsLoader.saveFSData()