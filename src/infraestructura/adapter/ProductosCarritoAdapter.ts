import { Repository } from 'typeorm';
import { ProductosCarrito } from '../entities/ProductosCarrito';
import { ProductosCarritoPort } from '../../domain/ProductosCarritoPort';
import { AppDataSource } from '../config/data-base';

export class ProductosCarritoAdapter implements ProductosCarritoPort {
    private repository: Repository<ProductosCarrito>;

    constructor() {
        this.repository = AppDataSource.getRepository(ProductosCarrito);
    }

    async createProductosCarrito(pcData: any): Promise<number> {
        const pc = this.repository.create(pcData);
        const saved = await this.repository.save(pc) as ProductosCarrito | ProductosCarrito[];
        if (Array.isArray(saved)) {
            return saved[0]?.id;
        }
        return saved.id;
    }

    async getProductosCarritoById(id: number): Promise<any> {
        return this.repository.findOne({ where: { id }, relations: ['carrito', 'producto'] });
    }

    async getAllProductosCarrito(): Promise<any[]> {
        return this.repository.find({ relations: ['carrito', 'producto'] });
    }

    async updateProductosCarrito(id: number, pcData: any): Promise<boolean> {
        const pc = await this.repository.findOne({ where: { id } });
        if (!pc) throw new Error('Producto en carrito no encontrado');
        Object.assign(pc, pcData);
        await this.repository.save(pc);
        return true;
    }

    async deleteProductosCarrito(id: number): Promise<boolean> {
        const pc = await this.repository.findOne({ where: { id } });
        if (!pc) throw new Error('Producto en carrito no encontrado');
        await this.repository.remove(pc);
        return true;
    }
} 