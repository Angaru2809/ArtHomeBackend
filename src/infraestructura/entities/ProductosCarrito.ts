import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Carrito } from './Carrito';
import { Producto } from './Producto';

@Entity({ name: 'productos_carrito', schema: 'arthome' })
export class ProductosCarrito {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Carrito, carrito => carrito.productosCarrito, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'carrito_id' })
    carrito!: Carrito;

    @ManyToOne(() => Producto, producto => producto.productosCarrito, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'producto_id' })
    producto!: Producto;

    @Column({ type: 'int' })
    cantidad!: number;
} 