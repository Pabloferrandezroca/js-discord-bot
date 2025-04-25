import { promises as fs, writeFileSync } from 'fs';
import path from "path";

// Verifica si el archivo existe
export async function fileExists(filePath: string): Promise<boolean> 
{
    try {
        await fs.readFile(filePath);
        return true;
    } catch {
        return false;
    }
}

// Función para crear la carpeta si no existe
export async function createFolderIfNotExists(filePath: string): Promise<void> 
{
    const folderPath = path.dirname(filePath); // Extraemos la carpeta del archivo
    try {
      // Crear la carpeta (y las subcarpetas necesarias) si no existe
      await fs.mkdir(folderPath, { recursive: true });
    } catch (error) {
      console.error('Error al crear la carpeta:', error);
    }
  }
  

// Lee un archivo JSON si existe
export async function readJsonFile<T>(filePath: string): Promise<T | null> 
{

    if (await fileExists(filePath)) {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data) as T;
    } else {
        return null;
    }
}

// Escribe datos en un archivo JSON
export async function writeJsonFile<T>(filePath: string, data: T): Promise<void> 
{
    await createFolderIfNotExists(filePath)
    const json = JSON.stringify(data, null, 2);
    writeFileSync(filePath, json, 'utf-8');
}

export async function crearDoc(FS_DOC_DATA_PATH: string, FS_DOC_DATA_PATH_TXT: string) {
    const url = 'https://facturascripts.com/api/3/publications?limit=90000&filter%5Bidproject%5D=1';
    const token = process.env.FS_API_TOKEN;
    await fetch(url, {
        method: 'GET',
        headers: {
            'token': `${token}`
        }
    })
        .then(async response => {
            console.log('Respuesta de la API:');
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const totalCount = response.headers.get('X-Total-Count');
            console.log('Total de publicaciones:', totalCount);
            let resp = await response.text();
            resp = JSON.parse(resp);
            fs.writeFile(FS_DOC_DATA_PATH, JSON.stringify(resp, null, 2))
                .then(async () => {
                    const file = fs.readFile(FS_DOC_DATA_PATH, 'utf-8');
                    const data = JSON.parse(await file);
                    let string = '';
                    data.forEach(element => {
                        if(element.fordevelopers === true || element.knowledge === true){
                            string = string + element.body + '\n';                      
                        }
                    });
                    fs.writeFile(FS_DOC_DATA_PATH_TXT, string)
                    return FS_DOC_DATA_PATH_TXT;
                    
                })
                .catch((err: NodeJS.ErrnoException) => {
                    console.error('Error al guardar el archivo JSON:', err);
                }
            );
        })
}