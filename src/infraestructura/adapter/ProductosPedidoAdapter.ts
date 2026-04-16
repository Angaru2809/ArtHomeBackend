import { Repository } from 'typeorm';
import { ProductosPedido } from '../entities/ProductosPedido';
import { ProductosPedidoPort } from '../../domain/ProductosPedidoPort';
import { AppDataSource } from '../config/data-base';

export class ProductosPedidoAdapter implements ProductosPedidoPort {
    private repository: Repository<ProductosPedido>;

    constructor() {
        this.repository = AppDataSource.getRepository(ProductosPedido);
    }

    async createProductosPedido(ppData: any): Promise<number> {
        const pp = this.repository.create(ppData);
        const saved = await this.repository.save(pp) as ProductosPedido | ProductosPedido[];
        if (Array.isArray(saved)) {
            return saved[0]?.id;
        }
        return saved.id;
    }

    async getProductosPedidoById(id: number): Promise<any> {
        return this.repository.findOne({ where: { id }, relations: ['producto'] });
    }

    async getAllProductosPedido(): Promise<any[]> {
        return this.repository.find({ relations: ['producto'] });
    }

    async updateProductosPedido(id: number, ppData: any): Promise<boolean> {
        const pp = await this.repository.findOne({ where: { id } });
        if (!pp) throw new Error('Producto en pedido no encontrado');
        Object.assign(pp, ppData);
        await this.repository.save(pp);
        return true;
    }

    async deleteProductosPedido(id: number): Promise<boolean> {
        const pp = await this.repository.findOne({ where: { id } });
        if (!pp) throw new Error('Producto en pedido no encontrado');
        await this.repository.remove(pp);
        return true;
    }
} 