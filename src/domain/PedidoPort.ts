import { Pedido } from './Pedido';

export interface PedidoPort {
    createPedido(pedido: Omit<Pedido, 'id'>): Promise<number>;
    getPedidoById(id: number): Promise<Pedido | null>;
    getAllPedidos(): Promise<Pedido[]>;
    updatePedido(id: number, pedido: Partial<Pedido>): Promise<boolean>;
    deletePedido(id: number): Promise<boolean>;
} 