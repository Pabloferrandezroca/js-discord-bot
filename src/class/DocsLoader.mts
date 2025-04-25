import 'dotenv/config'
import { writeFileSync } from 'fs';
import { FS_DOC_DATA_PATH } from '../paths.mts';

export class DocsLoader {

    static async saveFSData() {
        const url = 'https://facturascripts.com/api/3/publications?limit=90000&filter%5Bidproject%5D=1';
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
        'El enlace de la documentación es https://facturascripts.com/publicaciones/{Link permanente}.\n'+
        `Este fichero ha sido actualizado ${new Date}. Se actualiza todos los días, orientate en cuanto al tiempo a esa fecha.\n\n\n`;
        data.forEach((element, index) => {
            if (element.fordevelopers === true || element.knowledge === true) {
                txtFileContents += `- Publicación numero ${index}\n`+
                `Título: ${element.title}\n`+
                `Fecha de creación: ${element.creationdate}\n`+
                `Fecha de modificación: ${element.lastmod}\n`+
                `Permalink: ${element.permalink}\n`+
                `contenido: --[[Inicio contenido]]--\n${element.body}\n--[[Fin contenido]]--\n`+
                `palabras clave: ${element.keywords}\n\n`
            }
        });

        writeFileSync(FS_DOC_DATA_PATH, txtFileContents)
    }
}