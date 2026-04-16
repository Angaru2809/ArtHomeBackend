import { Producto } from './Producto';

export interface ProductoPort {
    createProducto(producto: Omit<Producto, 'id' | 'estado_stock' | 'fecha_agregado' | 'categoria'>): Promise<number>;
    getAllProductos(): Promise<Producto[]>;
    getProductoById(id: number): Promise<Producto | null>;
    updateProducto(id: number, producto: Partial<Producto>): Promise<boolean>;
    deleteProducto(id: number): Promise<boolean>;
    getCatalogoPorCategoria(categoria: number | string): Promise<Producto[]>;
    buscarPorNombre(nombre: string): Promise<Producto[]>;
} 