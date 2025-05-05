import 'dotenv/config'
import { writeFileSync } from 'fs';
import { FS_DOC_DATA_PATH } from '../paths.mts';

export class DocsLoader {

    static async saveFSData() {
        const url = 'http://facturascripts.com/api/3/publications?limit=90000&filter%5Bidproject%5D=1&sort%5Bknowledge%5D=desc&sort%5Bfordevelopers%5D=desc&sort%5Bidparent%5D=asc&sort%5Bordernum%5D=asc'
        const token = process.env.FS_API_TOKEN;

        let response = await fetch(url, {
            method: 'GET',
            headers: {
                'token': `${token}`
            }
        })

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`)
        }

        let resp = await response.text();
        let data = JSON.parse(resp) as {[key:string]: any}[];

        let txtFileContents = 'Lista de publicaciones de facturascripts filtradas por las que son para programadores.\n'+
        //'El enlace de la documentación es https://facturascripts.com/publicaciones/{Link permanente}.\n'+ se confunde
        `Este fichero ha sido actualizado ${new Date}. Se actualiza todos los días, orientate en cuanto al tiempo a esa\n\n\n`;
        data.forEach((element, index) => {
            if (element.fordevelopers === true || element.knowledge === true) {
                txtFileContents += `# ${element.title}\n`+
                `- Fecha de creación: ${element.creationdate}\n`+
                `- Fecha de modificación: ${element.lastmod}\n`+
                `- url: https://facturascripts.com/publicaciones/${element.permalink}\n`+
                `- palabras clave: ${element.keywords}\n`+
                `- contenido: \n--[[Inicio contenido]]--\n${element.body}\n--[[Fin contenido]]--\n\n`
            }
        });

        // let HTML_CHARS = ['<', '>', '"', "'"];
        // let HTML_REPLACEMENTS = ['&lt;', '&gt;', '&quot;', '&#39;'];
        // txtFileContents = txtFileContents.replaceAll()
        let HTML_CHARS = ['<', '>', '"', "'"];
        let HTML_REPLACEMENTS = ['&lt;', '&gt;', '&quot;', '&#39;'];

        for (let i = 0; i < HTML_REPLACEMENTS.length; i++) {
            txtFileContents = txtFileContents.replaceAll(HTML_REPLACEMENTS[i], HTML_CHARS[i]);
        }


        writeFileSync(FS_DOC_DATA_PATH, txtFileContents)
    }

    static async getPluginData() {
        const url = 'https://facturascripts.com/PluginInfoList'

        let response = await fetch(url, {
            method: 'GET'
        })

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`)
        }

        let resp = await response.text();
        let data = JSON.parse(resp) as {[key:string]: any}[];
        let txtFileContents = 'Lista de plugins de facturascripts.\n'
        data.forEach((element, index) => {
            txtFileContents += `# ${element.name}\n`+
            `- Descripcion: ${element.description}\n`+
            `- city: ${element.city}\n`+
            `- Precio: ${element.price}\n`+
            `- url: ${element.url}\n`
        }
        );
        let HTML_CHARS = ['<', '>', '"', "'"];
        let HTML_REPLACEMENTS = ['&lt;', '&gt;', '&quot;', '&#39;'];

        for (let i = 0; i < HTML_REPLACEMENTS.length; i++) {
            txtFileContents = txtFileContents.replaceAll(HTML_REPLACEMENTS[i], HTML_CHARS[i]);
        }
        return {pluginInformation: txtFileContents}
    }

    static async getBuildList(){
        const url = 'https://facturascripts.com/DownloadBuild'

        let response = await fetch(url, {
            method: 'GET'
        })

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`)
        }
        let resp = await response.text();
        let data = JSON.parse(resp) as {[key:string]: any}[];
        
        let outData = []

        data.forEach((element) => {
            let elementData = {
                name: element.name,
                builds: []
            }
            const sortedBuilds = [...element.builds].sort((a, b) => Number(b.version) - Number(a.version))
            sortedBuilds.forEach((build: {[key:string]: any}, index: number) => {
                if(index > 10){ return }
                
                let buildData = build.maxcore !== null && build.mincore !== null && build.maxcore !== 0 && build.mincore !== 0 ? {
                    version: build.version,
                    maxcore: Number(build.maxcore),
                    mincore: Number(build.mincore),
                    status: ''
                } : {
                    version: build.version,
                    status: ''
                }

                if (build.stable === true || build.beta === true) {
                    buildData.status = "estable-beta"
                }
                else if (build.stable === true || build.beta === false) {
                    buildData.status = " estable"
                }
                else if (build.stable === false || build.beta === true) {
                    buildData.status = " beta-inestable"
                } else {
                    buildData.status = " inestable"
                }
                
                elementData.builds.push(buildData)
            })

            outData.push(elementData)
        })
        
        return {buildsInformation: outData}
    }
}