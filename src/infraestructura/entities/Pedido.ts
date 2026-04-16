import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Usuario } from './Usuario';
import { DireccionEnvio } from './DireccionEnvio';


@Entity({ name: 'pedidos', schema: 'arthome' })
export class Pedido {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'usuario_id' })
    usuario!: Usuario;

    @ManyToOne(() => DireccionEnvio, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'direccion_envio_id' })
    direccionEnvio!: DireccionEnvio;

    @CreateDateColumn({ name: 'fecha_pedido', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fechaPedido!: Date;

    @Column({ name: 'estado_pago', length: 30 })
    estadoPago!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total!: number;

    /** false = pedido anulado/oculto (borrado lógico); la fila se conserva */
    @Column({ default: true })
    activo!: boolean;
} 