import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Producto } from './Producto';
// import { Pedido } from './Pedido'; // Descomentar cuando exista la entidad Pedido

@Entity({ name: 'productos_pedido', schema: 'arthome' })
export class ProductosPedido {
    @PrimaryGeneratedColumn()
    id!: number;

    // @ManyToOne(() => Pedido, pedido => pedido.productosPedido, { onDelete: 'CASCADE' })
    // @JoinColumn({ name: 'pedido_id' })
    // pedido!: Pedido;

    @Column({ name: 'pedido_id', type: 'int' })
    pedidoId!: number;

    @ManyToOne(() => Producto, producto => producto.productosPedido, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'producto_id' })
    producto!: Producto;

    @Column({ type: 'int' })
    cantidad!: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    precio!: number;
} 