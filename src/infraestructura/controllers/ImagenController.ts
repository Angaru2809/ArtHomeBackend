import { Request, Response } from 'express';
import { ImageStoragePort } from '../../domain/ImageStoragePort';

export class ImagenController {
    constructor(private readonly imageStorage: ImageStoragePort) {}

    async obtenerListaImagenes(req: Request, res: Response): Promise<void> {
        try {
            const { imagePaths, fileNames } = await this.imageStorage.listImages();

            res.json({
                success: true,
                imagenes: imagePaths,
                total: fileNames.length,
                archivos: fileNames,
                ultima_actualizacion: new Date().toISOString()
            });
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            if (msg === 'Directorio de imágenes no encontrado') {
                res.status(404).json({
                    success: false,
                    message: msg,
                    imagenes: []
                });
                return;
            }
            console.error('Error al obtener lista de imágenes:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener la lista de imágenes',
                error: msg,
                imagenes: []
            });
        }
    }

    async obtenerImagenesPorCategoria(req: Request, res: Response): Promise<void> {
        try {
            const { categoria } = req.params;
            const { imagePaths, fileNames } = await this.imageStorage.listImagesByCategory(categoria);

            res.json({
                success: true,
                categoria: categoria,
                imagenes: imagePaths,
                total: fileNames.length,
                archivos: fileNames
            });
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            if (msg === 'Directorio de imágenes no encontrado') {
                res.status(404).json({
                    success: false,
                    message: msg,
                    imagenes: []
                });
                return;
            }
            console.error('Error al obtener imágenes por categoría:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener las imágenes por categoría',
                error: msg,
                imagenes: []
            });
        }
    }
}
