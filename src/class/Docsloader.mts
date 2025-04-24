import 'dotenv/config'
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs, { existsSync } from 'fs';

async function obtenerDoc() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const DOC_PATH = __dirname.endsWith('class') ? path.join(__dirname, '..', 'data', 'doc.json') : path.join(__dirname, 'data', 'doc.json')

    if (existsSync(DOC_PATH)) {

        fs.stat(DOC_PATH, async (err, stats) => {
            if (err) {
                console.error('Error al obtener la información del archivo:', err);
                return;
            }
            const now = new Date();
            const fileDate = new Date(stats.mtime);
            const diffDays = (now.getTime() - fileDate.getTime()) / (1000 * 60 * 60 * 24);
            if (diffDays > 7) {
                fs.unlink(DOC_PATH, (err) => {
                    if (err) {
                        console.error('Error al borrar el archivo:', err);
                    } else {
                        console.log('Archivo borrado con éxito:', DOC_PATH);
                    }
                });

                await crearDoc(DOC_PATH);
            }
        });
    }
    else {
        await crearDoc(DOC_PATH);
    }
}

async function crearDoc(DOC_PATH: string): Promise<void> {
    const url = 'https://facturascripts.com/api/3/publications?filter%5Bidproject%5D=1';
    const token = process.env.FS_API_TOKEN;
    fetch(url, {
        method: 'GET',
        headers: {
            'token': `${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const totalCount = response.headers.get('X-Total-Count');
            console.log('Total de publicaciones:', totalCount);
            return response.json();
        })
        .then(data => {


            // Convertir a JSON y guardar
            fs.writeFile(DOC_PATH, JSON.stringify(data, null, 2), (err) => {
                if (err) {
                    console.error('Error al guardar el archivo JSON:', err);
                } else {
                    console.log('Archivo JSON guardado con éxito en', DOC_PATH);
                }
            })
        })
}

export { obtenerDoc }