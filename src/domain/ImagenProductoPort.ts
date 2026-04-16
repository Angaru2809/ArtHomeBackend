export interface ImagenProductoPort {
    createImagenProducto(imagenData: any): Promise<number>;
    getAllImagenesProducto(): Promise<any[]>;
    getImagenProductoById(id: number): Promise<any | null>;
    updateImagenProducto(id: number, imagenData: any): Promise<boolean | void>;
    deleteImagenProducto(id: number): Promise<boolean | void>;
}
