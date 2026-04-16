import * as fs from 'fs';
import * as path from 'path';
import { ImageListResult, ImageStoragePort } from '../../domain/ImageStoragePort';

const IMAGE_EXT = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

/**
 * Almacenamiento en disco local (desarrollo o volumen compartido).
 * Ruta base configurable vía IMAGE_STORAGE_LOCAL_ROOT (relativa a cwd o absoluta).
 */
export class LocalImageStorageAdapter implements ImageStoragePort {
    constructor(private readonly localRoot: string) {}

    private resolveDir(): string {
        return path.isAbsolute(this.localRoot)
            ? this.localRoot
            : path.join(process.cwd(), this.localRoot);
    }

    private filterImageFiles(files: string[]): string[] {
        return files.filter((file) => {
            const ext = path.extname(file).toLowerCase();
            return IMAGE_EXT.includes(ext);
        });
    }

    async listImages(): Promise<ImageListResult> {
        const imagesDir = this.resolveDir();
        if (!fs.existsSync(imagesDir)) {
            throw new Error('Directorio de imágenes no encontrado');
        }
        const files = fs.readdirSync(imagesDir);
        const imageFiles = this.filterImageFiles(files);
        const imagePaths = imageFiles.map((file) => `/images/${file}`);
        return { imagePaths, fileNames: imageFiles };
    }

    async listImagesByCategory(categoria: string): Promise<ImageListResult> {
        const base = await this.listImages();
        const cat = categoria.toLowerCase();
        const fileNames = base.fileNames.filter((f) => f.toLowerCase().includes(cat));
        const imagePaths = fileNames.map((file) => `/images/${file}`);
        return { imagePaths, fileNames };
    }
}
