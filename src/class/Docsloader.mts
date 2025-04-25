import 'dotenv/config'
import fs, { existsSync } from 'fs';
import { crearDoc } from '../lib/filesHelper.mts';

// TODO: convertir a una clase
// TODO: mover las funciones de creación de archivos a lib/filesHelper (refactorizar)
// TODO: asignar this.FS_DOC_DATA_PATH en class/Bot.mts (cambiarle el nombre a FS_DOC_DATA_PATH o algo similar)
// TODO: cuando se reciba el json con los datos convertir a un txt formateado correctamente que incluya solo datos esenciales como el contenido, la fecha y lo que se considere relevante.
export class DocsLoader {

    public static FS_DOC_DATA_PATH
    public static FS_DOC_DATA_PATH_TXT

    static async obtenerDoc() {

        if (existsSync(this.FS_DOC_DATA_PATH)) {

            fs.stat(this.FS_DOC_DATA_PATH, async (err, stats) => {
                if (err) {
                    console.error('Error al obtener la información del archivo:', err);
                    return;
                }
                const now = new Date();
                const fileDate = new Date(stats.mtime);
                const diffDays = (now.getTime() - fileDate.getTime()) / (1000 * 60 * 60 * 24);
                if (diffDays > 7) {
                    fs.unlink(this.FS_DOC_DATA_PATH, (err) => {
                        if (err) {
                            console.error('Error al borrar el archivo:', err);
                        } else {
                            console.log('Archivo borrado con éxito:', this.FS_DOC_DATA_PATH);
                        }
                    });

                    fs.unlink(this.FS_DOC_DATA_PATH_TXT, (err) => {
                        if (err) {
                            console.error('Error al borrar el archivo:', err);
                        } else {
                            console.log('Archivo borrado con éxito:', this.FS_DOC_DATA_PATH);
                        }
                    });

                    await crearDoc(this.FS_DOC_DATA_PATH, this.FS_DOC_DATA_PATH_TXT);
                }
            });
        }
        else {
            await crearDoc(this.FS_DOC_DATA_PATH, this.FS_DOC_DATA_PATH_TXT);
        }
    }
}