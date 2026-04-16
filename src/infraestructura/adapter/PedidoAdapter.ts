import { Repository } from 'typeorm';
import { Pedido } from '../entities/Pedido';
import { PedidoPort } from '../../domain/PedidoPort';
import { AppDataSource } from '../config/data-base';
import { ProductoAdapter } from './ProductoAdapter';

export class PedidoAdapter implements PedidoPort {
    private repository: Repository<Pedido>;
    private productoAdapter: ProductoAdapter;

    constructor() {
        this.repository = AppDataSource.getRepository(Pedido);
        this.productoAdapter = new ProductoAdapter();
    }

    async createPedido(pedidoData: any): Promise<number> {
        // 1. Descontar stock de cada producto
        if (pedidoData.productos && Array.isArray(pedidoData.productos)) {
            for (const item of pedidoData.productos) {
                const producto = await this.productoAdapter.getProductoById(item.productoId);
                if (!producto) throw new Error('Producto no encontrado');
                if (producto.cantidad_stock < item.cantidad) {
                    throw new Error(`Stock insuficiente para el producto ${producto.nombre}`);
                }
                await this.productoAdapter.updateProducto(producto.id, {
                    cantidad_stock: producto.cantidad_stock - item.cantidad
                });
            }
        }
        // 2. Crear el pedido normalmente
        const pedido = this.repository.create({ ...pedidoData, activo: pedidoData.activo !== false });
        const saved = await this.repository.save(pedido) as Pedido | Pedido[];
        if (Array.isArray(saved)) {
            return saved[0]?.id;
        }
        return saved.id;
    }

    async getPedidoById(id: number): Promise<any> {
        return this.repository.findOne({ where: { id, activo: true }, relations: ['usuario', 'direccionEnvio'] });
    }

    async getAllPedidos(): Promise<any[]> {
        return this.repository.find({ where: { activo: true }, relations: ['usuario', 'direccionEnvio'] });
    }

    async updatePedido(id: number, pedidoData: any): Promise<boolean> {
        const pedido = await this.repository.findOne({ where: { id } });
        if (!pedido) throw new Error('Pedido no encontrado');
        Object.assign(pedido, pedidoData);
        await this.repository.save(pedido);
        return true;
    }

    async deletePedido(id: number): Promise<boolean> {
        const pedido = await this.repository.findOne({ where: { id } });
        if (!pedido) throw new Error('Pedido no encontrado');
        if (!pedido.activo) return true;
        pedido.activo = false;
        await this.repository.save(pedido);
        return true;
    }
} 