import { ProductosPedido } from './ProductosPedido';

export interface ProductosPedidoPort {
    createProductosPedido(pp: Omit<ProductosPedido, 'id'>): Promise<number>;
    getProductosPedidoById(id: number): Promise<ProductosPedido | null>;
    getAllProductosPedido(): Promise<ProductosPedido[]>;
    updateProductosPedido(id: number, pp: Partial<ProductosPedido>): Promise<boolean>;
    deleteProductosPedido(id: number): Promise<boolean>;
} 