import { ProductosPedidoPort } from '../domain/ProductosPedidoPort';

export class ProductosPedidoService {
    private productosPedidoPort: ProductosPedidoPort;

    constructor(productosPedidoPort: ProductosPedidoPort) {
        this.productosPedidoPort = productosPedidoPort;
    }

    async createProductosPedido(ppData: any) {
        const id = await this.productosPedidoPort.createProductosPedido(ppData);
        return this.productosPedidoPort.getProductosPedidoById(id);
    }

    async getAllProductosPedido() {
        return this.productosPedidoPort.getAllProductosPedido();
    }

    async getProductosPedidoById(id: number) {
        return this.productosPedidoPort.getProductosPedidoById(id);
    }

    async updateProductosPedido(id: number, ppData: any) {
        await this.productosPedidoPort.updateProductosPedido(id, ppData);
    }

    async deleteProductosPedido(id: number) {
        await this.productosPedidoPort.deleteProductosPedido(id);
    }
} 