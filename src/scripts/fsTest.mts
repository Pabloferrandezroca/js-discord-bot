import 'dotenv/config'
import { DocsLoader } from '../class/DocsLoader.mjs'

//console.log(await DocsLoader.getPluginData())
console.log(await DocsLoader.getBuildList());
(await DocsLoader.getBuildList() as any).buildsInformation.forEach(element => {
    if(element.name.toLowerCase() != 'core'){return}
    console.log(element.builds)
});