import { PedidoPort } from '../domain/PedidoPort';

export class PedidoService {
    private pedidoPort: PedidoPort;

    constructor(pedidoPort: PedidoPort) {
        this.pedidoPort = pedidoPort;
    }

    async createPedido(pedidoData: any) {
        const id = await this.pedidoPort.createPedido(pedidoData);
        return this.pedidoPort.getPedidoById(id);
    }

    async getAllPedidos() {
        return this.pedidoPort.getAllPedidos();
    }

    async getPedidoById(id: number) {
        return this.pedidoPort.getPedidoById(id);
    }

    async updatePedido(id: number, pedidoData: any) {
        await this.pedidoPort.updatePedido(id, pedidoData);
    }

    async deletePedido(id: number) {
        await this.pedidoPort.deletePedido(id);
    }
} 