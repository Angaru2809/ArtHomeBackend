import { ImagenProductoPort } from '../domain/ImagenProductoPort';

export class ImagenProductoService {
    private imagenProductoPort: ImagenProductoPort;

    constructor(imagenProductoPort: ImagenProductoPort) {
        this.imagenProductoPort = imagenProductoPort;
    }

    async createImagenProducto(imagenData: any) {
        const id = await this.imagenProductoPort.createImagenProducto(imagenData);
        return this.imagenProductoPort.getImagenProductoById(id);
    }

    async getAllImagenesProducto() {
        return this.imagenProductoPort.getAllImagenesProducto();
    }

    async getImagenProductoById(id: number) {
        return this.imagenProductoPort.getImagenProductoById(id);
    }

    async updateImagenProducto(id: number, imagenData: any) {
        await this.imagenProductoPort.updateImagenProducto(id, imagenData);
    }

    async deleteImagenProducto(id: number) {
        await this.imagenProductoPort.deleteImagenProducto(id);
    }
} 