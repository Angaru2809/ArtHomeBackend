export interface Pedido {
    id?: number;
    usuarioId: number;
    direccionEnvioId: number;
    fechaPedido?: Date;
    estadoPago: string;
    total: number;
    activo?: boolean;
} 