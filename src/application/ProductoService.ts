import { ProductoPort } from '../domain/ProductoPort';
import { Producto } from '../domain/Producto';

export class ProductoService {
    constructor(private productoPort: ProductoPort) {}

    async crearProducto(datos: {
        nombre: string;
        descripcion: string;
        precio: number;
        cantidad_stock: number;
        categoria_id: number;
        imagenUrl?: string;
    }): Promise<number> {
        return await this.productoPort.createProducto(datos);
    }

    async obtenerTodos(): Promise<Producto[]> {
        return await this.productoPort.getAllProductos();
    }

    async obtenerPorId(id: number): Promise<Producto | null> {
        return await this.productoPort.getProductoById(id);
    }

    async actualizarProducto(id: number, datos: Partial<Producto>): Promise<boolean> {
        return await this.productoPort.updateProducto(id, datos);
    }

    async eliminarProducto(id: number): Promise<boolean> {
        return await this.productoPort.deleteProducto(id);
    }

    async obtenerProductosConImagenes(): Promise<Producto[]> {
        const productos = await this.productoPort.getAllProductos();
        return productos.filter(producto => producto.imagenUrl && producto.imagenUrl.length > 0);
    }

    async getCatalogoPorCategoria(categoria: number | string) {
        return this.productoPort.getCatalogoPorCategoria(categoria);
    }

    async buscarPorNombre(nombre: string): Promise<Producto[]> {
        return await this.productoPort.buscarPorNombre(nombre);
    }
} 