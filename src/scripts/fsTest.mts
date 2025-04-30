import 'dotenv/config'
import { DocsLoader } from '../class/DocsLoader.mjs'

console.log(await DocsLoader.getPluginData())