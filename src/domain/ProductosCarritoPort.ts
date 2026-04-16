import { ProductosCarrito } from './ProductosCarrito';

export interface ProductosCarritoPort {
    createProductosCarrito(pc: Omit<ProductosCarrito, 'id'>): Promise<number>;
    getProductosCarritoById(id: number): Promise<ProductosCarrito | null>;
    getAllProductosCarrito(): Promise<ProductosCarrito[]>;
    updateProductosCarrito(id: number, pc: Partial<ProductosCarrito>): Promise<boolean>;
    deleteProductosCarrito(id: number): Promise<boolean>;
} 