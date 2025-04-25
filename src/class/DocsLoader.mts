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
}