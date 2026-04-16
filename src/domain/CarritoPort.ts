import { Carrito } from './Carrito';

export interface CarritoPort {
    createCarrito(carrito: Omit<Carrito, 'id'>): Promise<number>;
    getCarritoById(id: number): Promise<Carrito | null>;
    getAllCarritos(): Promise<Carrito[]>;
    updateCarrito(id: number, carrito: Partial<Carrito>): Promise<boolean>;
    deleteCarrito(id: number): Promise<boolean>;
} 