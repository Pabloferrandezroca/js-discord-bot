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